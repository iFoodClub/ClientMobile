import Button from "@/components/Button/Button";
import { COLORS } from "@/src/constants/colors";
import { IRestaurantResponse } from "@/src/interfaces/apiResponses";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import RestaurantMenu from "../RestaurantMenu/RestaurantMenu";

type RestaurantCardProps = {
  restaurant: IRestaurantResponse;
};

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const {
    id,
    name,
    profileImage: image,
    averageRating,
    dishCount,
    minPrice,
  } = restaurant;

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function handlePress() {
    setModalOpen(true);
  }

  return (
    <>
      <Pressable onPress={handlePress}>
        <View className="flex flex-row w-full justify-between h-20  ">
          <View className="flex flex-row gap-x-4">
            <Image
              className="h-full w-20 object-cover rounded-full border-2  border-white  "
              source={{ uri: image }}
              alt=""
            />
            <View className="flex flex-col justify-between ">
              <Text
                style={{ color: COLORS.textBody }}
                className="text-base font-bold text-lg"
              >
                {name}
              </Text>
              <View className="flex flex-row gap-x-4 ">
                <View className="flex flex-row gap-x-1 ">
                  <AntDesign
                    name="star"
                    size={12}
                    color={COLORS.starsRating}
                    className="flex align-middle justify-center"
                  />
                  <Text
                    className="font-semibold"
                    style={{ color: COLORS.starsRating }}
                  >
                    {averageRating}
                  </Text>
                </View>
                <View className="flex flex-row gap-x-1">
                  <Ionicons
                    name="restaurant-outline"
                    className="flex align-middle justify-center"
                    size={14}
                    color={COLORS.textDescription}
                  />
                  <Text style={{ color: COLORS.textDescription }}>
                    Pratos:{" "}
                    <Text className="font-semibold">
                      {dishCount ? dishCount : "16"}
                    </Text>
                  </Text>
                </View>
              </View>
              <View className="flex align-middle flex-row gap-x-2 ">
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color={COLORS.priceText}
                />
                <Text
                  style={{ color: COLORS.priceText }}
                  className="text-sm text-gray-600 font-semibold"
                >
                  Pratos a partir de {minPrice ? minPrice : "R$ 5,00"}
                </Text>
              </View>
            </View>
          </View>
          <Entypo
            name="heart-outlined"
            size={20}
            color="black"
            className=" flex align-middle justify-center border-gray-300 rounded-full p-1 "
          />
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
