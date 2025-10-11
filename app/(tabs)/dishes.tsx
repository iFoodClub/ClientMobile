import PressableButton from "@/components/Button/PressableButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import { useSelectedRestaurant } from "@/src/hooks/useSelectedRestaurant";
import { useAuthStore } from "@/src/store/authStore";
import React, { useState } from "react";

import CustomInput from "@/components/CustomInput/CustomInput";
import { COLORS } from "@/src/constants/colors";
import { ICreateDishDTO } from "@/src/interfaces/interfaces";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useForm } from "react-hook-form";
import { Button, FlatList, Modal, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DishesScreen = () => {
  const { user } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedRestaurant, loading } = useSelectedRestaurant({
    restaurantId: user?.restaurant?.id,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ICreateDishDTO>({
    mode: "onBlur",
  });

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/70">
          <View className="bg-white p-4 rounded-lg w-11/12">
            <Text className="text-lg font-semibold mb-4">Novo Prato</Text>

            <CustomInput control={control} name="image" label="Imagem" />
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
                color={COLORS.textDescription}
                onPress={() => setModalVisible(false)}
                title="Cancelar"
              />
              <Button
                color={COLORS.primary}
                onPress={handleSubmit((data) => {
                  // selectedRestaurant?.createDish(data);
                  setModalVisible(false);
                  reset();
                })}
                title="Salvar"
              />
            </View>
          </View>
        </View>
      </Modal>
      <PressableButton
        className="absolute bottom-8 right-8"
        onPress={() => setModalVisible(true)}
        icon={<AntDesign name="plus" size={24} color="white" />}
      />
    </View>
  );
};

export default DishesScreen;
