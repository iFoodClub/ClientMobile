import { Skeleton } from "moti/skeleton";
import React from "react";
import { View } from "react-native";

const RestaurantCardSkeleton = () => {
  // A mágica acontece aqui: [fundo, brilho, fundo]
  const skeletonColors = ["#E5E7EB", "#FFFFFF", "#E5E7EB"];

  return (
    <Skeleton.Group show={true}>
      <View className="flex flex-row items-center py-4 border-b border-gray-50 w-full">
        {/* Imagem do Restaurante - h-20 w-20 rounded-2xl */}
        <Skeleton
          colors={skeletonColors}
          radius={16}
          height={80}
          width={80}
          transition={{ type: "timing", duration: 1500 }}
        />

        <View className="flex-1 ml-4 justify-center gap-y-2">
          {/* Nome do Restaurante - text-base mb-1 */}
          <Skeleton
            colors={skeletonColors}
            radius={4}
            height={18}
            width={"70%"}
            transition={{ type: "timing", duration: 1500 }}
          />
          
          {/* Info: Nota + Categoria - text-xs */}
          <View className="flex-row items-center gap-x-2">
            <Skeleton
              colors={skeletonColors}
              radius={4}
              height={12}
              width={30}
              transition={{ type: "timing", duration: 1500 }}
            />
            <Skeleton
              colors={skeletonColors}
              radius={4}
              height={12}
              width={120}
              transition={{ type: "timing", duration: 1500 }}
            />
          </View>

          {/* Preço - text-xs */}
          <Skeleton
            colors={skeletonColors}
            radius={4}
            height={12}
            width={"60%"}
            transition={{ type: "timing", duration: 1500 }}
          />
        </View>

        {/* Ícone de Favorito */}
        <View className="p-2">
          <Skeleton
            colors={skeletonColors}
            radius={11}
            height={22}
            width={22}
            transition={{ type: "timing", duration: 1500 }}
          />
        </View>
      </View>
    </Skeleton.Group>
  );
};

export default RestaurantCardSkeleton;
