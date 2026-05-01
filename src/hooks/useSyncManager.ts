import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { useToastAll } from '../components/Toast';
import { LocalProfileRepository } from '../repository/localProfileRepository';
import RestaurantRepository from '../repository/restaurantRepository';
import { useAuthStore } from '../store/authStore';

export const useSyncManager = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToastAll();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && user?.id && user?.restaurant?.id) {
        const userId = String(user.id);
        if (!userId || userId === 'null' || userId === 'undefined') {
          console.error('SyncManager: userId inválido para sincronização', user.id);
          return;
        }
        
        const local = LocalProfileRepository.getProfile(userId);
        if (local && local.dirty === 1) {
          try {
            console.log('🔄 SyncManager: Sincronizando alterações pendentes...');
            const response = await RestaurantRepository.updateRestaurant(user.restaurant.id, {
              userId: user.id,
              name: (local.data as any)?.name ?? local.name ?? undefined,
              cnpj: (local.data as any)?.cnpj ?? undefined,
              cep: (local.data as any)?.cep ?? undefined,
              number: (local.data as any)?.number ?? undefined,
              profileImage: (local.data as any)?.profileImage ?? local.photo ?? undefined,
            });
            
            if (response?.data) {
              // Atualiza zustand
              useAuthStore.getState().updateUserRestaurant(response.data);
              // Atualiza perfil local removendo dirty e salvando dados mais recentes do servidor
              LocalProfileRepository.upsertProfile({
                userId,
                name: response.data.name,
                email: user.email,
                photo: response.data.profileImage,
                data: response.data,
                dirty: 0,
              });
            } else {
              // fallback: limpa dirty mesmo assim
              LocalProfileRepository.markClean(userId);
            }
            
            showSuccess('Perfil sincronizado automaticamente!');
            console.log('✅ SyncManager: Sincronização concluída com sucesso');
          } catch (e) {
            showError('Erro ao sincronizar perfil automaticamente!');
            console.error('❌ SyncManager: Erro na sincronização', e);
            // mantém dirty para tentar novamente depois
          }
        }
      }
    });

    return () => unsubscribe();
  }, [user, showSuccess, showError]);
};
