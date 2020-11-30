# savvy-interview

```typescript
import savvy, { Comment, Ask, Q, Optional, List } from "savvy-interview";
import * as inquirer from "inquirer";

async function run() {
  // default options
  const options = {
    prompter: inquirer.prompt, // asks questions
    printer: console.log, // prints comments
  };

  // create an interview function
  const Interview = savvy(options);

  // get answers from your interview questions
  const answers = await Interview(
    Comment("First lets ask a section of questions..."),
    Ask(
      // default question is a required input type
      Q(`What's your favorite donut?`, "donut"),
      // Optional() transforms the default to be optional
      Q(`Favorite pizza topping (optional)?`, "pizzaTopping", Optional()),
      // List([...]) transforms the default to be a list type
      Q(
        "Pick the best pasta!",
        "pasta",
        List(["spaghetti", "ravioli", "linguini"])
      )
      // Password() transforms the default to a password type
      // YesNo() transforms the default to a confirm type
      // Validate(customValidator) adds validation
    )
  );
}
```
