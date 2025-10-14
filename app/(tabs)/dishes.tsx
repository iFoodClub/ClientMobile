import PressableButton from "@/components/Button/PressableButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import { useAuthStore } from "@/src/store/authStore";
import React, { useState } from "react";

import DishForm from "@/components/Forms/DishForm/DishForm";
import { ActionMenu } from "@/components/Restaurant/Components/DishCard/ActionMenu";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import { useToastAll } from "@/src/components/Toast";
import { useDishes } from "@/src/hooks/useDishes";
import { IDishesResponse } from "@/src/interfaces/apiResponses";
import { ICreateDishDTO } from "@/src/interfaces/interfaces";
import DishRepository from "@/src/repository/dishRepository";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useForm } from "react-hook-form";
import {
  FlatList,
  GestureResponderEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DishesScreen = () => {
  const { user } = useAuthStore();
  const { dishes, loading, fetchDishes } = useDishes(user?.restaurant?.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const { showSuccess, showError } = useToastAll();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDish, setSelectedDish] = useState<IDishesResponse | null>(
    null
  );
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  function handleLongPress(
    dish: IDishesResponse,
    event: GestureResponderEvent
  ) {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedDish(dish);
    setMenuPosition({
      x: pageX,
      y: pageY,
    });
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ICreateDishDTO>({
    mode: "onBlur",
  });

  async function handleEdit() {
    if (!selectedDish) return;
    reset({
      name: selectedDish.name,
      description: selectedDish.description,
      price: selectedDish.price,
      image: selectedDish.image,
    });

    setModalVisible(true);
  }

  async function handleDelete() {
    setDeleteLoading(true);
    if (!selectedDish?.restaurantId) return;
    try {
      await DishRepository.deleteDish(selectedDish.id);
      await fetchDishes();
      showSuccess("Prato removido com sucesso!");
      setDeleteLoading(false);
    } catch (error) {
      console.error(error);
      showError("Erro ao remover prato.");
    } finally {
      setDeleteLoading(false);
      setRemoveModalVisible(false);
      setSelectedDish(null);
    } //TODO Colocar imagem padrão para quando não houver imagem em algum prato
  }

  async function handleCreateDish(data: ICreateDishDTO) {
    try {
      setCreateLoading(true);
      if (!user?.restaurant?.id) return;
      data = { ...data, restaurantId: user?.restaurant?.id };
      await DishRepository.createDish(data);
      showSuccess("Prato criado com sucesso!");
      setModalVisible(false);
      await fetchDishes();
      reset();
    } catch (error) {
      console.error(error);
      showError("Erro ao criar prato.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleSubmitDishForm(data: ICreateDishDTO) {
    if (selectedDish) {
      await handleEdit();
    } else {
      await handleCreateDish(data);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <PageHeader
          title="Pratos"
          subtitle="Gerencie os pratos do seu restaurante"
        />
        <View className="flex-row flex-wrap  gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <DishCardSkeleton key={index} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative h-full ">
      <PageHeader
        title="Pratos"
        subtitle="Gerencie os pratos do seu restaurante"
      />
      <FlatList
        data={dishes || []}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onLongPress={(event) => handleLongPress(item, event)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        columnWrapperStyle={{
          gap: 16,
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center mt-20">
            <Text>Nenhum prato cadastrado ainda.</Text>
          </View>
        )}
      />

      {selectedDish && (
        <Pressable
          className="absolute inset-0 z-5"
          onPress={() => setSelectedDish(null)}
        />
      )}

      {selectedDish && menuPosition && (
        <ActionMenu
          position={menuPosition}
          onEdit={handleEdit}
          onDelete={() => setRemoveModalVisible(true)}
        />
      )}

      <ModalCustom
        title="Remover Prato"
        visible={removeModalVisible}
        onConfirm={handleDelete}
        onClose={() => {
          setRemoveModalVisible(false);
          setModalVisible(false);
          setSelectedDish(null);
        }}
        confirmText="Remover"
      >
        <Text className="mb-8 text-base">
          Tem certeza que deseja remover o prato {selectedDish?.name}{" "}
        </Text>
      </ModalCustom>
      <ModalCustom
        confirmText={selectedDish ? "Editar" : "Criar"}
        onConfirm={handleSubmit(handleSubmitDishForm)}
        onClose={() => {
          setModalVisible(false);
          setSelectedDish(null);
          reset();
        }}
        visible={modalVisible}
        title={
          selectedDish ? (
            <>
              <Text>Editar prato</Text>{" "}
              <Text className="font-semibold text-primary">
                {selectedDish.name}
              </Text>
            </>
          ) : (
            <Text>Novo prato</Text>
          )
        }
      >
        <DishForm control={control} />
      </ModalCustom>

      <PressableButton
        className="absolute bottom-8 right-8"
        onPress={() => {
          setModalVisible(true);
          reset({
            name: undefined,
            description: undefined,
            price: undefined,
            image: undefined,
          });
        }}
        icon={<AntDesign name="plus" size={24} color="white" />}
      />
    </SafeAreaView>
  );
};

export default DishesScreen;
