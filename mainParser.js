import { EmphasisHandler } from "./emphasisHandler.js";
import { ListHandler } from "./listHandler.js";

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
      list: new ListHandler(
        this.document,
        this.chatDivElement,
        () => this.clearActiveHandler(),
        this.mainStack
      ),
      // other handlers...
    };
    this.isThereMarkdownRegex =
      /(\S\s*)?(\*\*|\*|__|_|~~|`|\[|>|\#{1,6}\b|1|[-*+])/;
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
      console.log("break??");
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
        const handler = this.handlers[handlerKey];
        if (handler.matches(chunk)) {
          this.matchedHandler = true;
          //Add a p if mainStack only has chatDivElement
          if (
            handler instanceof EmphasisHandler &&
            this.mainStack.at(-1) == this.chatDivElement
          ) {
            let pElement = this.document.createElement("p");
            this.chatDivElement.appendChild(pElement);
            this.mainStack.push(pElement);
            //Step to add a whitespace before markdown, only if it's not the starting text of the html element
            if (this.mainStack.at(-1).innerHTML.trim() != "") {
              this.mainStack.at(-1).innerHTML += " ";
            }
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
  // parseChunkTester(chunk) {
  //   if (chunk === "") {
  //     if (!this.startOfChatgptResponse) {
  //       this.startOfChatgptResponse = true;
  //       return;
  //     } else if (this.mainStackTest.at(-1).tagName == "P") {
  //       this.testResultObject.expectedHtmlOutputTestResult += "</p>";
  //     }
  //   }

  //   // Check if there's an active handler
  //   if (
  //     this.mainStackTest.at(-1) != this.chatDivElement &&
  //     this.mainStackTest.at(-1).tagName != "P"
  //   ) {
  //     // Directly pass the chunk to the active handler object
  //     this.mainStackTest.at(-1).handleTest(chunk);
  //     return;
  //   }
  //   let result;
  //   if ((result = this.newParagraphRegex.exec(chunk))) {
  //     if (result[1])
  //       this.testResultObject.expectedHtmlOutputTestResult += result[1];
  //     this.testResultObject.expectedHtmlOutputTestResult += "</p>\n\n";
  //     this.mainStackTest.pop();
  //     return;
  //   }
  //   // Check if there's markdown in the chunk
  //   if (!this.isThereMarkdownRegex.test(chunk)) {
  //     //Check if stack has html elements other than chat div
  //     if (this.mainStackTest.at(-1) == this.chatDivElement) {
  //       let pElement = this.document.createElement("p");
  //       // this.chatDivElement.appendChild(pElement);
  //       this.mainStackTest.push(pElement);
  //       this.testResultObject.expectedHtmlOutputTestResult += "<p>" + chunk;
  //       return;
  //     } else if (this.mainStackTest.at(-1).tagName == "P") {
  //       this.testResultObject.expectedHtmlOutputTestResult += chunk;
  //       return;
  //     }
  //   } else {
  //     // Iterate through each handler to find a match
  //     for (const handlerKey in this.handlers) {
  //       const handler = this.handlers[handlerKey];
  //       if (handler.matches(chunk)) {
  //         if (this.mainStackTest.at(-1) == this.chatDivElement) {
  //           let pElement = this.document.createElement("p");
  //           // this.chatDivElement.appendChild(pElement);
  //           this.mainStackTest.push(pElement);
  //           this.testResultObject.expectedHtmlOutputTestResult += "<p>";
  //         }
  //         this.mainStackTest.push(handler); // Set the active handler
  //         handler.handleTest(chunk);
  //         return;
  //       }
  //     }
  //   }
  // }
  returnTestResultString() {
    return this.testResultObject.expectedHtmlOutputTestResult;
  }
}
export { MainParser };
