import Savvy, {
  Ask,
  Q,
  Comment,
  YesNo,
  List,
  Checklist,
  If,
  Password,
  Autofill,
} from "./dist";

const Interview = Savvy();
type Example = {
  one: boolean;
  two: string;
  three: number[];
  four?: string;
  name: string;
};

const run = async () =>
  Interview<Example>(
    Comment("Just testing out some questions"),
    Ask(
      Q("Autofill this one", "name", Autofill("Bill Nye")),
      Q("One?", "one", YesNo()),
      Q("Two?", "two", List(["1", "2", "3"])),
      Q(
        "Three?",
        "three",
        Checklist([
          { name: "1", value: 1, checked: true },
          { name: "2", value: 2 },
          { name: "3", value: 3, disabled: true },
        ])
      )
    ),
    Comment(({ two }, { printer }) => {
      if (two === "2") {
        printer("This is a complex comment");
      }
    }),
    If(({ three }) => !!three.length).Then(Ask(Q("Four?", "four", Password())))
  );

run().then((x) => console.log(JSON.stringify(x, null, 4)));
