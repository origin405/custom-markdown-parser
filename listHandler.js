// import { EmphasisHandler } from "./emphasisHandler.js";

// class ListHandler {
//   constructor(document, chatDivElement, doneCallback, mainStack) {
//     this.document = document;
//     this.chatDivElement = chatDivElement;
//     this.mainStack = mainStack;
//     this.doneCallback = doneCallback;

//     this.listRegex = /^(1|[-*+])$/;
//     this.orderedListRegex = /(\S)?\s*1$/;
//     this.unorderedListRegex = /(\s*)-$/;
//     this.whitespaceRegex = /^\s{1,}$/;
//     this.newListRegex = /(\S\s*)?\n/;
//     this.newParagraphRegex = /(\S\s*)?\n\n/;

//     this.listStack = [{ element: { tagName: "DUMMY" }, spacing: 0 }];
//     this.activeLI = null;
//     this.isAwaitingDot = false;
//     this.numberBuffer = "";
//     this.nestedSpaceCount = null;
//     this.isAwaitingSpaces = false;
//     this.emphasisHandlerActive = false;

//     this.emphasisHandler = new EmphasisHandler(
//       this.document,
//       this.chatDivElement,
//       () => this.deactivateEmphasisHandler(),
//       this.mainStack,
//       this.activeLI,
//       this.listStack
//     );
//   }

//   matches(chunk) {
//     return this.listRegex.test(chunk);
//   }

//   handle(chunk) {
//     if (this.newListRegex.test(chunk)) {
//       this.resetListState();
//       return;
//     }

//     if (this.isAwaitingSpaces) {
//       if (this.whitespaceRegex.test(chunk)) {
//         this.nestedSpaceCount = chunk.length;
//         this.isAwaitingSpaces = false;
//         return;
//       }
//       this.isAwaitingSpaces = false;
//     }

//     if (chunk === "1" && this.isParentParagraph()) {
//       this.appendChunkToParent(chunk);
//       return;
//     }

//     if (this.newParagraphRegex.test(chunk)) {
//       this.handleNewParagraph(chunk);
//       return;
//     }

//     if (this.emphasisHandlerActive) {
//       this.emphasisHandler.handle(chunk);
//       return;
//     } else if (this.emphasisHandler.matches(chunk)) {
//       this.activateEmphasisHandler();
//       this.emphasisHandler.handle(chunk);
//       return;
//     }

//     if (this.isAwaitingDot) {
//       this.handleAwaitingDot(chunk);
//     } else {
//       if (this.activeLI) {
//         this.appendChunkToListItem(chunk);
//       } else if (this.isChunkNumber(chunk)) {
//         this.prepareForOrderedList(chunk);
//       } else if (this.unorderedListRegex.test(chunk)) {
//         this.handleUnorderedList(chunk);
//       }
//     }
//   }

//   resetListState() {
//     this.nestedSpaceCount = null;
//     this.activeLI = null;
//     this.isAwaitingSpaces = true;
//   }

//   isParentParagraph() {
//     return this.mainStack.at(-2).tagName === "P";
//   }

//   appendChunkToParent(chunk) {
//     this.mainStack.at(-2).innerHTML += chunk;
//     this.doneCallback();
//   }

//   handleNewParagraph(chunk) {
//     const result = this.newParagraphRegex.exec(chunk);
//     if (result[1]) {
//       this.activeLI.innerHTML += result[1];
//     }
//     this.doneCallback();
//   }

//   activateEmphasisHandler() {
//     this.emphasisHandlerActive = true;
//   }

//   deactivateEmphasisHandlerdeactivateEmphasisHandler() {
//     this.emphasisHandlerActive = false;
//   }

//   handleAwaitingDot(chunk) {
//     if (chunk === ".") {
//       this.handleOrderedList();
//     } else {
//       if (this.activeLI) {
//         if (this.newListRegex.test(chunk)) {
//           this.activeLI.innerHTML += this.numberBuffer;
//           this.resetAwaitingDot();
//           return;
//         }
//         this.activeLI.innerHTML += this.activeLI.innerHTML + chunk;
//         this.resetAwaitingDot();
//       } else {
//         throw new Error("Unexpected chunk while awaiting dot: " + chunk);
//       }
//     }
//   }

//   resetAwaitingDot() {
//     this.activeLI = null;
//     this.isAwaitingDot = false;
//   }

//   appendChunkToListItem(chunk) {
//     this.activeLI.innerHTML += chunk;
//   }

//   prepareForOrderedList(chunk) {
//     this.isAwaitingDot = true;
//     this.numberBuffer = chunk;
//   }

//   handleOrderedList() {
//     if (this.numberBuffer === "1") {
//       this.createNewOrderedList();
//     } else {
//       this.appendToExistingOrderedList();
//     }
//   }

