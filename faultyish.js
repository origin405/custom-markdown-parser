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

    this.stack = [{ element: { tagName: "DUMMY" }, spacing: 0 }]; // To track nested lists and their indentation
    this.activeLI = null; // To track the current active list item
    this.isOL = false; // To track if we're currently processing an ordered list
    this.awaitingDot = false; // To track if we're expecting a period for an ordered list item
    this.numberBufferAwaitingDot = ""; //Always 1
    this.newList = /(\S\s*)?\n/;
    this.whiteSpaceRegex = /\s+/g; //const whitespaces = text.match(whitespaceRegex); const whitespaceCount = whitespaces ? whitespaces.length : 0;
    this.onlyWhitespaceRegex = /^\s*$/; //const isOnlyWhitespace = onlyWhitespaceRegex.test(text);
    this.twoOrMoreWhitespacesRegex = /^\s{2,}$/;
    this.nestedSpaceCount = null;
    this.nestedSpaceType = "";

    this.singleWhitespaceRegex = /^\s$/;
    this.spaceDashRegex = /^ -$/;
    this.newParagraphRegex = /(\S\s*)?\n\n/;
  }

  matches(chunk) {
    return this.isThereListRegex.test(chunk);
  }

  /*
  
    */
  handle(chunk) {
    if (this.newParagraphRegex.test(chunk)) {
      let result = this.newParagraphRegex.exec(chunk);
      if (result[1]) {
        this.activeLI.textContent += result[1];
      }
      this.doneCallback();
      return;
    }
    if (this.twoOrMoreWhitespacesRegex.test(chunk)) {
      this.nestedSpaceCount = chunk.length;
      return;
    }
    if (this.awaitingDot) {
      if (chunk == ".") {
        this.handleOL();
      } else {
        if (this.newList.test(chunk)) {
          this.activeLI.textContent += this.numberBufferAwaitingDot;
          this.activeLI = null;
          this.awaitingDot = false;
          return;
        } else if (this.activeLI) {
          this.activeLI.textContent += this.activeLI.textContent + chunk;

          this.awaitingDot = false;
          return;
        } else {
          console.log("ERROR!");
        }
      }
    } else {
      if (this.newList.test(chunk)) {
        this.nestedSpaceCount = null;
        this.activeLI = null;
        this.awaitingDot = false;
        return;
      }
      if (this.isChunkNumber(chunk)) {
        this.awaitingDot = true;
        this.numberBufferAwaitingDot = chunk;
        return;
      }
      // Check if any list is active
      if (this.activeLI != null) {
        this.activeLI.textContent += chunk;
        return;
      }
      if (this.ulRegex.test(chunk)) {
        console.log("space count", this.nestedSpaceCount);
        this.handleUL(chunk);
        return;
      }
    }
  }
  handleOL() {
    if (this.numberBufferAwaitingDot == "1") {
      const olElement = this.document.createElement("ol");

      if (this.stack.at(-1).element.tagName == "DUMMY") {
        this.chatDivElement.appendChild(olElement);
      } else {
        this.stack.at(-1).element.appendChild(olElement);
      }
      this.stack.push({ element: olElement, spacing: this.nestedSpaceCount });
      const liElement = this.document.createElement("li");
      this.activeLI = liElement;
      olElement.appendChild(liElement);
    } else {
      if (this.nestedSpaceCount == this.stack.at(-1).spacing) {
        const liElement = this.document.createElement("li");
        this.activeLI = liElement;
        this.stack.at(-1).element.appendChild(liElement);
      } else {
        let foundIndex = -1;
        // Find the matching level of nesting based on spacing
        for (let i = this.stack.length - 1; i >= 0; i--) {
          if (this.stack[i].spacing === this.nestedSpaceCount) {
            foundIndex = i;
            break;
          }
        }

        if (foundIndex !== -1) {
          this.stack = this.stack.slice(0, foundIndex + 1);
          const liElement = this.document.createElement("li");
          this.activeLI = liElement;
          this.stack.at(-1).element.appendChild(liElement);
          // Now you can append newElement to stack[foundIndex].element
        } else {
          // Handle error: No matching spacing found
          console.log("Error!");
        }
      }
    }
  }
  handleUL(chunk) {
    //Either ul is first or nested, indicated by if statement below
    if (this.stack.at(-1).element.tagName == "DUMMY") {
      //Create new UL and push to chatdivelement, as it's the first item of the list
      const ulElement = this.document.createElement("ul");
      this.chatDivElement.appendChild(ulElement);
      //Push ul to stack with space count, and create li
      this.stack.push({ element: ulElement, spacing: this.nestedSpaceCount });
      const liElement = this.document.createElement("li");
      this.activeLI = liElement;
      ulElement.appendChild(liElement);
    } else {
      //Check the nestedspace count to determine if we're below, at, or above the current hierachy level
      if (this.nestedSpaceCount == null) {
        console.log("HERE");
        const liElement = this.document.createElement("li");
        this.activeLI = liElement;
        this.stack.at(-1).element.appendChild(liElement);
        return;
      } else if (this.nestedSpaceCount == this.stack.at(-1).spacing) {
        const liElement = this.document.createElement("ul");
        this.activeLI = liElement;
        this.stack.at(-1).element.appendChild(liElement);
      } else if (this.nestedSpaceCount > this.stack.at(-1).spacing) {
        const ulElement = this.document.createElement("ul");
        this.stack.at(-1).element.appendChild(ulElement);
        const liElement = this.document.createElement("li");
        ulElement.appendChild(liElement);
        this.activeLI = liElement;
      } else {
        //below, so loop stack last to first
        let foundIndex = -1;
        // Find the matching level of nesting based on spacing
        for (let i = this.stack.length - 1; i >= 0; i--) {
          if (this.stack[i].spacing === this.nestedSpaceCount) {
            foundIndex = i;
            break;
          }
        }
        if (foundIndex !== -1) {
          //Clear all inner nested ol or ul before this index, confirmed by spacing
          this.stack = this.stack.slice(0, foundIndex + 1);
          const liElement = this.document.createElement("li");
          this.activeLI = liElement;
          this.stack.at(-1).element.appendChild(liElement);
          // Now you can append newElement to stack[foundIndex].element
        } else {
          // Handle error: No matching spacing found
          console.log("Error!");
        }
      }
    }

    // else {

    //   let ulElement = this.stack.at(-1).element;
    //   const liElement = this.document.createElement("li");
    //   this.activeLI = liElement;
    //   ulElement.appendChild(liElement);
    // }
  }
  isChunkNumber(chunk) {
    return !isNaN(parseInt(chunk)) && parseInt(chunk).toString() === chunk;
  }
}
export { ListHandler };
