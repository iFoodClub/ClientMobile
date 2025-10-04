import React from "react";
import { View } from "react-native";
import SkeletonContent from "react-native-skeleton-content";

const RestaurantCardSkeleton = () => {
  return (
    // O isLoading={true} faz o skeleton aparecer.
    // O layout define a forma dos placeholders.
    <SkeletonContent
      isLoading={true}
      layout={[
        // "Osso" para a imagem do perfil (arredondada)
        {
          key: "profileImage",
          width: 80,
          height: 80,
          borderRadius: 40, // Metade da altura/largura para ser um círculo
          marginBottom: 6,
        },
        // "Osso" para o nome do restaurante
        {
          key: "restaurantName",
          width: 180,
          height: 20,
          marginBottom: 6,
          marginLeft: 20, // Espaço entre a imagem e o texto
        },
        // "Osso" para a linha de avaliação
        {
          key: "rating",
          width: 100,
          height: 15,
          marginLeft: 20,
          marginTop: 10,
        },
      ]}
      // Configurações da animação
      boneColor="#E1E9EE"
      highlightColor="#F2F8FC"
      animationDirection="horizontalRight"
    >
      {/* O conteúdo dentro do SkeletonContent não será mostrado 
          enquanto isLoading for true. Colocamos uma View vazia. */}
      <View />
    </SkeletonContent>
  );
};

export default RestaurantCardSkeleton;
