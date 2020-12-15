import { Question } from "inquirer";
import { Required } from "./transformers";
import { InterviewSection, Options, QuestionTransformer } from "./types";

const Savvy = (options: Partial<Options> = {}) => {
  const {
    prompter = require("inquirer").prompt,
    printer = console.log,
  } = options;

  return async <T = any>(
    ...sections: InterviewSection<Partial<T>, Partial<T>>[]
  ) => {
    let answers = {};

    for (let section of sections) {
      answers = {
        ...answers,
        ...(await section(answers, { prompter, printer })),
      };
    }

    return answers;
  };
};

export const If = <T = any>(
  condition: (answers: Partial<T>) => Promise<boolean> | boolean
) => {
  return {
    Then: (
      ...sections: InterviewSection<Partial<T>, Partial<T>>[]
    ): InterviewSection<Partial<T>, Partial<T>> => async (
      answers: Partial<T>,
      options
    ) => {
      if (await condition(answers)) {
        for (let section of sections) {
          answers = {
            ...answers,
            ...(await section(answers, options)),
          };
        }
      }

      return answers;
    },
  };
};

export const Comment = <A = any, E = any>(
  message: string | ((answers: E, options: Options) => Promise<void> | void)
): InterviewSection<A, E> => async (answers: E, options) => {
  if (typeof message === "string") {
    options.printer(message);
  } else {
    await message(answers, options);
  }
};

export const Ask = <A = any, E = any>(
  ...questions: Question<A>[]
): InterviewSection<A, E> => async (answers: E, { prompter }) =>
  prompter<A>(questions, answers);

export const Q = <A = any>(
  message: string,
  name: keyof A,
  ...transformers: QuestionTransformer[]
): Question<A> =>
  [Required(), ...transformers].reduce(
    (question, tranformer) => tranformer(question),
    {
      message,
      name,
      type: "input",
    } as Question<A>
  );

export default Savvy;
export * from "./transformers";
export * from "./types";
