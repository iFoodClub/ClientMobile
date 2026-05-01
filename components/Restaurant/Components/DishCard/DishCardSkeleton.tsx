import { MotiTransitionProp } from "moti";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { View } from "react-native";

const DishCardSkeleton = () => {
  const skeletonColors = ["#F3F4F6", "#F9FAFB", "#F3F4F6"];

  const transition: MotiTransitionProp = {
    type: "timing",
    duration: 1500, // Duração muito mais suave e agradável
  };

  return (
    <Skeleton.Group show={true}>
      <View className="flex flex-col">
        {/* Imagem do Prato - Mapeando h-24 e rounded-3xl */}
        <Skeleton
          colors={skeletonColors}
          radius={24}
          height={96}
          width={"100%"}
          transition={transition}
        />
        
        <View className="mt-2 gap-y-1">
          {/* Preço - Mapeando text-sm font-bold */}
          <Skeleton
            colors={skeletonColors}
            radius={4}
            height={16}
            width={"50%"}
            transition={transition}
          />
          
          {/* Nome do Prato - Mapeando text-xs */}
          <Skeleton
            colors={skeletonColors}
            radius={4}
            height={12}
            width={"100%"}
            transition={transition}
          />
        </View>
      </View>
    </Skeleton.Group>
  );
};

export default DishCardSkeleton;
