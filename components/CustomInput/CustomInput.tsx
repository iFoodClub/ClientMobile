import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface CustomInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  keyboardType?: TextInputProps["keyboardType"];
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  icon?: React.ReactNode;
  maxLength?: number;
}

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  keyboardType = "default",
  rules = {},
  icon,
  maxLength,
  ...textInputProps
}: CustomInputProps<T>) => {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-semibold text-gray-600 mb-1">
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View
              className={`flex-row items-center rounded-2xl px-4 py-1 border ${
                error ? "border-red-500 bg-red-50" : "border-gray-100 bg-gray-50"
              }`}
            >
              {icon && <View className="mr-2">{icon}</View>}
              <TextInput
                maxLength={maxLength}
                keyboardType={keyboardType}
                className="flex-1 h-12 text-gray-700 text-base"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={"#9CA3AF"}
                {...textInputProps}
              />
            </View>

            <View className="h-6 mt-1">
              {error && (
                <Text className="text-red-500 text-xs ml-1">{error.message}</Text>
              )}
            </View>
          </>
        )}
      />
    </View>
  );
};

export default CustomInput;
