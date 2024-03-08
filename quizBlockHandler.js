const quizBlockPromptTemplate = ```Context:
[Some solar system interesting facts]

Detailed Instructions for Question Creation:

Question Creation: Directly following the opening && marker, WITHOUT adding any new lines,  formulate a multiple-choice question that is relevant to the provided context. This should be in plain text, with no numbering or prefixes like "Title:" or "Question:". Just the question text itself. Immediately after the question, add a single newline (\n)—no additional newlines or spaces before this.

Correct Answer Indicator: On the new line right after the question, indicate the correct answer's position with a standalone number (1, 2, 3, or 4) for a total of four choices. This number identifies the correct choice among the subsequent options. After specifying the number, add a single newline (\n).

Answer Choices: After the correct answer indicator, list the four answer choices, each on its own line, separated by a single newline (\n). Do not add formatting such as A. or 1., just the answer choice text and nothing else. Ensure there is no extra newline between the choices and that the last choice is followed by a single newline before the closing marker.

Closure: Clearly end the quiz block with the closing && marker immediately following the last choice, without any additional newlines or spaces.

Structure:
&& [Insert Question Here]
[Correct Answer Number: 1/2/3/4]
[Insert Choice 1 Here]
[Insert Choice 2 Here]
[Insert Choice 3 Here]
[Insert Choice 4 Here]
&&

Sample:
&& What is the age of the world's oldest wooden wheel?
2
More than 3,000 years
More than 5,000 years
More than 7,000 years
More than 10,000 years
&&


```;
