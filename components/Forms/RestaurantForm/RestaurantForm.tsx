import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { useToastAll } from "@/src/components/Toast";
import { runMigrations, clearDatabase } from "@/src/db";
import { IUpdateRestaurantDTO } from "@/src/interfaces/dtos";
import { LocalProfileRepository } from "@/src/repository/localProfileRepository";
import RestaurantRepository from "@/src/repository/restaurantRepository";
import { useAuthStore } from "@/src/store/authStore";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, Text, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import UploadRepository from "@/src/repository/uploadRepository";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/colors";

const RestaurantForm = () => {
  const { user, updateUserRestaurant } = useAuthStore();
  const { showSuccess, showError, showInfo } = useToastAll();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<IUpdateRestaurantDTO>({
    mode: "onBlur",
  });

  const profileImage = watch("profileImage");

  useEffect(() => {
    async function hydrate() {
      await runMigrations();

      const state = await NetInfo.fetch();
      if (state.isConnected) {
        reset({
          userId: user?.id,
          name: user?.restaurant?.name,
          cnpj: user?.restaurant?.cnpj,
          cep: user?.restaurant?.cep,
          rua: user?.restaurant?.rua,
          number: user?.restaurant?.number,
          profileImage: user?.restaurant?.image,
          openingTime: user?.restaurant?.openingTime,
          closingTime: user?.restaurant?.closingTime,
        });
        return;
      }
      if (user?.id) {
        const local = LocalProfileRepository.getProfile(String(user.id));
        if (local) {
          const data: any = local.data || {};
          reset({
            userId: Number(local.userId),
            name: data.name ?? local.name ?? user?.restaurant?.name,
            cnpj: data.cnpj ?? user?.restaurant?.cnpj,
            cep: data.cep ?? user?.restaurant?.cep,
            number: data.number ?? user?.restaurant?.number,
            profileImage:
              data.profileImage ?? local.photo ?? user?.restaurant?.image,
            rua: data.rua ?? user?.restaurant?.rua,
            openingTime: data.openingTime ?? user?.restaurant?.openingTime,
            closingTime: data.closingTime ?? user?.restaurant?.closingTime,
          });
          return;
        }
      }
      reset({
        userId: user?.id,
        name: user?.restaurant?.name,
        cnpj: user?.restaurant?.cnpj,
        cep: user?.restaurant?.cep,
        rua: user?.restaurant?.rua,
        number: user?.restaurant?.number,
        profileImage: user?.restaurant?.image,
        openingTime: user?.restaurant?.openingTime,
        closingTime: user?.restaurant?.closingTime,
      });
    }
    hydrate();
  }, [user, reset]);

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
        setValue("profileImage", result.assets[0].uri, { shouldDirty: true });
      }
    } catch (err) {
      console.error("[ImagePicker] Erro ao selecionar:", err);
      showError("Erro ao acessar a galeria.");
    }
  };

  async function onSubmit(data: IUpdateRestaurantDTO) {
    try {
      if (!isDirty) {
        showInfo("Sem dados para atualizar.");
        return;
      }
      setLoading(true);
      await runMigrations();

      if (!user?.id) {
        showError("Usuário não encontrado.");
        return;
      }

      const userId = String(user.id);
      const net = await NetInfo.fetch();

      if (!net.isConnected) {
        LocalProfileRepository.upsertProfile({
          userId,
          name: data.name,
          email: user?.email,
          photo: data.profileImage,
          data,
          dirty: 1,
        });

        updateUserRestaurant({ ...data, image: data.profileImage } as any);
        showSuccess("Alterações salvas offline.");
        return;
      }

      if (!user?.restaurant?.id) {
        showError("Restaurante não encontrado.");
        return;
      }

      let finalProfileImageUrl = data.profileImage;
      if (data.profileImage && !data.profileImage.startsWith("http")) {
        const uploadRes = await UploadRepository.uploadImage(data.profileImage, "perfis");
        if (uploadRes.data?.success && uploadRes.data?.data?.url) {
          finalProfileImageUrl = uploadRes.data.data.url;
        } else {
          throw new Error("Falha ao subir foto de perfil");
        }
      }

      const updatedData = {
        ...data,
        profileImage: finalProfileImageUrl,
      };

      const response = await RestaurantRepository.updateRestaurant(
        user.restaurant.id,
        updatedData
      );

      if (response.status === 200) {
        updateUserRestaurant({ ...updatedData, image: finalProfileImageUrl } as any);
        LocalProfileRepository.upsertProfile({
          userId,
          name: updatedData.name,
          email: user?.email,
          photo: finalProfileImageUrl,
          data: updatedData,
          dirty: 0,
        });
        showSuccess("Restaurante atualizado!");
      }
    } catch (_error) {
      console.error("[RestaurantForm] Erro ao salvar:", _error);
      showError("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="px-0 pb-10">
      {/* Seção: Foto de Perfil */}
      <View className="items-center mb-8">
        <TouchableOpacity
          onPress={pickImage}
          disabled={loading}
          activeOpacity={0.8}
          className="relative"
        >
          <View className="w-28 h-28 rounded-full border-4 border-gray-100 bg-gray-50 shadow-md items-center justify-center overflow-hidden">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="restaurant-outline" size={40} color="#9CA3AF" />
            )}
          </View>
          {/* Overlay da câmera */}
          <View className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white shadow-md">
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>
        <Text className="text-gray-500 text-xs mt-2 font-medium">Toque para alterar a foto do restaurante</Text>
      </View>

      {/* Seção: Informações Básicas */}
      <View className="mb-6">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Informações do Restaurante</Text>
        <CustomInput 
          control={control} 
          name="name" 
          label="Nome Fantasia" 
          placeholder="Ex: Sabores do Chef" 
        />
      </View>

      {/* Seção: Operação */}
      <View className="mb-6">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Funcionamento</Text>
        <View className="flex-row gap-x-4">
          <View className="flex-1">
            <CustomInput
              control={control}
              name="openingTime"
              label="Abre às"
              placeholder="08:00"
              maxLength={5}
            />
          </View>
          <View className="flex-1">
            <CustomInput
              control={control}
              name="closingTime"
              label="Fecha às"
              placeholder="22:00"
              maxLength={5}
            />
          </View>
        </View>
      </View>

      {/* Seção: Endereço */}
      <View className="mb-6">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Localização</Text>
        <CustomInput
          control={control}
          name="cep"
          label="CEP"
          placeholder="00000-000"
          maxLength={9}
          keyboardType="numeric"
        />
        <CustomInput 
          control={control} 
          name="rua" 
          label="Rua / Logradouro" 
          placeholder="Nome da rua"
        />
        <CustomInput
          control={control}
          name="number"
          label="Número"
          placeholder="123"
          maxLength={10}
          keyboardType="numeric"
        />
      </View>

      {/* Seção: Dados Jurídicos */}
      <View className="mb-8 opacity-70">
        <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Dados Cadastrais</Text>
        <CustomInput
          control={control}
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0001-00"
          editable={false}
        />
        <Text className="text-gray-400 text-[10px] ml-1 -mt-2">
          Para alterar o CNPJ, entre em contato com o suporte.
        </Text>
      </View>

      <Button
        className="mt-4"
        text="Salvar Alterações"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!isDirty}
      />

      {__DEV__ && (
        <Button
          className="mt-10 bg-gray-100"
          text="Limpar Banco (Debug)"
          onPress={() => {
            clearDatabase();
            runMigrations();
            showInfo("Banco limpo");
          }}
        />
      )}
    </View>
  );
};

export default RestaurantForm;
