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
      <View className="flex flex-col gap-y-3">
        {/* Imagem do Prato - Ocupando a largura total da coluna */}
        <Skeleton
          colors={skeletonColors}
          radius={20}
          height={100}
          width={"100%"}
          transition={transition}
        />
        {/* Nome do Prato */}
        <Skeleton
          colors={skeletonColors}
          radius={8}
          height={14}
          width={"100%"}
          transition={transition}
        />
        {/* Detalhe/Preço */}
        <Skeleton
          colors={skeletonColors}
          radius={8}
          height={10}
          width={"70%"}
          transition={transition}
        />
      </View>
    </Skeleton.Group>
  );
};

export default DishCardSkeleton;
