class EmphasisHandler {
  constructor(
    document,
    chatDivElement,
    doneCallback,
    mainStack,
    activeLI,
    listStack
  ) {
    this.mainStack = mainStack;
    this.emphasisStack = [
      { element: { tagName: "DUMMY" }, markdownType: "DUMMY" },
    ];
    //Add dummy to stack, turning array not null, allowing check for at(-1).tagName
    this.emphasisStackTest = [];
    this.document = document;
    this.chatDivElement = chatDivElement;

    this.doneCallback = doneCallback;
    this.isThereEmphasisRegex = /(\*\*\*|___|\*\*|__|\*|_|~~|`)/;
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
    this.markdownHandlersTest = [
      { regex: this.boldRegex, handler: this.processBoldTest.bind(this) },
      { regex: this.italicRegex, handler: this.processItalicTest.bind(this) },
      {
        regex: this.boldItalicRegex,
        handler: this.processBoldItalicTest.bind(this),
      },
      {
        regex: this.strikeThroughRegex,
        handler: this.processStrikethroughTest.bind(this),
      },
      {
        regex: this.inlineCodeRegex,
        handler: this.processInlineCodeTest.bind(this),
      },
      // Add more mappings as needed...
    ];
    this.stateHandlersTest = {
      bold: this.processBoldTest.bind(this),
      italic: this.processItalicTest.bind(this),
      boldItalic: this.processBoldItalicTest.bind(this),
      strikeThrough: this.processStrikethroughTest.bind(this),
      inlineCode: this.processInlineCodeTest.bind(this),
      // Add more handlers if needed...
    };
    this.flip = true;
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
    console.log("Chunk:", chunk);
    const result = this.boldRegex.exec(chunk);
    // Check if there's a match and proceed
    if (result) {
      const preText = result[1];
      const markdown = result[2];
      // If there's a preceding non-markdown character, append it first
      if (preText) {
        if (this.listStack) {
          this.activeLI.innerHTML += preText;
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
        //Check if markdown is nested, add a white space if yes
        if (this.emphasisStack.length >= 2) {
          element.innerText += " ";
        }
        //Main stack would have the handler at -1, and the <p> at -2, where we would need to appendchild to <p>
        //Check if nested, push to stack element rather than mainStack
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
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
      // If there's no match, just append the chunk as is#
      console.log("append as it is?", chunk);
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
        if (this.emphasisStack.length >= 2) {
          element.innerText += " ";
        }
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
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
        if (this.emphasisStack.length >= 2) {
          element.innerText += " ";
        }
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
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
        if (this.emphasisStack.length >= 2) {
          element.innerText += " ";
        }
        if (this.emphasisStack.length == 1) {
          if (this.listStack) {
            this.listStack.at(-1).element.lastElementChild.appendChild(element);
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
    // console.log("expectedHtmlOutputTestResult: ", this.expectedHtmlOutputTestResult);
  }
  processBoldTest(chunk) {
    const match = this.boldRegex.exec(chunk);
    // Check if there's a match and proceed
    if (match) {
      // If there's a preceding non-markdown character, append it first
      if (match[1]) {
        this.testResultObject.expectedHtmlOutputTestResult += match[1];
      }
      // Check the state and toggle it accordingly
      if (this.emphasisStackTest.at(-1) != "bold") {
        this.emphasisStackTest.push("bold");
        this.testResultObject.expectedHtmlOutputTestResult += " <strong>";
      } else {
        this.testResultObject.expectedHtmlOutputTestResult += "</strong>";
        this.emphasisStackTest.pop();
        this.state = null;
        this.doneCallback();
      }
    } else {
      // If there's no match, just append the chunk as is
      this.testResultObject.expectedHtmlOutputTestResult += chunk;
    }
  }
  processItalicTest(chunk) {
    const result = this.italicRegex.exec(chunk);
    if (result) {
      const preText = result[1]; // Captured non-markdown text
      if (preText) {
        this.testResultObject.expectedHtmlOutputTestResult += preText;
      }

      if (this.emphasisStackTest.at(-1) != "italic") {
        this.emphasisStackTest.push("italic");
        this.testResultObject.expectedHtmlOutputTestResult += " <em>";
      } else {
        this.testResultObject.expectedHtmlOutputTestResult += "</em>";
        this.emphasisStackTest.pop();
        this.state = null;
        this.doneCallback();
      }
    } else {
      this.testResultObject.expectedHtmlOutputTestResult += chunk;
    }
  }
  processBoldItalicTest(chunk) {
    const result = this.boldItalicRegex.exec(chunk);
    if (result) {
      const preText = result[1];
      if (preText) {
        this.testResultObject.expectedHtmlOutputTestResult += preText;
      }

      if (this.emphasisStackTest.at(-1) != "boldItalic") {
        this.emphasisStackTest.push("boldItalic");
        this.testResultObject.expectedHtmlOutputTestResult += " <strong><em>";
      } else {
        this.testResultObject.expectedHtmlOutputTestResult += "</em></strong>";
        this.emphasisStackTest.pop();
        this.state = null;
        this.doneCallback();
      }
    } else {
      this.testResultObject.expectedHtmlOutputTestResult += chunk;
    }
  }

  processStrikethroughTest(chunk) {
    const result = this.strikeThroughRegex.exec(chunk);
    if (result) {
      const preText = result[1];
      if (preText) {
        this.testResultObject.expectedHtmlOutputTestResult += preText;
      }

      if (this.emphasisStackTest.at(-1) != "strikeThrough") {
        this.emphasisStackTest.push("strikeThrough");
        this.testResultObject.expectedHtmlOutputTestResult += " <del>";
      } else {
        this.testResultObject.expectedHtmlOutputTestResult += "</del>";
        this.emphasisStackTest.pop();
        this.state = null;
        this.doneCallback();
      }
    } else {
      this.testResultObject.expectedHtmlOutputTestResult += chunk;
    }
  }
  processInlineCodeTest(chunk) {
    const result = this.inlineCodeRegex.exec(chunk);
    if (result) {
      const preText = result[1];
      if (preText) {
        this.testResultObject.expectedHtmlOutputTestResult += preText;
      }

      if (this.emphasisStackTest.at(-1) != "inlineCode") {
        this.emphasisStackTest.push("inlineCode");
        this.testResultObject.expectedHtmlOutputTestResult += " <code>";
      } else {
        this.testResultObject.expectedHtmlOutputTestResult += "</code>";
        this.emphasisStackTest.pop();
        this.state = null;
        this.doneCallback();
      }
    } else {
      this.testResultObject.expectedHtmlOutputTestResult += chunk;
    }
  }
}

export { EmphasisHandler };
