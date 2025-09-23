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
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  icon?: React.ReactNode;
}

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  rules = {},
  icon,
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
              className={`justify-center border flex flex-row items-center rounded-lg text-base p-1 pl-4  ${
                error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              }`}
            >
              {/* 2. Posicione o ícone de forma absoluta */}
              {icon && <View className="w-10">{icon}</View>}

              <TextInput
                // Seus estilos originais são mantidos aqui
                className={` text-base flex-1  ${
                  error
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={"#9CA3AF"}
                {...textInputProps}
              />
            </View>

            <View className="h-[20px] flex items-end">
              {error && (
                <Text className="text-red-500 text-sm">{error.message}</Text>
              )}
            </View>
          </>
        )}
      />
    </View>
  );
};

export default CustomInput;
