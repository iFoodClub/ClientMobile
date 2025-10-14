import PressableButton from "@/components/Button/PressableButton";
import RestaurantForm from "@/components/Forms/RestaurantForm/RestaurantForm";

import PageHeader from "@/components/PageHeader/PageHeader";
import { useToastAll } from '@/src/components/Toast';
import { runMigrations } from "@/src/db";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PerfilForm = () => {
  const { user, isRestaurant, isCompany, isEmployee } = useAuthStore();
  const { showSuccess, showError } = useToastAll();

  // ao montar, garantir tabelas e, se online, sincronizar perfil se houver alterações locais
  useEffect(() => {
    runMigrations();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && user?.id && user?.restaurant?.id) {
        const userId = String(user.id);
        if (!userId || userId === 'null' || userId === 'undefined') {
          console.error('PerfilForm: userId inválido para sincronização', user.id);
          return;
        }
        
        const local = LocalProfileRepository.getProfile(userId);
        if (local && local.dirty === 1) {
          try {
            console.log('PerfilForm: Sincronizando alterações pendentes...');
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
              useAuthStore.getState().updateUserRestaurant(user.restaurant.id, response.data);
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
            showSuccess('Perfil sincronizado com sucesso!');
            console.log('PerfilForm: Sincronização concluída com sucesso');
          } catch (e) {
            showError('Erro ao sincronizar perfil!');
            console.error('PerfilForm: Erro na sincronização', e);
            // mantém dirty para tentar novamente depois
          }
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  function handleBackButton() {
    router.push({
      pathname: "/settings",
    });
  }

  return (
    <SafeAreaView>
      <View className="pl-2">
        <PressableButton
          className=""
          onPress={handleBackButton}
          icon={<AntDesign name="arrow-left" size={16} color="black" />}
        />
      </View>
      <PageHeader title="Editar Perfil" subtitle="Atualize suas informações" />
      <ScrollView>{isRestaurant && <RestaurantForm />}</ScrollView>
    </SafeAreaView>
  );
};

export default PerfilForm;
