class CodeBlockHandler {
  constructor(document, chatDivElement, doneCallback, mainStack) {
    // Regular expression to match a line with exactly three backticks (```)
    this.document = document;
    this.chatDivElement = chatDivElement;
    this.doneCallback = doneCallback;
    this.mainStack = mainStack;
    this.isThereCodeBlockRegex = /^```\s*$/;
    this.state = {
      AWAITING_START: 0,
      READING_LANGUAGE: 1,
      READING_CODE: 2,
    };
    this.currentState = this.state.AWAITING_START;
    this.codeLanguage = "";
    this.codeHeaderDiv;
    this.codeBodyMain;
  }

  matches(chunk) {
    // Test if the chunk matches the code block pattern
    return this.isThereCodeBlockRegex.test(chunk);
  }

  handle(chunk) {
    switch (this.currentState) {
      case this.state.AWAITING_START:
        // If chunk is ``` switch to READING_LANGUAGE
        if (chunk === "```") {
          this.createBlock();
          this.currentState = this.state.READING_LANGUAGE;
        }
        break;

      case this.state.READING_LANGUAGE:
        // If chunk is \n, switch to READING_CODE
        if (chunk === "\n") {
          this.currentState = this.state.READING_CODE;
        } else {
          this.codeLanguage += chunk;
          this.addLanguageToHeader();
        }
        break;

      case this.state.READING_CODE:
        // If chunk is ``` switch to COMPLETED
        if (chunk === "```") {
          //Completed, callback
          this.doneCallback();
        } else {
          console.log("code chunk", chunk, "-----");
          this.codeBodyMain.innerHTML += chunk;
        }
        break;

      default:
        // Handle default case or throw an error
        console.log("chunk is not a code block");
        this.mainStack.at(-2).innerHTML += chunk;
        this.doneCallback;
    }
  }

  createBlock() {
    const codeBlockDiv = document.createElement("div");
    codeBlockDiv.className = "code-block";

    const codeHeaderDiv = document.createElement("div");
    codeHeaderDiv.className = "code-header";
    this.codeHeaderDiv = codeHeaderDiv;

    const codeBodyMain = document.createElement("div");
    codeBodyMain.className = "code-body";
    this.codeBodyMain = codeBodyMain;

    this.chatDivElement.appendChild(codeBlockDiv);
    codeBlockDiv.appendChild(codeHeaderDiv);
    codeBlockDiv.appendChild(codeBodyMain);
  }
  addLanguageToHeader() {
    // Create a new span element
    const languageSpan = document.createElement("span");
    languageSpan.textContent = this.codeLanguage;
    languageSpan.className = this.codeLanguage;
    this.codeHeaderDiv.appendChild(languageSpan);
  }
}

export { CodeBlockHandler };
