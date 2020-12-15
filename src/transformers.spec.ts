import {
  List,
  Optional,
  Password,
  Required,
  CustomValidator,
  YesNo,
  Checklist,
  Skip,
  CustomDefault,
  Autofill,
} from "./transformers";

describe("transformers", () => {
  describe("Password", () => {
    it("should set type to password", () => {
      expect(Password()({})).toEqual({ type: "password", mask: true });
    });
  });

  describe("YesNo", () => {
    it("should set type to confirm", () => {
      expect(YesNo()({})).toEqual({ type: "confirm" });
    });

    it("should set an optional default", () => {
      expect(YesNo(false)({})).toEqual({ type: "confirm", default: false });
    });
  });

  describe("List", () => {
    it("should set choices and type to list", () => {
      expect(List(["test"])({})).toEqual({ type: "list", choices: ["test"] });
    });
  });

  describe("Checklist", () => {
    it("should set choices and type to list", () => {
      expect(Checklist(["test"])({})).toEqual({
        type: "checkbox",
        choices: ["test"],
      });
    });
  });

  describe("CustomValidator", () => {
    it("should set validate", () => {
      const validator = (input: string) => (input ? "test" : false);
      expect(CustomValidator(validator)({})).toEqual({ validate: validator });
    });
  });

  describe("CustomDefault", () => {
    it("should set a default", async () => {
      let question: any = CustomDefault(({ pass }) => pass)({});
      expect(await question.default({ pass: true })).toEqual(true);
      expect(await question.default({ pass: false })).toEqual(false);

      question = CustomDefault(null)({});
      expect(question.default).toEqual(null);
    });
  });

  describe("Required", () => {
    it("should set a required validator", () => {
      const question: any = Required()({});
      expect(question.validate("input")).toEqual(true);
      expect(question.validate("")).toEqual(false);
      expect(question.validate(" ")).toEqual(false);
      expect(question.validate()).toEqual(false);
      expect(question.validate(null)).toEqual(false);
    });
  });

  describe("Optional", () => {
    it("should set an optional validator", () => {
      const question: any = Optional()({});
      expect(question.validate("input")).toEqual(true);
      expect(question.validate("")).toEqual(true);
      expect(question.validate(" ")).toEqual(true);
      expect(question.validate()).toEqual(true);
      expect(question.validate(null)).toEqual(true);
    });
  });

  describe("Skip", () => {
    it("should set a when function", async () => {
      let question: any = Skip(({ pass }) => !pass)({});
      expect(await question.when({ pass: true })).toEqual(true);
      expect(await question.when({ pass: false })).toEqual(false);

      question = Skip(({ pass }) => !pass)({
        when: () => false,
      });

      expect(await question.when({ pass: true })).toEqual(false);
      expect(await question.when({ pass: false })).toEqual(false);
    });
  });

  describe("Autofill", () => {
    it("should autofill answers", async () => {
      let answers = {};
      let question: any = Autofill("test")({ name: "testing" });
      expect(await question.when(answers)).toEqual(false);
      expect(answers).toEqual({ testing: "test" });

      answers = {};
      question = Autofill(" ")({ name: "testing" });
      expect(await question.when(answers)).toEqual(true);
      expect(answers).toEqual({});

      answers = {};
      question = Autofill("test")({ name: "testing", validate: () => "no!" });
      expect(await question.when(answers)).toEqual(true);
      expect(answers).toEqual({});
    });
  });
});
