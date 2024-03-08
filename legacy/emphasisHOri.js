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
    //Add dummy to stack, turning array not null, allowing check for at(-1).tagName
    this.emphasisStackTest = [];
    this.document = document;
    this.chatDivElement = chatDivElement;
    this.activeHeader = activeHeader;

    this.doneCallback = doneCallback;
    this.isThereEmphasisRegex = /(\*\*\*|___|\*\*|__|\*|_|~~|(?<!`)`(?!`))/;
    // this.isThereEmphasisRegex = /(\*\*\*|___|\*\*|__|\*|_|~~|`)/;
    // Emphasis Markdown Regex
    this.boldRegex = /(\S\s*)?(\*\*|__)/;
    this.italicRegex = /(\S\s*)?(\*|_)/;
    // this.boldItalicRegex = /(\S\s*)?(\*\*\*|___)/;
    this.strikeThroughRegex = /(\S\s*)?~~/;
    this.inlineCodeRegex = /(\S\s*)?(`)/;

    //List Handler
    this.activeLI = activeLI;
    this.listStack = listStack;

    this.markdownHandlers = [
      { regex: this.boldRegex, handler: this.processBold.bind(this) },
      { regex: this.italicRegex, handler: this.processItalic.bind(this) },
      // {
      //   regex: this.boldItalicRegex,
      //   handler: this.processBoldItalic.bind(this),
      // },
      {
        regex: this.strikeThroughRegex,
        handler: this.processStrikethrough.bind(this),
      },
      {
        regex: this.inlineCodeRegex,
        handler: this.processInlineCode.bind(this),
      },
    ];
    this.stateHandlers = {
      STRONG: this.processBold.bind(this),
      EM: this.processItalic.bind(this),
      // STRONG: this.processBoldItalic.bind(this),
      DEL: this.processStrikethrough.bind(this),
      CODE: this.processInlineCode.bind(this),
      // Add more handlers if needed...
    };
  }
  matches(chunk) {
    return this.isThereEmphasisRegex.test(chunk);
  }
  handle(chunk) {
    if (!this.isThereEmphasisRegex.test(chunk)) {
      const handler =
        this.stateHandlers[this.emphasisStack.at(-1).element.tagName];
      if (handler) {
        handler(chunk);
        return;
      }
    } else {
      for (const { regex, handler } of this.markdownHandlers) {
        if (regex.test(chunk)) {
          handler(chunk);
          return;
        }
      }
    }
  }
  processBold(chunk) {
    const result = this.boldRegex.exec(chunk);
    // Check if there's a match and proceed
    if (result) {
      const preText = result[1];
      const markdown = result[2];
      // If there's a preceding non-markdown character, append it first
      if (preText) {
        if (this.listStack) {
          this.activeLI.innerHTML += preText;
        } else if (
          typeof this.activeHeader === "function" &&
          this.activeHeader()
        ) {
          this.activeHeader().innerHTML += preText;
        } else {
          this.mainStack.at(-2).innerHtml += preText;
        }
      }
      let lastStackItem = this.emphasisStack.at(-1);
      // Check the state and toggle it accordingly
      if (
        lastStackItem.element.tagName !== "STRONG" ||
        lastStackItem.markdownType !== markdown
      ) {
        const element = this.document.createElement("strong");
        // element.innerText += " ";
        //Check if markdown is nested, add a white space if yes
        if (this.emphasisStack.length < 2) {
          element.innerText += " ";
        }
        //Main stack would have the handler at -1, and the <p> at -2, where we would need to appendchild to <p>
        //Check if nested, push to stack element rather than mainStack
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
          } else if (
            typeof this.activeHeader === "function" &&
            this.activeHeader()
          ) {
            this.activeHeader().appendChild(element);
          } else {
            this.mainStack.at(-2).appendChild(element);
          }
        } else {
          this.emphasisStack.at(-1).element.appendChild(element);
        }
        this.emphasisStack.push({ element: element, markdownType: markdown });
      } else {
        this.emphasisStack.pop();
        if (this.emphasisStack.length == 1) {
          this.doneCallback();
        }
      }
    } else {
      // If there's no match, just append the chunk as is
      console.log("appending bold text?", chunk);
      this.emphasisStack.at(-1).element.innerHTML += chunk;
    }
  }
  processItalic(chunk) {
    const result = this.italicRegex.exec(chunk);
    if (result) {
      const preText = result[1]; // Captured non-markdown text
      const markdown = result[2];
      if (preText) {
        if (this.listStack) {
          this.activeLI.innerHTML += preText;
        } else if (
          typeof this.activeHeader === "function" &&
          this.activeHeader()
        ) {
          this.activeHeader().innerHTML += preText;
        } else {
          this.mainStack.at(-2).innerHtml += preText;
        }
      }
      let lastStackItem = this.emphasisStack.at(-1);
      if (
        lastStackItem.element.tagName !== "EM" ||
        lastStackItem.markdownType !== markdown
      ) {
        const element = this.document.createElement("em");
        element.innerText += " ";
        // if (this.emphasisStack.length >= 2) {
        //   element.innerText += " ";
        // }
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
          } else if (
            typeof this.activeHeader === "function" &&
            this.activeHeader()
          ) {
            this.activeHeader().appendChild(element);
          } else {
            this.mainStack.at(-2).appendChild(element);
          }
        } else {
          lastStackItem.element.appendChild(element);
        }
        this.emphasisStack.push({ element: element, markdownType: markdown });
      } else {
        this.emphasisStack.pop();
        if (this.emphasisStack.length == 1) {
          this.doneCallback();
        }
      }
    } else {
      this.emphasisStack.at(-1).element.innerHTML += chunk;
    }
  }
  processStrikethrough(chunk) {
    const result = this.strikeThroughRegex.exec(chunk);
    if (result) {
      const preText = result[1];
      const markdown = result[2];
      if (preText) {
        if (this.listStack) {
          this.activeLI.innerHTML += preText;
        } else if (
          typeof this.activeHeader === "function" &&
          this.activeHeader()
        ) {
          this.activeHeader().innerHTML += preText;
        } else {
          this.mainStack.at(-2).innerHtml += preText;
        }
      }
      let lastStackItem = this.emphasisStack.at(-1);
      if (
        lastStackItem.element.tagName !== "DEL" ||
        lastStackItem.markdownType !== markdown
      ) {
        const element = this.document.createElement("del");
        element.innerText += " ";
        // if (this.emphasisStack.length >= 2) {
        //   element.innerText += " ";
        // }
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
          } else if (
            typeof this.activeHeader === "function" &&
            this.activeHeader()
          ) {
            this.activeHeader().appendChild(element);
          } else {
            this.mainStack.at(-2).appendChild(element);
          }
        } else {
          lastStackItem.element.appendChild(element);
        }
        this.emphasisStack.push({ element: element, markdownType: markdown });
      } else {
        this.emphasisStack.pop();
        if (this.emphasisStack.length == 1) {
          this.doneCallback();
        }
      }
    } else {
      this.emphasisStack.at(-1).element.innerText += chunk;
    }
  }
  processInlineCode(chunk) {
    const result = this.inlineCodeRegex.exec(chunk);
    if (result) {
      const preText = result[1];
      const markdown = result[2];
      if (preText) {
        if (this.listStack) {
          this.activeLI.innerHTML += preText;
        } else if (
          typeof this.activeHeader === "function" &&
          this.activeHeader()
        ) {
          this.activeHeader().innerHTML += preText;
        } else {
          this.mainStack.at(-2).innerHtml += preText;
        }
      }
      let lastStackItem = this.emphasisStack.at(-1);
      if (
        lastStackItem.element.tagName !== "CODE" ||
        lastStackItem.markdownType !== markdown
      ) {
        const element = this.document.createElement("code");
        element.innerText += " ";
        // if (this.emphasisStack.length >= 2) {
        //   element.innerText += " ";
        // }
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
          } else if (
            typeof this.activeHeader === "function" &&
            this.activeHeader()
          ) {
            this.activeHeader().appendChild(element);
          } else {
            this.mainStack.at(-2).appendChild(element);
          }
        } else {
          lastStackItem.element.appendChild(element);
        }
        this.emphasisStack.push({ element: element, markdownType: markdown });
      } else {
        this.emphasisStack.pop();
        if (this.emphasisStack.length == 1) {
          this.doneCallback();
        }
      }
    } else {
      this.emphasisStack.at(-1).element.innerText += chunk;
    }
  }
  processBoldItalic(chunk) {
    const result = this.italicRegex.exec(chunk);
    if (result) {
      const preText = result[1]; // Captured non-markdown text
      if (preText) {
        if (this.listStack) {
          this.activeLI.innerHTML += preText;
        } else {
          this.mainStack.at(-2).innerHtml += preText;
        }
      }
      if (this.emphasisStack.at(-1).tagName != "STRONG") {
        const element = this.document.createElement("strong");
        this.mainStack.at(-2).appendChild(element);
        this.emphasisStack.push(element);
        element.classList.add("bold-italic");
      } else {
        this.emphasisStack.pop();
        this.doneCallback();
      }
    } else {
      this.emphasisStack.at(-1).element.innerText += chunk;
    }
  }
  //Test Methods
  handleTest(chunk) {
    if (!this.isThereEmphasisRegex.test(chunk)) {
      // console.log("stack: ", this.emphasisStackTest);
      const handler = this.stateHandlersTest[this.emphasisStackTest.at(-1)];
      // console.log("handler: ", handler);
      if (handler) {
        handler(chunk);
        return;
      }
    } else {
      for (const { regex, handler } of this.markdownHandlersTest) {
        if (regex.test(chunk)) {
          handler(chunk);
          // console.log(handler);
          // console.log(chunk);
          return;
        }
      }
    }
  }
}

export { EmphasisHandler };
