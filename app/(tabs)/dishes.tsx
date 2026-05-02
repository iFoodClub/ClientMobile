import PressableButton from "@/components/Button/PressableButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import { VoiceCommandButton } from "@/src/components/VoiceCommand/VoiceCommandButton";
import { VoiceDishModal } from "@/src/components/VoiceCommand/VoiceDishModal";
import { useAuthStore } from "@/src/store/authStore";
import { voiceTabHref } from "@/src/utils/voiceNavigation";
import React, { useState } from "react";

import DishForm from "@/components/Forms/DishForm/DishForm";
import { ActionMenu } from "@/components/Restaurant/Components/DishCard/ActionMenu";
import CModal from "@/components/ui/Modal/CModal";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import { useToastAll } from "@/src/components/Toast";
import { useDishes } from "@/src/hooks/useDishes";
import { IDishesResponse } from "@/src/interfaces/apiResponses";
import { ICreateDishDTO } from "@/src/interfaces/interfaces";
import DishRepository from "@/src/repository/dishRepository";
import { formatPriceToNumber } from "@/src/utils/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
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
  const { user, isRestaurant, isEmployee } = useAuthStore();
  const employeeRestaurantId = user?.employee?.company?.selectedRestaurantId;
  const ownerRestaurantId = user?.restaurant?.id;
  const activeRestaurantId = isEmployee
    ? employeeRestaurantId
    : ownerRestaurantId;

  const { dishes, loading, fetchDishes } = useDishes(activeRestaurantId);
  const [modalVisible, setModalVisible] = useState(false);
  const [voiceDishModalOpen, setVoiceDishModalOpen] = useState(false);
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
  } = useForm<ICreateDishDTO>({
    mode: "onBlur",
  });

  async function handleEditClick() {
    if (!selectedDish) return;
    reset({
      name: selectedDish.name,
      description: selectedDish.description,
      price: selectedDish.price,
      image: selectedDish.image,
    });

    setModalVisible(true);
  }

  function handleCancel() {
    setModalVisible(false);
    setSelectedDish(null);
    reset();
  }

  async function handleDelete() {
    if (!selectedDish?.restaurantId) return;
    try {
      setDeleteLoading(true);
      await DishRepository.deleteDish(selectedDish.id);
      await fetchDishes();
      showSuccess("Prato removido com sucesso!");
    } catch (_error) {
      showError("Erro ao remover prato.");
    } finally {
      setDeleteLoading(false);
      setRemoveModalVisible(false);
      setSelectedDish(null);
    }
  }

  async function handleCreateDish(data: ICreateDishDTO) {
    try {
      setCreateLoading(true);
      if (!user?.restaurant?.id) return;
      data = {
        ...data,
        price: formatPriceToNumber(data.price),
        restaurantId: user?.restaurant?.id,
      };
      await DishRepository.createDish(data);
      showSuccess("Prato criado com sucesso!");
      setModalVisible(false);
      await fetchDishes();
      reset();
    } catch (_error) {
      showError("Erro ao criar prato.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleEdit(data: ICreateDishDTO) {
    try {
      setCreateLoading(true);
      if (!selectedDish?.id) return;
      data = {
        ...data,
        price: formatPriceToNumber(data.price),
      };
      await DishRepository.updateDish(data, selectedDish.id);
      showSuccess("Prato atualizado com sucesso!");
      setModalVisible(false);
      await fetchDishes();
      reset();
    } catch (_error) {
      showError("Erro ao atualizar prato.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleSubmitDishForm(data: ICreateDishDTO) {
    if (selectedDish) {
      await handleEdit(data);
    } else {
      await handleCreateDish(data);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <PageHeader
          title="Pratos"
          subtitle={
            isEmployee
              ? "Cardápio do restaurante da semana"
              : "Gerencie os pratos do seu restaurante"
          }
        />
        <View className="flex-row flex-wrap gap-x-3 mt-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <View key={index} className="w-[30%] mb-6">
              <DishCardSkeleton />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative h-full ">
      <PageHeader
        title="Pratos"
        subtitle={
          isEmployee
            ? "Cardápio do restaurante da semana"
            : "Gerencie os pratos do seu restaurante"
        }
      />
      <FlatList
        style={{ flex: 1 }}
        data={dishes || []}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onLongPress={
              isRestaurant
                ? (event) => handleLongPress(item, event)
                : () => {}
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          gap: 12,
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

      {isRestaurant && selectedDish && (
        <Pressable
          className="absolute inset-0 z-5"
          onPress={() => setSelectedDish(null)}
        />
      )}

      {isRestaurant && selectedDish && menuPosition && (
        <ActionMenu
          position={menuPosition}
          onEdit={handleEditClick}
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

      {isRestaurant && (
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
      )}

      {isEmployee && (
        <>
          <VoiceCommandButton
            mode="employee"
            enabled={!loading}
            onMatch={(m) => {
              if (m.type === "PEDIDO_DO_DIA") {
                setVoiceDishModalOpen(true);
                return;
              }
              if (m.type === "NAVIGATE_TAB") {
                router.push(voiceTabHref(m.tab));
              }
            }}
          />
          <VoiceDishModal
            visible={voiceDishModalOpen}
            onClose={() => setVoiceDishModalOpen(false)}
            restaurantId={employeeRestaurantId}
          />
        </>
      )}
      <CModal
        confirmText={selectedDish ? "Atualizar" : "Criar"}
        onClose={handleCancel}
        onConfirm={handleSubmit(handleSubmitDishForm)}
        loading={createLoading}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={selectedDish ? "Editar prato" : "Novo prato"}
      >
        <DishForm control={control} />
      </CModal>
    </SafeAreaView>
  );
};

export default DishesScreen;
