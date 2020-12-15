import * as inquirer from "inquirer";
import savvy, { Ask, Comment, Q, If } from ".";

describe("Interview", () => {
  it("should allow custom options", async () => {
    const prompter: any = jest.fn().mockResolvedValue({ mock: true });
    const printer = jest.fn();
    const Interview = savvy({ prompter, printer });

    const answers = await Interview(Comment("hi"), Ask(Q("test", "test")));

    expect(answers).toEqual({ mock: true });
    expect(prompter).toHaveBeenCalledWith(
      [
        {
          message: "test",
          name: "test",
          type: "input",
          validate: expect.any(Function),
        },
      ],
      {}
    );
    expect(printer).toHaveBeenCalledWith("hi");
  });

  it("should Comment", async () => {
    jest.spyOn(console, "log");
    const Interview = savvy();

    await Interview<any>(
      Comment("test 1"),
      Comment((answers, { printer }) => printer("test 2"))
    );

    expect(console.log).toHaveBeenNthCalledWith(1, "test 1");
    expect(console.log).toHaveBeenNthCalledWith(2, "test 2");
  });

  it("should Ask questions", async () => {
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ mock1: true });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ mock2: true });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ mock3: true });
    const Interview = savvy();

    const answers = await Interview<Mock>(
      Comment("test"),
      Ask(Q("test 1", "one"), Q("test 2", "two")),
      Ask<{ three: string }>(
        Q(
          "test 3",
          "three",
          (question: any) => ({ ...question, message: "transform" }),
          (question: any) => ({ ...question, type: "list" })
        )
      ),
      Comment("test"),
      Ask(Q("test 4", "four"))
    );

    expect(inquirer.prompt).toHaveBeenNthCalledWith(
      1,
      [
        {
          message: "test 1",
          name: "one",
          type: "input",
          validate: expect.any(Function),
        },
        {
          message: "test 2",
          name: "two",
          type: "input",
          validate: expect.any(Function),
        },
      ],
      {}
    );

    expect(inquirer.prompt).toHaveBeenNthCalledWith(
      2,
      [
        {
          message: "transform",
          name: "three",
          type: "list",
          validate: expect.any(Function),
        },
      ],
      { mock1: true }
    );

    expect(inquirer.prompt).toHaveBeenNthCalledWith(
      3,
      [
        {
          message: "test 4",
          name: "four",
          type: "input",
          validate: expect.any(Function),
        },
      ],
      { mock1: true, mock2: true }
    );

    expect(answers).toEqual({
      mock1: true,
      mock2: true,
      mock3: true,
    });
  });

  it("should have If Then sections", async () => {
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ one: true });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ two: false });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ four: true });

    const Interview = savvy();
    const answers = await Interview<Mock>(
      Ask(Q("question", "one")),
      Ask(Q("question", "two")),
      If<Mock>(({ one }) => !!one).Then(Ask(Q("question", "three"))),
      If<Mock>(({ two }) => !!two).Then(Ask(Q("question", "four")))
    );

    expect(answers).toEqual({
      one: true,
      two: false,
      four: true,
    });
  });
});

type Mock = {
  one: string;
  two: string;
  three: string;
  four: string;
};
