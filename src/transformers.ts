import { Question, Validator } from "inquirer";
import { QuestionTransformer } from "./types";

export const Password = (): QuestionTransformer => (
  question: any
): Question => ({ ...question, type: "password", mask: true });

export const YesNo = (defaultAnswer?: boolean): QuestionTransformer => (
  question: any
): Question => ({
  ...question,
  type: "confirm",
  ...(defaultAnswer != undefined && { default: defaultAnswer }),
});

export const List = (
  choices: string[] | { name: string; value: any }[]
): QuestionTransformer => (question: any): Question => ({
  ...question,
  type: "list",
  choices,
});

export const Checklist = (
  choices:
    | string[]
    | { name: string; value: any; checked?: boolean; disabled?: boolean }[]
): QuestionTransformer => (question: any): Question => ({
  ...question,
  type: "checkbox",
  choices,
});

export const CustomValidator = (
  customValidator: Validator
): QuestionTransformer => (question: any): Question => ({
  ...question,
  validate: customValidator,
});

export const Required = () =>
  CustomValidator((input) => {
    if (typeof input === "string" && input.trim() !== "") {
      return true;
    }

    return input !== undefined && input !== null;
  });

export const Optional = () => CustomValidator(() => true);