//   createNestedUnorderedList() {
//     const ulElement = this.document.createElement("ul");
//     if (this.getCurrentListItem()) {
//       this.getCurrentListItem().appendChild(ulElement);
//       this.updateListStack(ulElement);
//       this.createNewListItem(ulElement);
//     } else {
//       throw new Error("No active list item to nest the unordered list");
//     }
//   }

//   appendToExistingOrderedList() {
//     if (this.isCurrentLevel()) {
//       this.createNewListItem(this.getCurrentList());
//     } else {
//       const foundIndex = this.findMatchingNestedLevel();
//       if (foundIndex !== -1) {
//         this.updateListStackToLevel(foundIndex);
//         this.createNewListItem(this.getCurrentList());
//       } else {
//         throw new Error("No matching spacing found for ordered list");
//       }
//     }
//   }

//   handleUnorderedList(chunk) {
//     if (this.isFirstListItem()) {
//       this.createNewUnorderedList();
//     } else {
//       this.appendToExistingUnorderedList();
//     }
//   }

//   isFirstListItem() {
//     return this.listStack.at(-1).element.tagName === "DUMMY";
//   }

//   createNewUnorderedList() {
//     const ulElement = this.document.createElement("ul");
//     this.chatDivElement.appendChild(ulElement);
//     this.updateListStack(ulElement);
//     this.createNewListItem(ulElement);
//   }

//   appendToExistingUnorderedList() {
//     if (this.nestedSpaceCount === null) {
//       this.createNewListItem(this.getCurrentList());
//     } else if (this.isCurrentLevel()) {
//       this.createNewListItem(this.getCurrentList());
//     } else if (this.isNestedLevel()) {
//       this.createNestedUnorderedList();
//     } else {
//       this.appendToHigherLevelUnorderedList();
//     }
//   }

//   createNestedUnorderedList() {
//     const ulElement = this.document.createElement("ul");
//     this.getCurrentListItem().appendChild(ulElement);
//     this.updateListStack(ulElement);
//     this.createNewListItem(ulElement);
//   }

//   appendToHigherLevelUnorderedList() {
//     const foundIndex = this.findMatchingNestedLevel();
//     if (foundIndex !== -1) {
//       this.updateListStackToLevel(foundIndex);
//       this.createNewListItem(this.getCurrentList());
//     } else {
//       throw new Error("No matching spacing found for unordered list");
//     }
//   }

//   isCurrentLevel() {
//     return this.nestedSpaceCount === this.getCurrentSpacing();
//   }

//   isNestedLevel() {
//     return this.nestedSpaceCount > this.getCurrentSpacing();
//   }

//   getCurrentList() {
//     return this.listStack.at(-1).element;
//   }

//   getCurrentListItem() {
//     return this.activeLI;
//   }

//   getCurrentSpacing() {
//     return this.listStack.at(-1).spacing;
//   }

//   findMatchingNestedLevel() {
//     for (let i = this.listStack.length - 1; i >= 0; i--) {
//       if (this.listStack[i].spacing === this.nestedSpaceCount) {
//         return i;
//       }
//     }
//     return -1;
//   }

//   updateListStackToLevel(level) {
//     this.listStack = this.listStack.slice(0, level + 1);
//   }

//   appendToParentOrNestedList(element) {
//     const currentList = this.getCurrentList();
//     if (currentList) {
//       currentList.appendChild(element);
//     } else {
//       this.chatDivElement.appendChild(element);
//     }
//   }

//   updateListStack(element) {
//     this.listStack.push({
//       element: element,
//       spacing: this.nestedSpaceCount,
//     });
//   }

//   createNewListItem(parentElement) {
//     const liElement = this.document.createElement("li");
//     this.activeLI = liElement;
//     if (parentElement) {
//       parentElement.appendChild(liElement);
//     } else {
//       throw new Error("No parent element provided for the new list item");
//     }
//   }

//   isChunkNumber(chunk) {
//     return !isNaN(parseInt(chunk)) && parseInt(chunk).toString() === chunk;
//   }
// }

// export { ListHandler };
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
      this.emphasis.handle(chunk);
      return;
    } else {
      if (this.emphasis.matches(chunk)) {
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
      }
    } else {
      if (this.activeLI) {
        this.activeLI.innerHTML += chunk;
      } else if (this.isChunkNumber(chunk)) {
        this.awaitingDot = true;
        this.numberBufferAwaitingDot = chunk;
        return;
      } else if (this.ulRegex.test(chunk)) {
        this.handleUL(chunk);
      }
    }
  }
  handleOL() {
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
  }
  handleUL(chunk) {
    //Either ul is first or nested, indicated by if statement below
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
    this.emphasisHandlerActive = false;
  }
}
export { ListHandler };
