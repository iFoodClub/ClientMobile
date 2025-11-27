import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import uploadRepository from "@/src/repository/uploadRepository";
import { AntDesign, Ionicons } from "@expo/vector-icons";

interface ImageUploadModalProps {
  visible: boolean;
  dishName: string;
  onUploadComplete: (imageUrl: string) => void;
  onSkip: () => void;
}

const ImageUploadModal = ({
  visible,
  dishName,
  onUploadComplete,
  onSkip,
}: ImageUploadModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    try {
      // Pedir permissão
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Precisamos de permissão para acessar suas fotos!");
        return;
      }

      // Selecionar imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Proporção para fotos de pratos
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];

        // Validar arquivo
        const validation = uploadRepository.validateImageFile(file);
        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        setSelectedImage(file.uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      alert("Erro ao selecionar imagem");
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      alert("Por favor, selecione uma imagem primeiro");
      return;
    }

    try {
      setUploading(true);

      const file = {
        uri: selectedImage,
        type: "image/jpeg",
        name: `dish-${Date.now()}.jpg`,
      };

      const response = await uploadRepository.uploadDishImage(
        file,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (response.data.success) {
        onUploadComplete(response.data.data.url);
        // Reset
        setSelectedImage(null);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    setSelectedImage(null);
    setUploadProgress(0);
    onSkip();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={handleSkip}
      >
        <Pressable
          className="bg-white rounded-2xl p-6 w-11/12 max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">
                Adicionar Foto
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {dishName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleSkip}
              className="p-2"
              disabled={uploading}
            >
              <AntDesign name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Image Preview Area */}
          <View className="bg-gray-100 rounded-xl overflow-hidden mb-4">
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-48"
                resizeMode="cover"
              />
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="w-full h-48 justify-center items-center"
                disabled={uploading}
              >
                <Ionicons name="image-outline" size={64} color="#999" />
                <Text className="text-gray-500 mt-2">
                  Toque para selecionar
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Progress Bar */}
          {uploading && (
            <View className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-gray-600">Enviando...</Text>
                <Text className="text-sm text-gray-600">
                  {uploadProgress}%
                </Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500"
                  style={{ width: `${uploadProgress}%` }}
                />
              </View>
            </View>
          )}

          {/* Actions */}
          <View className="flex-row gap-3">
            {selectedImage && !uploading && (
              <TouchableOpacity
                onPress={pickImage}
                className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-semibold">
                  Trocar Foto
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={selectedImage ? uploadImage : pickImage}
              className="flex-1 bg-blue-500 py-3 rounded-xl items-center flex-row justify-center"
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white font-semibold mr-2">
                    {selectedImage ? "Enviar" : "Selecionar Foto"}
                  </Text>
                  {selectedImage && (
                    <AntDesign name="upload" size={16} color="white" />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Skip Button */}
          {!uploading && (
            <TouchableOpacity onPress={handleSkip} className="mt-3">
              <Text className="text-center text-gray-500 text-sm">
                Adicionar foto depois
              </Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ImageUploadModal;

