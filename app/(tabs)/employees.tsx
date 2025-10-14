import PressableButton from "@/components/Button/PressableButton";
import CustomInput from "@/components/CustomInput/CustomInput";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useEmployees } from "@/src/hooks/useEmployees";
import { IEmployeeResponse } from "@/src/interfaces/apiResponses";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const employees = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployees(user?.company?.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IEmployeeResponse>({
    mode: "onBlur",
  });

  return (
    <SafeAreaView className="bg-white flex-1">
      <PageHeader title="Funcionários" subtitle="Gerencie seus colaboradores" />

      <FlatList
        data={employees}
        renderItem={() => <></>}
        numColumns={1}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        contentContainerStyle={{ paddingVertical: 24 }}
      />

      <PressableButton
        className="absolute bottom-8 right-8"
        onPress={() => {}}
        icon={<AntDesign name="plus" size={16} color="white" />}
      />

      <View>
        <Text>Novo funcionário</Text>
        <CustomInput
          control={control}
          name="name"
          label="Nome"
          rules={{ required: { value: true, message: "O nome é obrigatório" } }}
        />
      </View>
    </SafeAreaView>
  );
};

export default employees;
