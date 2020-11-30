import { Question } from "inquirer";
import { Required } from "./transformers";
import { InterviewSection, Options, QuestionTransformer } from "./types";

export default (options: Partial<Options> = {}) => {
  const {
    prompter = require("inquirer").prompt,
    printer = console.log,
  } = options;

  return async <T = any>(
    section: InterviewSection<T, void>,
    ...sections: InterviewSection<T, T>[]
  ) => {
    let answers = await section(undefined, { prompter, printer });

    for (let section of sections) {
      answers = {
        ...answers,
        ...(await section(answers, { prompter, printer })),
      };
    }

    return answers;
  };
};

export const Comment = <E>(
  message: string
): InterviewSection<void, E> => async (answers: E, { printer }) =>
  printer(message);

export const Ask = <A = any, E = any>(
  ...questions: Question[]
): InterviewSection<A, E> => async (answers: E, { prompter }) =>
  prompter<A>(questions, answers);

export const Q = <A = any>(
  message: string,
  name: string,
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

export * from "./transformers";
export * from "./types";