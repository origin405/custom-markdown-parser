import { EmphasisHandler } from "./emphasisHandler.js";
class ListHandler {
  constructor(document, chatDivElement, doneCallback, mainStack) {
    this.document = document;
    this.chatDivElement = chatDivElement;
    this.mainStack = mainStack;
    this.doneCallback = doneCallback;

    this.isThereListRegex = /^(1|[-*+])$/;
    /* Matches chunks that are exactly "1" (for ordered lists) or "-", "+", "*" (for unordered lists) that consist of no space or anything else. */
    this.olRegex = /(\S)?\s*1$/;
    this.ulRegex = /(\s*)-$/;

    this.listStack = [{ element: { tagName: "DUMMY" }, spacing: 0 }]; // To track nested lists and their indentation
    this.activeLI = null; // To track the current active list item
    this.awaitingDot = false; // To track if we're expecting a period for an ordered list item
    this.numberBufferAwaitingDot = ""; //Always 1
    this.newList = /(\S\s*)?\n/;
    this.whiteSpaceRegex = /\s+/g;
    this.isThereWhitespace = /^\s{1,}$/;
    this.nestedSpaceCount = null;
    this.awaitingForSpaces = false;
    this.newParagraphRegex = /(\S\s*)?\n\n/;
    this.emphasisHandlerActive = false;

    this.emphasis = new EmphasisHandler(
      this.document,
      this.chatDivElement,
      () => this.deactivateEmphasisHandler(),
      this.mainStack,
      this.activeLI,
      this.listStack
    );
  }

  matches(chunk) {
    return this.isThereListRegex.test(chunk);
  }

