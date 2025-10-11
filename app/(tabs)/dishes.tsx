import PressableButton from "@/components/Button/PressableButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import { useSelectedRestaurant } from "@/src/hooks/useSelectedRestaurant";
import { useAuthStore } from "@/src/store/authStore";
import React, { useState } from "react";

import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
import { useToastAll } from "@/src/components/Toast";
import { ICreateDishDTO } from "@/src/interfaces/interfaces";
import DishRepository from "@/src/repository/dishRepository";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useForm } from "react-hook-form";
import { FlatList, Modal, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DishesScreen = () => {
  const { user } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const { showSuccess, showError } = useToastAll();
  const { selectedRestaurant, loading } = useSelectedRestaurant({
    restaurantId: user?.restaurant?.id,
  });

  console.log(user?.restaurant?.id, selectedRestaurant?.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ICreateDishDTO>({
    mode: "onBlur",
  });

  async function handleCreateDish(data: ICreateDishDTO) {
    try {
      setCreateLoading(true);
      if (!selectedRestaurant?.id) return;
      data = { ...data, restaurantId: selectedRestaurant?.id };
      console.log("Dados sendo enviados", JSON.stringify(data, null, 2));
      const response = await DishRepository.createDish(data);
      console.log(JSON.stringify(response.data, null, 2));
      showSuccess("Prato criado com sucesso!");
      setModalVisible(false);
      reset();
    } catch (error) {
      console.error(error);
      showError("Erro ao criar prato.");
    } finally {
      setCreateLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <PageHeader
          title="Pratos"
          subtitle="Gerencie os pratos do seu restaurante"
        />
        <View className="flex-row flex-wrap justify-around gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <DishCardSkeleton key={index} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white relative">
      <FlatList
        data={selectedRestaurant?.dishes || []}
        renderItem={({ item }) => <DishCard dish={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          gap: 16,
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
        ListHeaderComponent={() => (
          <PageHeader
            title="Pratos"
            subtitle="Gerencie os pratos do seu restaurante"
          />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center mt-20">
            <Text>Nenhum prato cadastrado ainda.</Text>
          </View>
        )}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 items-center justify-center bg-black/70">
          <View className="bg-white p-4 rounded-lg w-11/12">
            <Text className="text-lg font-semibold mb-4">Novo Prato</Text>

            <CustomInput
              control={control}
              name="image"
              label="Imagem"
              rules={{
                required: { value: true, message: "A imagem é obrigatória" },
              }}
            />
            <CustomInput
              control={control}
              name="name"
              label="Nome"
              maxLength={80}
            />
            <CustomInput
              control={control}
              name="description"
              label="Descrição"
              maxLength={255}
            />
            <CustomInput
              control={control}
              name="price"
              label="Preço"
              keyboardType="numeric"
            />
            <View className="flex flex-col gap-y-2">
              <Button
                type="secondary"
                onPress={() => setModalVisible(false)}
                text="Cancelar"
              />
              <Button
                loading={createLoading}
                text="Criar"
                onPress={handleSubmit(handleCreateDish)}
              />
            </View>
          </View>
        </View>
      </Modal>
      <PressableButton
        className="absolute bottom-8 right-8"
        onPress={() => {
          setModalVisible(true);
          reset();
        }}
        icon={<AntDesign name="plus" size={24} color="white" />}
      />
    </View>
  );
};

export default DishesScreen;
