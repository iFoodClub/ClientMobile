import PressableButton from "@/components/Button/PressableButton";
import { IEmployeeResponse } from "@/src/interfaces/apiResponses";
import { AntDesign } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

type EmployeeCardProps = {
  employee: IEmployeeResponse;
  onEdit: (employee: IEmployeeResponse) => void;
  onDelete: () => void;
  onLongPress: () => void;
  isSelected: boolean;
};

const EmployeeCard = ({
  employee,
  onEdit,
  onDelete,
  onLongPress,
  isSelected,
}: EmployeeCardProps) => {
  return (
    <Pressable
      onLongPress={onLongPress}
      onPress={isSelected ? onLongPress : undefined}
      className={`
        flex flex-row gap-4 items-center p-4 rounded-lg
        border ${isSelected ? "border-primary" : "border-gray-100"}
        bg-white shadow-sm
      `}
    >
      <Image
        source={{ uri: employee.profileImage }}
        className="w-12 h-12 rounded-full"
      />

      <View className="flex-1">
        <Text className="font-semibold text-lg">{employee.name}</Text>
        <Text className="text-gray-500">{employee.birthDate}</Text>
      </View>

      {isSelected ? (
        <View className="flex flex-row gap-2 items-center">
          <PressableButton
            onPress={onDelete}
            className="bg-red-500 p-3 rounded-full"
            icon={<AntDesign name="delete" size={16} color={"white"} />}
          />
          <PressableButton
            onPress={() => onEdit(employee)}
            className="bg-primary p-3 rounded-full"
            icon={<AntDesign name="edit" size={16} color={"white"} />}
          />
        </View>
      ) : (
        <Text className="text-gray-400 text-xs">CODE:00{employee.id}</Text>
      )}
    </Pressable>
  );
};

export default EmployeeCard;
