import CModal from "@/components/ui/Modal/CModal";
import { IEmployeeChoicesResponse } from "@/src/interfaces/apiResponses";
import { useAuthStore } from "@/src/store/authStore";
import { translateWeekDay } from "@/src/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

interface ChoiceCardProps {
  choice: IEmployeeChoicesResponse;
  day: string;
  removeEmployeeChoice: (choiceId: number, employeeId: number) => Promise<void>;
  isLoading: boolean;
}

export function ChoiceCard({
  choice,
  day,
  removeEmployeeChoice,
  isLoading,
}: ChoiceCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuthStore();

  async function handleRemoveChoice(choiceId: number) {
    console.log({ choiceId, employeeId: user?.employee?.id });
    if (!user?.employee?.id) return;
    await removeEmployeeChoice(choiceId, user.employee.id);
    setModalVisible(false);
  }

  return (
    <Pressable className="w-[30%] mb-4" onPress={() => setModalVisible(true)}>
      <View className="flex flex-col  p-1 bg-white rounded-xl  h-48">
        <Text className="text-sm font-semibold text-primary font-bold  mb-2">
          {translateWeekDay(day)}
        </Text>

        {choice?.dish?.image ? (
          <Image
            source={{ uri: choice.dish.image }}
            className="w-28 h-28 rounded-lg mb-2"
          />
        ) : (
          <View className="w-28 h-28 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
            <Ionicons name="image-outline" size={40} color="#9ca3af" />
          </View>
        )}

        <Text
          className="text-base font-medium text-textDescription "
          numberOfLines={2}
        >
          {choice?.dish?.name || "Sem escolha"}
        </Text>
      </View>

      <CModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        confirmText="Remover"
        title="Remover escolha do dia"
        onClose={() => setModalVisible(false)}
        loading={isLoading}
        onConfirm={() => {
          if (!choice?.id) return;
          handleRemoveChoice(choice.id);
        }}
      >
        <View>
          <Text className="text-base text-gray-700">
            Tem certeza que deseja remover o prato{" "}
            <Text className="font-bold text-primary">{choice?.dish?.name}</Text>{" "}
            como seu pedido para o dia{" "}
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
