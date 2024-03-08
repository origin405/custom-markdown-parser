class EmphasisHandler {
  constructor(
    document,
    chatDivElement,
    doneCallback,
    mainStack,
    activeLI,
    listStack,
    activeHeader
  ) {
    this.mainStack = mainStack;
    this.emphasisStack = [
      { element: { tagName: "DUMMY" }, markdownType: "DUMMY" },
    ];
    this.document = document;
    this.chatDivElement = chatDivElement;
    this.activeHeader = activeHeader;
    this.doneCallback = doneCallback;
    this.activeLI = activeLI;
    this.listStack = listStack;

    // Regex pattern for matching emphasis Markdown syntax
    this.emphasisRegex = /(\*\*\*|___|\*\*|__|\*|_|~~|(?<!`)`(?!`))/;
    // Regex pattern for matching bold Markdown syntax
    this.boldRegex = /(\S\s*)?(\*\*|__)/;
    // Regex pattern for matching italic Markdown syntax
    this.italicRegex = /(\S\s*)?(\*|_)/;
    // Regex pattern for matching strikethrough Markdown syntax
    this.strikeThroughRegex = /(\S\s*)?~~/;
    // Regex pattern for matching inline code Markdown syntax
    this.inlineCodeRegex = /(\S\s*)?(`)/;

    this.markdownHandlers = [
      {
        regex: this.boldRegex,
        handler: this.processEmphasis.bind(this, "STRONG"),
      },
      {
        regex: this.italicRegex,
        handler: this.processEmphasis.bind(this, "EM"),
      },
      {
        regex: this.strikeThroughRegex,
        handler: this.processEmphasis.bind(this, "DEL"),
      },
      {
        regex: this.inlineCodeRegex,
        handler: this.processEmphasis.bind(this, "CODE"),
      },
    ];
  }

  /**
   * Checks if the given Markdown text contains emphasis syntax.
   * @param {string} markdownText - The Markdown text to check.
   * @returns {boolean} - True if the text contains emphasis syntax, false otherwise.
   */
  matches(markdownText) {
    return this.emphasisRegex.test(markdownText);
  }

  /**
   * Handles the processing of emphasis Markdown syntax in the given text.
   * @param {string} markdownText - The Markdown text to process.
   */
  handle(markdownText) {
    // If the text doesn't contain emphasis syntax, append it to the current element
    if (!this.emphasisRegex.test(markdownText)) {
      this.appendTextToCurrentElement(markdownText);
      return;
    }
    // Check each emphasis handler and process the text accordingly
    for (const { regex, handler } of this.markdownHandlers) {
      if (regex.test(markdownText)) {
        handler(markdownText);
        return;
      }
    }
  }

  /**
   * Processes the emphasis Markdown syntax based on the given tag name.
   * @param {string} tagName - The HTML tag name corresponding to the emphasis type.
   * @param {string} markdownText - The Markdown text to process.
   */
  processEmphasis(tagName, markdownText) {
    // Determine the appropriate regex based on the tag name
    let regex;
    switch (tagName) {
      case "STRONG":
        regex = this.boldRegex;
        break;
      case "EM":
        regex = this.italicRegex;
        break;
      case "DEL":
        regex = this.strikeThroughRegex;
        break;
      case "CODE":
        regex = this.inlineCodeRegex;
        break;
      default:
        console.error(`Unknown emphasis tag: ${tagName}`);
        return;
    }

    const result = regex.exec(markdownText);
    if (!result) {
      this.appendTextToCurrentElement(markdownText);
      return;
    }

    const [_, preText, markdown] = result;
    if (preText) {
      this.appendTextToCurrentElement(preText);
    }

    const lastStackItem = this.emphasisStack.at(-1);
    if (
      lastStackItem.element.tagName !== tagName ||
      lastStackItem.markdownType !== markdown
    ) {
      this.startEmphasis(tagName, markdown);
    } else {
      this.endEmphasis();
    }
  }

  /**
   * Starts a new emphasis element with the given tag name and Markdown syntax.
   * @param {string} tagName - The HTML tag name for the emphasis element.
   * @param {string} markdown - The Markdown syntax for the emphasis.
   */
  startEmphasis(tagName, markdown) {
    const element = this.document.createElement(tagName.toLowerCase());
    element.innerText = " ";

    const targetElement = this.getTargetElement();
    targetElement.appendChild(element);

    this.emphasisStack.push({ element, markdownType: markdown });
  }

  /**
   * Ends the current emphasis element and checks if all emphasis elements are closed.
   */
  endEmphasis() {
    this.emphasisStack.pop();
    if (this.emphasisStack.length === 1) {
      this.doneCallback();
    }
  }

  /**
   * Appends the given text to the current emphasis element.
   * @param {string} text - The text to append.
   */
  appendTextToCurrentElement(text) {
    const currentElement = this.emphasisStack.at(-1).element;
    currentElement.innerHTML += text;
  }

  /**
   * Retrieves the target element to which the emphasis element should be appended.
   * @returns {HTMLElement} - The target element.
   */
  getTargetElement() {
    if (this.emphasisStack.length === 1) {
      if (this.listStack) {
        return this.listStack.at(-1).element.lastElementChild;
      } else if (
        typeof this.activeHeader === "function" &&
        this.activeHeader()
      ) {
        return this.activeHeader();
      } else {
        return this.mainStack.at(-2);
      }
    } else {
      return this.emphasisStack.at(-1).element;
    }
  }
}

export { EmphasisHandler };
