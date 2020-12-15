import {
  List,
  Optional,
  Password,
  Required,
  CustomValidator,
  YesNo,
  Checklist,
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
});
