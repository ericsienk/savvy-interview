import { Question, Validator } from "inquirer";
import { QuestionTransformer } from "./types";

const isEmpty = (input: any) => {
  if (typeof input === "string" || input instanceof String) {
    return !input.trim().length;
  }

  return input === undefined || input === null;
};

export const Autofill = (answer: any): QuestionTransformer => (
  question: any
): Question => ({
  ...question,
  when: async function (answers) {
    if (!isEmpty(answer)) {
      if (
        this.validate instanceof Function &&
        (await this.validate(answer)) !== true
      ) {
        return true;
      }

      answers[question.name] = answer;
      return false;
    }

    return true;
  },
});

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

export const CustomDefault = (
  customDefault:
    | ((answersSoFar: any) => Promise<any> | any)
    | number
    | string
    | object
    | void
    | null
): QuestionTransformer => (question: any): Question => ({
  ...question,
  default: customDefault,
});

export const Required = () => CustomValidator((input) => !isEmpty(input));

export const Optional = () => CustomValidator(() => true);

export const Transform = (
  question: Question,
  ...transformers: QuestionTransformer[]
) =>
  transformers.reduce((question, tranformer) => tranformer(question), question);

export const Skip = (
  shouldSkipWhen: (anwersSoFar: any) => Promise<boolean> | boolean
): QuestionTransformer => (question: any): Question => ({
  ...question,
  when: async (answers) => {
    let shouldAsk = !(await shouldSkipWhen(answers));
    if (shouldAsk && question.when instanceof Function) {
      shouldAsk = await question.when(shouldAsk);
    }

    return shouldAsk;
  },
});
