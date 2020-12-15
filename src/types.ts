import { PromptModule, Question } from "inquirer";

export type Options = {
  prompter: PromptModule;
  printer: (message: string) => void;
};

export type InterviewSection<A, E> = (
  existingAnswers: E,
  options: Options
) => Promise<A | void>;

export type QuestionTransformer = <T>(question: Question<T>) => Question<T>;
