import * as inquirer from "inquirer";
import savvy, { Ask, Comment, Q } from ".";

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
      undefined
    );
    expect(printer).toHaveBeenCalledWith("hi");
  });

  it("should Comment", async () => {
    jest.spyOn(console, "log");
    const Interview = savvy();

    await Interview(Comment("test 1"), Comment("test 2"));

    expect(console.log).toHaveBeenNthCalledWith(1, "test 1");
    expect(console.log).toHaveBeenNthCalledWith(2, "test 2");
  });

  it("should Ask questions", async () => {
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ mock1: true });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ mock2: true });
    jest.spyOn(inquirer, "prompt").mockResolvedValueOnce({ mock3: true });
    const Interview = savvy();

    const answers = await Interview(
      Ask(Q("test 1", "one"), Q("test 2", "two")),
      Ask(
        Q(
          "test 3",
          "three",
          (question: any) => ({ ...question, message: "transform" }),
          (question: any) => ({ ...question, type: "list" })
        )
      ),
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
      undefined
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
});
