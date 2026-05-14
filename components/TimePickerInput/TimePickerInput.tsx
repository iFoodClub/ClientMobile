import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface TimePickerInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

const TimePickerInput = <T extends FieldValues>({
  control,
  name,
  label,
  rules = {},
}: TimePickerInputProps<T>) => {
  const [show, setShow] = useState(false);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const parseTime = (timeStr: string) => {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date;
  };

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
          field: { onChange, value },
          fieldState: { error },
        }) => {
          const dateValue = parseTime(value);

          const handleConfirm = (event: DateTimePickerEvent, date?: Date) => {
            setShow(false); 
            if (event.type === 'set' && date) {
              onChange(formatTime(date));
            }
          };

          return (
            <>
              <TouchableOpacity
                onPress={() => setShow(true)}
                activeOpacity={0.7}
                className={`flex-row items-center rounded-xl px-4 h-11 border ${
                  error ? "border-red-500 bg-red-50" : "border-gray-100 bg-gray-50"
                }`}
              >
                <Text className={`flex-1 text-sm ${value ? "text-gray-700" : "text-gray-400"}`}>
                  {value || "--:--"}
                </Text>
                <Ionicons name="time-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {show && (
                <DateTimePicker
                  value={dateValue}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleConfirm}
                />
              )}

              <View className="min-h-[20px] mt-0.5">
                {error && (
                  <Text className="text-red-500 text-[10px] ml-1">{error.message}</Text>
                )}
              </View>
            </>
          );
        }}
      />
    </View>
  );
};

export default TimePickerInput;
