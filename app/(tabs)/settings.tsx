import PageHeader from "@/components/PageHeader/PageHeader";
import ConfigItem from "@/components/ui/ConfigItem/ConfigItem";
import { COLORS } from "@/src/constants/colors";
import { UserType } from "@/src/interfaces/interfaces";
import { useAuthStore } from "@/src/store/authStore";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CModal from "@/components/ui/Modal/CModal";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import CompanyRepository from "@/src/repository/companyRepository";
import EmployeeRepository from "@/src/repository/employeeRepository";
import { useToastAll } from "@/src/components/Toast";
import * as ImagePicker from "expo-image-picker";
import UploadRepository from "@/src/repository/uploadRepository";

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
    if (isCompany && user?.company) return user.company.profileImage || user.profileImage || "";
    if (isEmployee && user?.employee) return user.employee.profileImage || user.profileImage || "";
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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos da permissão de acesso à galeria para selecionar a foto.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setNewImageUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.error("[ImagePicker] Erro ao selecionar:", err);
      showError("Erro ao acessar a galeria.");
    }
  };

  const handleUpdateImage = async () => {
    if (!newImageUrl) return;
    
    try {
      setLoading(true);

      // Se a imagem for local, faz o upload para a pasta 'perfis' na Azure primeiro
      let finalImageUrl = newImageUrl;
      if (newImageUrl && !newImageUrl.startsWith("http")) {
        const uploadRes = await UploadRepository.uploadImage(newImageUrl, "perfis");
        if (uploadRes.data?.success && uploadRes.data?.data?.url) {
          finalImageUrl = uploadRes.data.data.url;
        } else {
          throw new Error("Falha ao subir foto");
        }
      }

      if (isRestaurant && user?.restaurant?.id) {
        const response = await RestaurantRepository.updateRestaurant(
          user.restaurant.id,
          {
            userId: user.id,
            name: user.restaurant.name,
            cnpj: user.restaurant.cnpj,
            cep: user.restaurant.cep,
            rua: user.restaurant.rua,
            number: user.restaurant.number,
            profileImage: finalImageUrl,
            openingTime: user.restaurant.openingTime,
            closingTime: user.restaurant.closingTime,
          }
        );
        if (response.status === 200) {
          updateUserRestaurant({ image: finalImageUrl } as any);
          showSuccess("Foto atualizada!");
          setModalVisible(false);
        }
      } else if (isCompany && user?.company?.id) {
        const response = await CompanyRepository.updateCompany(
          user.company.id,
          {
            userId: user.id,
            name: user.company.name,
            cnpj: user.company.cnpj,
            cep: user.company.cep,
            number: user.company.number,
            restaurantId: user.company.restaurantId,
            profileImage: finalImageUrl,
          } as any
        );
        if (response.status === 200) {
          updateUserCompany({ profileImage: finalImageUrl } as any);
          showSuccess("Foto atualizada!");
          setModalVisible(false);
        }
      } else if (isEmployee && user?.employee?.id) {
        const response = await EmployeeRepository.updateEmployee(
          user.employee.id,
          {
            userId: user.id,
            companyId: user.employee.companyId,
            name: user.employee.name || user.name,
            cpf: user.employee.cpf,
            birthDate: user.employee.birthDate,
            vacation: user.employee.vacation,
            profileImage: finalImageUrl,
          } as any
        );
        if (response.status === 200) {
          updateUserEmployee({ profileImage: finalImageUrl } as any);
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
        router.push("/favorites" as any);
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
        subtitle="Selecione uma foto da sua galeria"
        onClose={() => setModalVisible(false)}
        onConfirm={handleUpdateImage}
        confirmText="Salvar Foto"
        loading={loading}
      >
        <View className="mt-2">
          <Text className="text-sm font-semibold text-gray-600 mb-2 ml-1">Foto de Perfil</Text>
          <TouchableOpacity
            onPress={pickImage}
            disabled={loading}
            activeOpacity={0.7}
            className="w-full h-40 bg-gray-50 border border-dashed border-gray-300 rounded-2xl items-center justify-center mb-4 overflow-hidden relative"
          >
            {newImageUrl ? (
              <>
                <Image
                  source={{ uri: newImageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/40 items-center justify-center">
                  <View className="flex-row items-center bg-black/50 px-3 py-1.5 rounded-full">
                    <Ionicons name="camera-outline" size={16} color="white" />
                    <Text className="text-white text-xs font-semibold ml-1.5">Trocar imagem</Text>
                  </View>
                </View>
              </>
            ) : (
              <View className="items-center px-4">
                <Ionicons name="image-outline" size={36} color="#9CA3AF" />
                <Text className="text-gray-500 font-semibold text-sm mt-2">Escolher foto de perfil</Text>
                <Text className="text-gray-400 text-xs text-center mt-1">JPEG, PNG ou WebP até 5MB</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </CModal>
    </View>
  );
};

export default SettingsScreen;
