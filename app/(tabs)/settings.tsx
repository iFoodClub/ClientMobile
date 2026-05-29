import PageHeader from "@/components/PageHeader/PageHeader";
import ConfigItem from "@/components/ui/ConfigItem/ConfigItem";
import { COLORS } from "@/src/constants/colors";
import { UserType } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CModal from "@/components/ui/Modal/CModal";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import { useToastAll } from "@/src/components/Toast";

const SettingsScreen = () => {
  const { logout, user, updateUserRestaurant, isCompany } = useAuthStore();
  const { showSuccess, showError } = useToastAll();
  const [modalVisible, setModalVisible] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(user?.restaurant?.image || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateInfo = () => {
    router.push({
      pathname: "/perfil-form",
    });
  };

  const handleUpdateImage = async () => {
    if (!newImageUrl || !user?.restaurant?.id) return;
    
    try {
      setLoading(true);
      const response = await RestaurantRepository.updateRestaurant(
        user.restaurant.id,
        { ...user.restaurant, image: newImageUrl } as any
      );

      if (response.status === 200) {
        updateUserRestaurant({ profileImage: newImageUrl } as any);
        showSuccess("Foto atualizada!");
        setModalVisible(false);
      }
    } catch (e) {
      showError("Erro ao atualizar foto.");
    } finally {
      setLoading(false);
    }
  };

  const hoursMissing = !!user?.restaurant && (!user.restaurant.openingTime || !user.restaurant.closingTime);

  const configItens = [
    {
      icon: (
        <Ionicons name="person-outline" size={22} color="#4B5563" />
      ),
      label: "Dados da conta",
      onPress: handleUpdateInfo,
      showBadge: hoursMissing,
    },
    ...(isCompany ? [{
      icon: (
        <Ionicons name="heart-outline" size={22} color="#4B5563" />
      ),
      label: "Meus Favoritos",
      onPress: () => {
        router.push("/favorites");
      },
    }] : []),
    {
      icon: (
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
      ),
      label: "Sair",
      onPress: async () => {
        await logout();
        router.replace("/sign-in");
      },
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Estilo iFood: Fundo Colorido Suave */}
        <View className="bg-primary/10 pt-16 pb-10 px-6 rounded-b-[40px]">
          <Text className="text-3xl font-bold text-gray-900 mb-8">Perfil</Text>
          
          <TouchableOpacity 
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              className="relative"
            >
              <Image
                className="w-20 h-20 rounded-full border-2 border-white bg-gray-100 shadow-sm"
                source={{ uri: user?.restaurant?.image || user?.profileImage }}
              />
              <View className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full items-center justify-center shadow-md">
                <Ionicons name="camera" size={16} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleUpdateInfo}
              className="ml-4 flex-1"
            >
              <Text className="font-bold text-xl text-gray-900">
                {user?.restaurant?.name || user?.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-primary font-medium mr-1">Editar perfil</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Lista de Itens com Divisores */}
        <View className="mt-4">
          {configItens.map((item, index) => {
            return (
              <View key={index}>
                <View className="px-6">
                  <ConfigItem {...item} />
                </View>
                {index < configItens.length - 1 && (
                  <View className="h-[1px] bg-gray-100 ml-20" />
                )}
              </View>
            );
          })}
        </View>

        {/* Versão do App (detalhe charmoso) */}
        <View className="items-center mt-10 mb-20">
          <Text className="text-gray-300 text-xs">FoodClub v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal para Troca de Foto na Settings */}
      <CModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="Alterar Foto de Perfil"
        subtitle="Informe a URL da nova imagem"
        onClose={() => setModalVisible(false)}
        onConfirm={handleUpdateImage}
        confirmText="Salvar Foto"
        loading={loading}
      >
        <View className="mt-2">
          <Text className="text-xs font-semibold text-gray-600 mb-2 ml-1">URL da Imagem</Text>
          <TextInput 
            className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm text-gray-700"
            placeholder="https://link-da-imagem.com/foto.jpg"
            value={newImageUrl}
            onChangeText={setNewImageUrl}
            autoCapitalize="none"
          />
        </View>
      </CModal>
    </View>
  );
};

export default SettingsScreen;
