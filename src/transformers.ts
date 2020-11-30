import { Question, Validator } from "inquirer";
import { QuestionTransformer } from "./types";

export const Password = (): QuestionTransformer => (
  question: any
): Question => ({ ...question, type: "password" });

export const YesNo = (defaultAnswer?: boolean): QuestionTransformer => (
  question: any
): Question => ({
  ...question,
  type: "confirm",
  ...(defaultAnswer != undefined && { default: defaultAnswer }),
});

export const List = (
  choices: string[] | { name: string; value: string }
): QuestionTransformer => (question: any): Question => ({
  ...question,
  type: "list",
  choices,
});

export const Validate = (customValidator: Validator): QuestionTransformer => (
  question: any
): Question => ({ ...question, validate: customValidator });

export const Required = () =>
  Validate(
    (input) =>
      typeof input === "string" &&
      input.trim() !== "" &&
      input !== undefined &&
      input !== null
  );

export const Optional = () => Validate(() => true);
