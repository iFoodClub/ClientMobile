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
import CompanyRepository from "@/src/repository/companyRepository";
import EmployeeRepository from "@/src/repository/employeeRepository";
import { useToastAll } from "@/src/components/Toast";

const SettingsScreen = () => {
  const {
    logout,
    user,
    updateUserRestaurant,
    updateUserCompany,
    updateUserEmployee,
    isCompany,
    isRestaurant,
    isEmployee
  } = useAuthStore();

  const { showSuccess, showError } = useToastAll();
  const [modalVisible, setModalVisible] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const getProfileImage = () => {
    if (isRestaurant && user?.restaurant) return user.restaurant.image;
    if (isCompany && user?.company) return user.company.profileImage;
    if (isEmployee && user?.employee) return user.employee.profileImage;
    return user?.profileImage || "";
  };

  const getProfileName = () => {
    if (isRestaurant && user?.restaurant) return user.restaurant.name;
    if (isCompany && user?.company) return user.company.name;
    if (isEmployee && user?.employee) return user.employee.name;
    return user?.name || "";
  };

  const handleUpdateInfo = () => {
    router.push({
      pathname: "/perfil-form",
    });
  };

  const handleUpdateImage = async () => {
    if (!newImageUrl) return;
    
    try {
      setLoading(true);

      if (isRestaurant && user?.restaurant?.id) {
        const response = await RestaurantRepository.updateRestaurant(
          user.restaurant.id,
          { ...user.restaurant, image: newImageUrl } as any
        );
        if (response.status === 200) {
          updateUserRestaurant({ image: newImageUrl } as any);
          showSuccess("Foto atualizada!");
          setModalVisible(false);
        }
      } else if (isCompany && user?.company?.id) {
        const response = await CompanyRepository.updateCompany(
          user.company.id,
          { ...user.company, profileImage: newImageUrl } as any
        );
        if (response.status === 200) {
          updateUserCompany({ profileImage: newImageUrl } as any);
          showSuccess("Foto atualizada!");
          setModalVisible(false);
        }
      } else if (isEmployee && user?.employee?.id) {
        const response = await EmployeeRepository.updateEmployee(
          user.employee.id,
          { ...user.employee, profileImage: newImageUrl } as any
        );
        if (response.status === 200) {
          updateUserEmployee({ profileImage: newImageUrl } as any);
          showSuccess("Foto atualizada!");
          setModalVisible(false);
        }
      }
    } catch (e) {
      showError("Erro ao atualizar foto.");
    } finally {
      setLoading(false);
    }
  };

  const configItens = [
    {
      icon: (
        <Ionicons name="person-outline" size={22} color="#4B5563" />
      ),
      label: "Dados da conta",
      onPress: handleUpdateInfo,
    },
    {
      icon: (
        <Ionicons name="notifications-outline" size={22} color="#4B5563" />
      ),
      label: "Notificações",
      onPress: () => {},
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
        <Ionicons name="help-circle-outline" size={22} color="#4B5563" />
      ),
      label: "Ajuda",
      onPress: () => {},
    },
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
              onPress={() => {
                setNewImageUrl(getProfileImage() || "");
                setModalVisible(true);
              }}
              className="relative"
            >
              <Image
                className="w-20 h-20 rounded-full border-2 border-white bg-gray-100 shadow-sm"
                source={{ uri: getProfileImage() }}
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
                {getProfileName()}
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
