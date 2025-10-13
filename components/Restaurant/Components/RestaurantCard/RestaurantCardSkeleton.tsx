import { Skeleton } from "moti/skeleton";
import React from "react";
import { View } from "react-native";

const RestaurantCardSkeleton = () => {
  // A mágica acontece aqui: [fundo, brilho, fundo]
  const skeletonColors = ["#E5E7EB", "#FFFFFF", "#E5E7EB"];

  return (
    <Skeleton.Group show={true}>
      <View className="flex flex-row items-center gap-x-4 w-full px-2">
        {/* Usamos as novas cores em todos os skeletons */}
        <Skeleton
          colors={skeletonColors}
          radius="round"
          height={80}
          transition={{ type: "timing", duration: 50 }}
          width={80}
        />

        <View className="flex flex-col gap-y-2">
          <Skeleton
            colors={skeletonColors}
            radius="round"
            height={25}
            transition={{ type: "timing", duration: 50 }}
            width={200}
          />
          <View className="flex flex-row gap-x-2">
            <Skeleton
              colors={skeletonColors}
              radius="round"
              height={25}
              transition={{ type: "timing", duration: 50 }}
              width={60}
            />
            <Skeleton
              colors={skeletonColors}
              radius="round"
              height={25}
              transition={{ type: "timing", duration: 50 }}
              width={90}
            />
          </View>
          <Skeleton
            colors={skeletonColors}
            radius="round"
            height={25}
            transition={{ type: "timing", duration: 50 }}
            width={190}
          />
        </View>
        <View className="ml-auto">
          <Skeleton
            colors={skeletonColors}
            radius="round"
            height={30}
            width={30}
            transition={{ type: "timing", duration: 50 }}
          />
        </View>
      </View>
    </Skeleton.Group>
  );
};

export default RestaurantCardSkeleton;
