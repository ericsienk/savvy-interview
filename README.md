# savvy-interview

```typescript
import savvy, { Comment, Ask, Q, Optional, List } from "savvy-interview";
import * as inquirer from "inquirer";

// introduce some type safety to your interview
type MyAnswers = {
  donut: string;
  pizzaTopping: string;
  pasta: string;
  spinach: boolean;
};

async function run() {
  // default options
  const options = {
    prompter: inquirer.prompt, // asks questions
    printer: console.log, // prints comments
  };

  // create an interview function
  const Interview = savvy(options);

  // get answers from your interview questions
  const answers: MyAnswers = await Interview<MyAnswers>(
    Comment("First lets ask a section of questions..."),
    Ask(
      // question is a required input type by default
      Q(`What's your favorite donut?`, "donut"),
      // Optional() transforms the question to be optional
      Q(`Favorite pizza topping (optional)?`, "pizzaTopping", Optional()),
      // List([...]) transforms the question to be a list type
      Q(
        "Pick the best pasta!",
        "pasta",
        List(["spaghetti", "ravioli", "linguini"])
      ),
      // Checklist() transforms the question to a checkbox type
      // Password() transforms the question to a password type
      // YesNo() transforms the question to a confirm type
      // Validate(customValidator) adds validation

      // Dynamically add interview sections with an If(answersSoFar).Then(...sections)
      If(({ pasta }) => pasta === "ravioli").Then(
        Comment(`Oh that's a good pasta.`),
        Ask(Q("Do you like spinach ravioli?", "spinach", YesNo()))
      )
    )
  );
}
```
