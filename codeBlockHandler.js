class CodeBlockHandler {
  constructor(document, chatDivElement, doneCallback) {
    this.document = document;
    this.chatDivElement = chatDivElement;
    this.doneCallback = doneCallback;
    this.codeBlockRegex = /^```\s*$/;
    this.state = {
      AWAITING_START: 0,
      READING_LANGUAGE: 1,
      READING_CODE: 2,
    };
    this.currentState = this.state.AWAITING_START;
    this.codeLanguage = "";
    this.codeHeaderDiv = null;
    this.codeBodyMain = null;
  }

  /**
   * Checks if the given chunk matches the code block pattern.
   * @param {string} chunk - The chunk to check.
   * @returns {boolean} - True if the chunk matches the code block pattern, false otherwise.
   */
  matches(chunk) {
    return this.codeBlockRegex.test(chunk);
  }

  /**
   * Handles the processing of the code block chunk.
   * @param {string} chunk - The chunk to process.
   */
  handle(chunk) {
    switch (this.currentState) {
      case this.state.AWAITING_START:
        if (chunk === "```") {
          this.createBlock();
          this.currentState = this.state.READING_LANGUAGE;
        }
        break;

      case this.state.READING_LANGUAGE:
        if (chunk === "\n") {
          this.currentState = this.state.READING_CODE;
        } else {
          this.codeLanguage += chunk;
          this.updateLanguageHeader();
        }
        break;

      case this.state.READING_CODE:
        if (chunk === "```") {
          this.resetState();
          this.doneCallback();
        } else {
          this.appendCodeChunk(chunk);
        }
        break;

      default:
        console.warn("Unknown state:", this.currentState);
        break;
    }
  }

  /**
   * Creates the code block structure.
   */
  createBlock() {
    const codeBlockDiv = this.document.createElement("div");
    codeBlockDiv.className = "code-block";

    this.codeHeaderDiv = this.document.createElement("div");
    this.codeHeaderDiv.className = "code-header";

    this.codeBodyMain = this.document.createElement("div");
    this.codeBodyMain.className = "code-body";

    codeBlockDiv.appendChild(this.codeHeaderDiv);
    codeBlockDiv.appendChild(this.codeBodyMain);
    this.chatDivElement.appendChild(codeBlockDiv);
  }

  /**
   * Updates the language header with the detected language.
   */
  updateLanguageHeader() {
    this.codeHeaderDiv.textContent = this.codeLanguage;
    this.codeHeaderDiv.className = `code-header ${this.codeLanguage}`;
  }

  /**
   * Appends the code chunk to the code body.
   * @param {string} chunk - The code chunk to append.
   */
  appendCodeChunk(chunk) {
    this.codeBodyMain.innerHTML += chunk;
  }

  /**
   * Resets the state of the code block handler.
   */
  resetState() {
    this.currentState = this.state.AWAITING_START;
    this.codeLanguage = "";
    this.codeHeaderDiv = null;
    this.codeBodyMain = null;
  }
}

export { CodeBlockHandler };
