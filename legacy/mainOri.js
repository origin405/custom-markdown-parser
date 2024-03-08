import { EmphasisHandler } from "../emphasisHandler.js";
import { ListHandler } from "../listHandler.js";
import { HeaderHandler } from "../headerHandler.js";
import { CodeBlockHandler } from "../codeBlockHandler.js";

class MainParser {
  constructor(document, chatDivElement) {
    this.document = document;
    this.chatDivElement = chatDivElement; // Root element for appending parsed content
    this.currentProcessingElement = null;
    this.mainStack = [this.chatDivElement];
    this.startOfChatgptResponse = false;
    this.oneChunkBuffer = "";
    this.matchedHandler = false;
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

      // other handlers...
    };
    this.isThereMarkdownRegex =
      /(\S\s*)?(\*\*|\*|__|_|~~|`|\[|>|\#{1,6}|1|[-*+]|```)/;

    this.newParagraphRegex = /(\S\s*)?\n\n/;
  }

  parseChunk(chunk) {
    // Check if there's an active handler
    if (chunk == "") {
      return;
    }
    if (
      this.mainStack.at(-1) != this.chatDivElement &&
      this.mainStack.at(-1).tagName != "P"
    ) {
      this.mainStack.at(-1).handle(chunk);
      return;
    }
    let result;
    if ((result = this.newParagraphRegex.exec(chunk))) {
      if (result[1]) {
        this.mainStack.at(-1).innerHTML += result[1];
      }
      this.mainStack.pop();
      return;
    }
    // Check if there's markdown in the chunk
    if (!this.isThereMarkdownRegex.test(chunk)) {
      //Check if stack has html elements other than chat div
      if (this.mainStack.at(-1) == this.chatDivElement) {
        let pElement = this.document.createElement("p");
        this.chatDivElement.appendChild(pElement);
        this.mainStack.push(pElement);
        pElement.innerHTML += chunk;
        return;
      } else if (this.mainStack.at(-1).tagName == "P") {
        this.mainStack.at(-1).innerHTML += chunk;
        return;
      }
    } else {
      // Iterate through each handler to find a match
      for (const handlerKey in this.handlers) {
        console.log("handler key", handlerKey);
        const handler = this.handlers[handlerKey];
        if (handler.matches(chunk)) {
          console.log("handler key matched", handlerKey);
          console.log("handler matching with chunk: ", chunk);
          this.matchedHandler = true;
          //Add a p if mainStack only has chatDivElement
          if (
            handler instanceof EmphasisHandler &&
            this.mainStack.at(-1) == this.chatDivElement
          ) {
            let pElement = this.document.createElement("p");
            this.chatDivElement.appendChild(pElement);
            this.mainStack.push(pElement);
          }

          this.mainStack.push(handler); // Set the active handler
          handler.handle(chunk);
          return;
        }
      }
      if (!this.matchedHandler) {
        this.mainStack.at(-1).innerHTML += chunk;
      }
    }
  }
  clearActiveHandler() {
    // console.log("CLEAR");
    this.mainStack.pop();
  }

  returnTestResultString() {
    return this.testResultObject.expectedHtmlOutputTestResult;
  }
}
export { MainParser };
