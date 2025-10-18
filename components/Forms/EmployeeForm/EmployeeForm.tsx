import CustomInput from "@/components/CustomInput/CustomInput";
import { IEmployeeDTO } from "@/src/interfaces/dtos";
import React from "react";
import { Control } from "react-hook-form";
import { ScrollView } from "react-native";

type EmployeeFormProps = {
  control: Control<IEmployeeDTO>;
};

const EmployeeForm = ({ control }: EmployeeFormProps) => {
  return (
    <ScrollView className=" px-4 ">
      <CustomInput
        control={control}
        name="name"
        label="Nome"
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
      <CustomInput
        control={control}
        name="employee.birthDate"
        label="Data de nascimento"
        keyboardType="numeric"
        rules={{
          required: {
            value: true,
            message: "A data de nascimento é obrigatória",
          },
        }}
      />
      <CustomInput
        control={control}
        name="email"
        label="E-mail"
        rules={{
          required: { value: true, message: "O e-mail é obrigatório" },
        }}
      />
      <CustomInput
        control={control}
        name="password"
        label="Senha"
        rules={{
          minLength: {
            value: 6,
            message: "A senha precisa ter 6 caracteres",
          },
          required: { value: true, message: "A senha é obrigatória" },
        }}
      />
      <CustomInput
        control={control}
        name="password2"
        label="Confirme a senha"
        rules={{
          minLength: {
            value: 6,
            message: "A senha precisa ter 6 caracteres",
          },
          required: { value: true, message: "A senha é obrigatória" },
        }}
      />
      <CustomInput
        control={control}
        name="profileImage"
        label="Imagem do perfil"
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
      <CustomInput
        control={control}
        name="cpf"
        label="CPF"
        maxLength={11}
        keyboardType="numeric"
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
    </ScrollView>
  );
};

export default EmployeeForm;
