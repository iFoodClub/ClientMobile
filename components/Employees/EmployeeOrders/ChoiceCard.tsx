import CModal from "@/components/ui/Modal/CModal";
import { IDish } from "@/src/interfaces/apiResponses";
import { translateWeekDay } from "@/src/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export function ChoiceCard({
  choice,
  day,
}: {
  choice: IDish | null;
  day: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Pressable className="w-[30%] mb-4" onPress={() => setModalVisible(true)}>
      <View className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200">
        <Text className="text-sm font-semibold text-primary font-bold  mb-2">
          {translateWeekDay(day)}
        </Text>

        {choice?.image ? (
          <Image
            source={{ uri: choice.image }}
            className="w-20 h-20 rounded-lg mb-2"
          />
        ) : (
          <View className="w-20 h-20 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
            <Ionicons name="image-outline" size={28} color="#9ca3af" />
          </View>
        )}

        <Text
          className="text-sm text-gray-700 font-medium text-center"
          numberOfLines={2}
        >
          {choice?.name || "No selection"}
        </Text>
      </View>

      <CModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="Remover escolha do dia"
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          if (!choice?.id) return;
          handleRemoveChoice(choice.id);
        }}
      >
        <View>
          <Text className="text-base text-gray-700">
            Tem certeza que deseja remover o prato{" "}
            <Text className="font-bold text-primary">{choice?.name}</Text> como
            seu pedido para o dia{" "}
            <Text className="font-bold text-primary">
              {translateWeekDay(day)}
            </Text>
            ?
          </Text>
        </View>
      </CModal>
    </Pressable>
  );
}
