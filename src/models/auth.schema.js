import joi from "joi";

export const userSchema = joi
  .object({
    name: joi
      .string()
      .min(2)
      .required()
      .messages({ "string.min": "O nome deve conter no mínimo 2 caracteres" }),
    email: joi.string().email().required().messages({
      "string.email": "O campo e-mail deve conter um e-mail válido",
    }),
    password: joi
      .string()
      .min(3)
      .required()
      .messages({ "string.min": "A senha deve conter no mínimo 8 caracteres" }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "'Confirmação de senha' deve ser igual a 'Senha'",
      }),
  })
  .messages(
    { "string.base": "Todos os campos devem estar em formato de texto" },
    { "string.empty": "Todos os campos devem estar preenchidos" }
  );

export const loginSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required()
      .messages({
        "string.email": "O campo e-mail deve conter um e-mail válido",
      }),
    password: joi.string().required(),
  })
  .messages(
    { "string.base": "Todos os campos devem estar em formato de texto" },
    { "string.empty": "Todos os campos devem estar preenchidos" }
  );
