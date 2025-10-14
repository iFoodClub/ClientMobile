import { MotiTransitionProp } from "moti";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { View } from "react-native";

const DishCardSkeleton = () => {
  const skeletonColors = ["#E5E7EB", "#FFFFFF", "#E5E7EB"];

  // Duração da animação configurada para 50ms (muito rápido)
  const transition: MotiTransitionProp = {
    type: "timing",
    duration: 50,
  };

  return (
    <Skeleton.Group show={true}>
      <View className="flex flex-col gap-y-2">
        <Skeleton
          colors={skeletonColors}
          radius="square"
          height={80}
          width={80}
          transition={transition}
        />
        <Skeleton
          colors={skeletonColors}
          radius="square"
          height={20}
          width={90}
          transition={transition}
        />
        <Skeleton
          colors={skeletonColors}
          radius="square"
          height={20}
          width={90}
          transition={transition}
        />
      </View>
    </Skeleton.Group>
  );
};

export default DishCardSkeleton;