  handle(chunk) {
    console.log("chunk from main: ", chunk);
    if (this.newList.test(chunk)) {
      this.nestedSpaceCount = null;
      this.activeLI = null;
      this.awaitingForSpaces = true;
      return;
    }
    //Check if we're dealing with nested, update nestedSpaceCount
    if (this.awaitingForSpaces) {
      if (this.isThereWhitespace.test(chunk)) {
        this.nestedSpaceCount = chunk.length;
        this.awaitingForSpaces = false;
        return;
      }
      this.awaitingForSpaces = false;
    }

    //Chunk "1" will be sent to here, send it back to main if "1" belongs to a paragraph.
    if (chunk == "1" && this.mainStack.at(-2).tagName == "P") {
      this.mainStack.at(-2).innerHTML += chunk;
      this.doneCallback();
    }
    //If \n\n, doneCallback.
    if (this.newParagraphRegex.test(chunk)) {
      let result = this.newParagraphRegex.exec(chunk);
      if (result[1]) {
        this.activeLI.innerHTML += result[1];
      }
      this.doneCallback();
      return;
    }
    if (this.emphasisHandlerActive) {
      console.log("emphasis active");
      this.emphasis.handle(chunk);
      return;
    } else {
      if (this.emphasis.matches(chunk)) {
        console.log("emphasis handling initial trigger");
        console.log("active li?", this.activeLI);
        this.emphasisHandlerActive = true;
        this.emphasis.handle(chunk);
        return;
      }
    }

    //Check if we have a number, and if it's a dot the next chunk. eg. "1" previously, now awaiting dot "."
    if (this.awaitingDot) {
      if (chunk == ".") {
        this.handleOL();
      } else {
        if (this.activeLI) {
          if (this.newList.test(chunk)) {
            this.activeLI.innerHTML += this.numberBufferAwaitingDot;
            this.activeLI = null;
            this.awaitingDot = false;
            return;
          }
          this.activeLI.innerHTML += this.activeLI.innerHTML + chunk;
          this.awaitingDot = false;
          return;
        } else {
          console.log("ERROR awaiting dot but chunk isn't dot!", chunk);
        }
        // if (this.activeLI) {
        //   this.activeLI.innerHTML += chunk;
        //   this.awaitingDot = false;
        // } else {
        //   this.mainStack.at(-2).innerHtml += chunk;
        //   this.awaitingDot = false;
        // }
      }
    } else {
      //Chunk before is not a number awaiting current chunk for a dot
      // if (this.newList.test(chunk)) {
      //   console.log("NEW LIST NEW LIST");
      //   this.nestedSpaceCount = null;
      //   this.activeLI = null;
      //   return;
      // }
      if (this.activeLI) {
        this.activeLI.innerHTML += chunk;
      } else if (this.isChunkNumber(chunk)) {
        this.awaitingDot = true;
        this.numberBufferAwaitingDot = chunk;
        return;
      } else if (this.ulRegex.test(chunk)) {
        console.log("handling ul", chunk);
        this.handleUL(chunk);
      }
    }
  }
  handleOL() {
    console.log("OL space count: ", this.nestedSpaceCount);
    if (this.numberBufferAwaitingDot == "1") {
      const olElement = this.document.createElement("ol");

      if (this.listStack.at(-1).element.tagName == "DUMMY") {
        this.chatDivElement.appendChild(olElement);
      } else {
        this.listStack.at(-1).element.appendChild(olElement);
      }
      this.listStack.push({
        element: olElement,
        spacing: this.nestedSpaceCount,
      });
      const liElement = this.document.createElement("li");
      this.activeLI = liElement;
      olElement.appendChild(liElement);
    } else {
      if (this.nestedSpaceCount == this.listStack.at(-1).spacing) {
        const liElement = this.document.createElement("li");
        this.activeLI = liElement;
        this.listStack.at(-1).element.appendChild(liElement);
      } else {
        let foundIndex = -1;
        // Find the matching level of nesting based on spacing
        for (let i = this.listStack.length - 1; i >= 0; i--) {
          if (this.listStack[i].spacing === this.nestedSpaceCount) {
            foundIndex = i;
            break;
          }
        }

        if (foundIndex !== -1) {
          this.listStack = this.listStack.slice(0, foundIndex + 1);
          const liElement = this.document.createElement("li");
          this.activeLI = liElement;
          this.listStack.at(-1).element.appendChild(liElement);
          // Now you can append newElement to stack[foundIndex].element
        } else {
          // Handle error: No matching spacing found
          console.log("Error handling OL!");
        }
      }
    }
    let stackSample = this.listStack;
    console.log("stack", stackSample);
  }
  handleUL(chunk) {
    //Either ul is first or nested, indicated by if statement below
    console.log("UL space count: ", this.nestedSpaceCount);
    if (this.listStack.at(-1).element.tagName == "DUMMY") {
      //Create new UL and push to chatdivelement, as it's the first item of the list
      const ulElement = this.document.createElement("ul");
      this.chatDivElement.appendChild(ulElement);
      //Push ul to stack with space count, and create li
      this.listStack.push({
        element: ulElement,
        spacing: this.nestedSpaceCount,
      });
      const liElement = this.document.createElement("li");
      this.activeLI = liElement;
      ulElement.appendChild(liElement);
    } else {
      //Check the nestedspace count to determine if we're below, at, or above the current hierachy level
      if (this.nestedSpaceCount == null) {
        console.log("HERE");
        const liElement = this.document.createElement("li");
        this.activeLI = liElement;
        this.listStack.at(-1).element.appendChild(liElement);
        return;
      } else if (this.nestedSpaceCount == this.listStack.at(-1).spacing) {
        const liElement = this.document.createElement("ul");
        this.activeLI = liElement;
        this.listStack.at(-1).element.appendChild(liElement);
      } else if (this.nestedSpaceCount > this.listStack.at(-1).spacing) {
        const ulElement = this.document.createElement("ul");
        this.listStack.at(-1).element.appendChild(ulElement);
        this.listStack.push({
          element: ulElement,
          spacing: this.nestedSpaceCount,
        });
        const liElement = this.document.createElement("li");
        ulElement.appendChild(liElement);
        this.activeLI = liElement;
      } else {
        //below, so loop stack last to first
        let foundIndex = -1;
        // Find the matching level of nesting based on spacing
        for (let i = this.listStack.length - 1; i >= 0; i--) {
          if (this.listStack[i].spacing === this.nestedSpaceCount) {
            foundIndex = i;
            break;
          }
        }
        if (foundIndex !== -1) {
          //Clear all inner nested ol or ul before this index, confirmed by spacing
          this.listStack = this.listStack.slice(0, foundIndex + 1);
          const liElement = this.document.createElement("li");
          this.activeLI = liElement;
          this.listStack.at(-1).element.appendChild(liElement);
          // Now you can append newElement to stack[foundIndex].element
        } else {
          // Handle error: No matching spacing found
          console.log("Error handling UL!");
        }
      }
      console.log("stack called from ul", this.listStack);
    }

    // else {

    //   let ulElement = this.listStack.at(-1).element;
    //   const liElement = this.document.createElement("li");
    //   this.activeLI = liElement;
    //   ulElement.appendChild(liElement);
    // }
  }
  isChunkNumber(chunk) {
    return !isNaN(parseInt(chunk)) && parseInt(chunk).toString() === chunk;
  }
  deactivateEmphasisHandler() {
    console.log("DEACTIVE EMPHASIS HANDLER CALLBACK");
    this.emphasisHandlerActive = false;
  }
}
export { ListHandler };
