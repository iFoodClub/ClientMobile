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
  maskType?: "currency";
}

const formatCurrency = (text: string) => {
  const cleanText = text.replace(/\D/g, "");
  if (!cleanText) return "";
  const cents = parseInt(cleanText, 10);
  const value = cents / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const getDisplayValue = (val: any, maskType?: "currency") => {
  if (maskType === "currency" && val !== undefined && val !== null && val !== "") {
    if (typeof val === "string" && val.includes("R$")) {
      return val;
    }
    return formatCurrency(val.toString());
  }
  return val;
};

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  keyboardType = "default",
  rules = {},
  icon,
  maxLength,
  maskType,
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
              className={`flex-row items-center rounded-xl px-4 py-0.5 border ${
                error ? "border-red-500 bg-red-50" : "border-gray-100 bg-gray-50"
              }`}
            >
              {icon && <View className="mr-2">{icon}</View>}
              <TextInput
                maxLength={maxLength}
                keyboardType={keyboardType}
                className="flex-1 h-11 text-gray-700 text-sm"
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (maskType === "currency") {
                    const formatted = formatCurrency(text);
                    onChange(formatted);
                  } else {
                    onChange(text);
                  }
                }}
                value={getDisplayValue(value, maskType)}
                placeholderTextColor={"#9CA3AF"}
                {...textInputProps}
              />
            </View>

            <View className="min-h-[20px] mt-0.5">
              {error && (
                <Text className="text-red-500 text-[10px] ml-1">{error.message}</Text>
              )}
            </View>
          </>
        )}
      />
    </View>
  );
};

export default CustomInput;
