import CustomInput from "@/components/CustomInput/CustomInput";
import { ICreateDishDTO } from "@/src/interfaces/interfaces";
import React from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useToastAll } from "@/src/components/Toast";
import { Ionicons } from "@expo/vector-icons";

type DishFormProps = {
  control: Control<ICreateDishDTO, any, ICreateDishDTO>;
  setValue: UseFormSetValue<ICreateDishDTO>;
  watch: UseFormWatch<ICreateDishDTO>;
};

const DishForm = ({ control, setValue, watch }: DishFormProps) => {
  const { showError } = useToastAll();
  const currentImageUrl = watch("image");

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
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const selectedUri = result.assets[0].uri;
        setValue("image", selectedUri, { shouldDirty: true });
      }
    } catch (err) {
      console.error("[ImagePicker] Erro ao selecionar:", err);
      showError("Erro ao acessar a galeria.");
    }
  };

  return (
    <View>
      <Text className="text-sm font-semibold text-gray-600 mb-2 ml-1">Foto do Prato</Text>
      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={0.7}
        className="w-full h-40 bg-gray-50 border border-dashed border-gray-300 rounded-2xl items-center justify-center mb-4 overflow-hidden relative"
      >
        {currentImageUrl ? (
          <>
            <Image
              source={{ uri: currentImageUrl }}
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
            <Text className="text-gray-500 font-semibold text-sm mt-2">Escolher foto do prato</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">JPEG, PNG ou WebP até 5MB</Text>
          </View>
        )}
      </TouchableOpacity>

      <CustomInput
        control={control}
        name="name"
        label="Nome"
        maxLength={80}
        rules={{
          required: { value: true, message: "O nome é obrigatório" },
        }}
      />
      <CustomInput
        control={control}
        name="description"
        label="Descrição"
        maxLength={255}
        rules={{
          required: {
            value: true,
            message: "A descrição é obrigatória",
          },
        }}
      />
      <CustomInput
        control={control}
        name="price"
        label="Preço"
        keyboardType="numeric"
        maskType="currency"
        rules={{
          required: { value: true, message: "O preço é obrigatório" },
        }}
      />
    </View>
  );
};

export default DishForm;
