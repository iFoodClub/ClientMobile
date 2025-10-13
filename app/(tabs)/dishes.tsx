import PressableButton from "@/components/Button/PressableButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import { useAuthStore } from "@/src/store/authStore";
import React, { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import CustomInput from "@/components/CustomInput/CustomInput";
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
  Modal,
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

  const [selectedDish, setSelectedDish] = useState<IDishesResponse | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {}, [selectedDish]);

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

  async function handleEdit() {
    if (!selectedDish) return;

    await fetchDishes();
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
        onClose={() => setRemoveModalVisible(false)}
        confirmText="Remover"
      >
        <Text className="mb-8 text-base">
          Tem certeza que deseja remover o prato {selectedDish?.name}{" "}
        </Text>
      </ModalCustom>
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
              rules={{
                required: { value: true, message: "O preço é obrigatório" },
              }}
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
        className="absolute bottom-4 right-8"
        onPress={() => {
          setModalVisible(true);
          reset();
        }}
        icon={<AntDesign name="plus" size={24} color="white" />}
      />
    </SafeAreaView>
  );
};

export default DishesScreen;
