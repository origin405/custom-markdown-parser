import { EmphasisHandler } from "./emphasisHandler.js";
class HeaderHandler {
  constructor(document, chatDivElement, doneCallback, mainStack) {
    this.mainStack = mainStack;
    this.emphasisStack = [
      { element: { tagName: "DUMMY" }, markdownType: "DUMMY" },
    ];
    //Add dummy to stack, turning array not null, allowing check for at(-1).tagName

    this.document = document;
    this.chatDivElement = chatDivElement;
    this.activeHeader = null;
    this.emphasisHandlerActive = false;

    this.doneCallback = doneCallback;
    this.isThereHeaderRegex = /^#{1,6}$/;
    this.newlineRegex = /\s*\n/;
    this.emphasis = new EmphasisHandler(
      this.document,
      this.chatDivElement,
      () => this.deactivateEmphasisHandler(),
      (this.mainStack = null),
      (this.activeLI = null),
      (this.listStack = null),
      () => this.activeHeader
    );
  }
  matches(chunk) {
    return this.isThereHeaderRegex.test(chunk);
  }
  handle(chunk) {
    console.log("header chunk, ", chunk);
    if (this.isThereHeaderRegex.test(chunk)) {
      const headerNumOfHashtags = chunk.length;
      const header = document.createElement(`h${headerNumOfHashtags}`);
      this.activeHeader = header;
      console.log("setting active header", this.activeHeader);
      this.chatDivElement.appendChild(header);
    } else {
      if (this.newlineRegex.test(chunk)) {
        this.doneCallback();
      }
      if (this.emphasisHandlerActive) {
        this.emphasis.handle(chunk);
      } else if (this.emphasis.matches(chunk)) {
        this.emphasisHandlerActive = true;
        this.emphasis.handle(chunk);
      } else {
        this.activeHeader.innerHTML += chunk;
      }
    }
  }
  deactivateEmphasisHandler() {
    this.emphasisHandlerActive = false;
  }
}

export { HeaderHandler };
