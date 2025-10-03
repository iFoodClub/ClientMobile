import Button from "@/components/Button/Button";
import React, { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import RestaurantMenu from "../RestaurantMenu/RestaurantMenu";

type RestaurantCardProps = {
  id: number;
  image: string;
  name: string;
};

const RestaurantCard = ({ id, image, name }: RestaurantCardProps) => {
  console.log(JSON.stringify({ id, image, name }, null, 2));

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function handlePress() {
    setModalOpen(true);
  }

  return (
    <>
      <Pressable
        onPress={handlePress}
        className="flex flex-col items-center bg-gray-200 p-4 w-32 gap-y-2 h-40 rounded-xl"
      >
        <View className="flex flex-col items-center bg-gray-200 p-4 w-32 gap-y-2 h-40 rounded-xl">
          <Image
            width={64}
            height={64}
            borderRadius={50}
            source={{ uri: image }}
          />
          <Text className="text-center text-sm text-gray-600 font-semibold">
            {name}
          </Text>
        </View>
      </Pressable>
      <Modal visible={modalOpen}>
        <RestaurantMenu restaurantId={id} />
        <Button text="Fechar" onPress={() => setModalOpen(false)}></Button>
      </Modal>
    </>
  );
};

export default RestaurantCard;
