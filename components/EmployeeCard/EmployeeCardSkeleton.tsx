import { COLORS } from "@/src/constants/colors";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { View } from "react-native";

const EmployeeCardSkeleton = () => {
  return (
    <View className="flex flex-row gap-x-4 items-center  px-4">
      <Skeleton
        colors={COLORS.skeletonColors}
        radius="round"
        height={50}
        transition={{ type: "timing", duration: 50 }}
        width={50}
      />
      <View className="flex flex-col gap-y-2 ">
        <Skeleton
          colors={COLORS.skeletonColors}
          radius="round"
          height={20}
          width={180}
          transition={{ type: "timing", duration: 50 }}
        />
        <Skeleton
          colors={COLORS.skeletonColors}
          radius="round"
          height={20}
          width={100}
          transition={{ type: "timing", duration: 50 }}
        />
      </View>
      <View className="ml-auto">
        <Skeleton
          colors={COLORS.skeletonColors}
          radius="round"
          height={20}
          transition={{ type: "timing", duration: 50 }}
          width={80}
        />
      </View>
    </View>
  );
};

export default EmployeeCardSkeleton;
