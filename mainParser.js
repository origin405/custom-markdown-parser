import { EmphasisHandler } from "./emphasisHandler.js";
import { ListHandler } from "./listHandler.js";
import { HeaderHandler } from "./headerHandler.js";
import { CodeBlockHandler } from "./codeBlockHandler.js";

class MainParser {
  constructor(document, chatDivElement) {
    this.document = document;
    this.chatDivElement = chatDivElement;
    this.mainStack = [this.chatDivElement];
    this.handlers = {
      emphasis: new EmphasisHandler(
        this.document,
        this.chatDivElement,
        () => this.clearActiveHandler(),
        this.mainStack
      ),
      header: new HeaderHandler(
        this.document,
        this.chatDivElement,
        () => this.clearActiveHandler(),
        this.mainStack
      ),
      list: new ListHandler(
        this.document,
        this.chatDivElement,
        () => this.clearActiveHandler(),
        this.mainStack
      ),
      codeBlock: new CodeBlockHandler(
        this.document,
        this.chatDivElement,
        () => this.clearActiveHandler(),
        this.mainStack
      ),
    };
    this.markdownRegex = /(\S\s*)?(\*\*|\*|__|_|~~|`|\[|>|\#{1,6}|1|[-*+]|```)/;
    this.paragraphSeparatorRegex = /(\S\s*)?\n\n/;
  }

  parseChunk(chunk) {
    if (chunk === "") {
      return;
    }

    const currentElement = this.mainStack.at(-1);
    const isCurrentElementChatDiv = currentElement === this.chatDivElement;

    if (!isCurrentElementChatDiv && currentElement.tagName !== "P") {
      currentElement.handle(chunk);
      return;
    }

    const paragraphSeparatorMatch = this.paragraphSeparatorRegex.exec(chunk);
    if (paragraphSeparatorMatch) {
      if (paragraphSeparatorMatch[1]) {
        currentElement.innerHTML += paragraphSeparatorMatch[1];
      }
      this.mainStack.pop();
      return;
    }

    if (!this.isMarkdownPresent(chunk)) {
      if (isCurrentElementChatDiv) {
        const paragraphElement = this.createParagraphElement();
        paragraphElement.innerHTML += chunk;
      } else {
        currentElement.innerHTML += chunk;
      }
      return;
    }

    const matchingHandler = this.findMatchingHandler(chunk);
    if (matchingHandler) {
      this.setupHandler(matchingHandler, chunk);
    } else {
      currentElement.innerHTML += chunk;
    }
  }

  isMarkdownPresent(chunk) {
    return this.markdownRegex.test(chunk);
  }

  createParagraphElement() {
    const paragraphElement = this.document.createElement("p");
    this.chatDivElement.appendChild(paragraphElement);
    this.mainStack.push(paragraphElement);
    return paragraphElement;
  }

  findMatchingHandler(chunk) {
    for (const handlerKey in this.handlers) {
      const handler = this.handlers[handlerKey];
      if (handler.matches(chunk)) {
        return handler;
      }
    }
    return null;
  }

  setupHandler(handler, chunk) {
    if (
      handler instanceof EmphasisHandler &&
      this.mainStack.at(-1) === this.chatDivElement
    ) {
      this.createParagraphElement();
    }
    this.mainStack.push(handler);
    handler.handle(chunk);
  }

  clearActiveHandler() {
    this.mainStack.pop();
  }
}

export { MainParser };
