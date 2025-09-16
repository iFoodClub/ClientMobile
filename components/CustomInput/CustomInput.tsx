import { CustomInputProps } from "@/type";
import cn from "clsx";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

const CustomInput = (props: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View className="w-full">
      <Text className="label">{props.label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={"#888"}
        className={cn(
          "input",
          isFocused ? "border-primary" : "border-gray-300"
        )}
      />
    </View>
  );
};

export default CustomInput;
