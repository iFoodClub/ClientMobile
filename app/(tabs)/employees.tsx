import PageHeader from "@/components/PageHeader/PageHeader";
import React from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const employees = () => {
  return (
    <SafeAreaView>
      <PageHeader title="Funcionários" subtitle="Gerencie seus colaboradores" />

      <FlatList
        data={[]}
        renderItem={() => <></>}
        numColumns={1}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        contentContainerStyle={{ paddingVertical: 24 }}
      />
    </SafeAreaView>
  );
};

export default employees;
