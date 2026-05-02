import DishCard from "@/components/Restaurant/Components/DishCard/DishCard";
import DishCardSkeleton from "@/components/Restaurant/Components/DishCard/DishCardSkeleton";
import { useDishes } from "@/src/hooks/useDishes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface VoiceDishModalProps {
  visible: boolean;
  onClose: () => void;
  /** Restaurante da semana (empresa do funcionário). */
  restaurantId: number | undefined;
}

/**
 * Lista os pratos do restaurante selecionado após o comando "pedido do dia".
 */
export function VoiceDishModal({
  visible,
  onClose,
  restaurantId,
}: VoiceDishModalProps) {
  const insets = useSafeAreaInsets();
  const { dishes, loading } = useDishes(restaurantId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Fechar modal" />
        <View
          className="bg-white rounded-t-3xl max-h-[85%] pb-4"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="flex-row items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900">
              Pedido do dia — pratos
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Ionicons name="close" size={26} color="#6B7280" />
            </Pressable>
          </View>

          {!restaurantId ? (
            <View className="px-6 py-10">
              <Text className="text-center text-gray-500">
                Nenhum restaurante da semana configurado para sua empresa.
              </Text>
            </View>
          ) : loading ? (
            <View className="flex-row flex-wrap gap-3 px-4 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} className="w-[30%]">
                  <DishCardSkeleton />
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={dishes}
              keyExtractor={(item) => String(item.id)}
              numColumns={3}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 24,
              }}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 py-8">
                  Nenhum prato cadastrado neste restaurante.
                </Text>
              }
              renderItem={({ item }) => (
                <View className="flex-1 min-w-[28%] max-w-[33%]">
                  <DishCard
                    dish={{
                      id: item.id,
                      restaurantId: item.restaurantId,
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      image: item.image,
                    }}
                    onLongPress={() => {
                      /* somente leitura */
                    }}
                  />
                </View>
              )}
            />
          )}

          <View className="px-4 pt-2">
            <Text className="text-center text-xs text-gray-400">
              Dica: use o microfone na aba Pratos e diga &quot;pedido do dia&quot;.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
