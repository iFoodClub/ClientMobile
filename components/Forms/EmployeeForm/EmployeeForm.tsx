import CustomInput from "@/components/CustomInput/CustomInput";
import { IEmployeeDTO } from "@/src/interfaces/dtos";
import { formMode } from "@/src/interfaces/interfaces";
import React from "react";
import { Control } from "react-hook-form";
import { ScrollView } from "react-native";

type EmployeeFormProps = {
  control: Control<IEmployeeDTO>;
  mode: formMode;
};

const EmployeeForm = ({ control, mode }: EmployeeFormProps) => {
  return (
    <ScrollView className=" px-4 ">
      <CustomInput
        control={control}
        name="name"
        label="Nome"
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
        placeholder="Digite o nome"
      />
      <CustomInput
        control={control}
        name="employee.birthDate"
        label="Data de nascimento"
        placeholder="Ex: 1999-01-01"
        maxLength={10}
        rules={{
          required: {
            value: true,
            message: "A data de nascimento é obrigatória.",
          },

          pattern: {
            value: /^\d{4}-\d{2}-\d{2}$/,
            message: "Formato inválido. Use AAAA-MM-DD (ex: 1997-06-30).",
          },
        }}
      />
      <CustomInput
        control={control}
        placeholder="Digite o email"
        name="email"
        label="E-mail"
        rules={{
          required: { value: true, message: "O e-mail é obrigatório" },
        }}
      />
      {mode === formMode.create && (
        <CustomInput
          placeholder="Digite a senha"
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
      )}
      {mode === formMode.create && (
        <CustomInput
          placeholder="Confirme a senha"
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
      )}
      <CustomInput
        placeholder="Insira a imagem"
        control={control}
        name="profileImage"
        label="Imagem do perfil"
        rules={{ required: { value: true, message: "O nome é obrigatório" } }}
      />
      <CustomInput
        placeholder="Digite o CPF"
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
