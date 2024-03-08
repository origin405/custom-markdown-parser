import { EmphasisHandler } from "./emphasisHandler.js";

class HeaderHandler {
  constructor(document, chatDivElement, doneCallback) {
    this.document = document;
    this.chatDivElement = chatDivElement;
    this.doneCallback = doneCallback;
    this.activeHeader = null;
    this.emphasisHandlerActive = false;
    this.headerRegex = /^#{1,6}$/;
    this.newlineRegex = /\s*\n/;
    this.emphasis = new EmphasisHandler(
      this.document,
      this.chatDivElement,
      this.deactivateEmphasisHandler.bind(this),
      null,
      null,
      null,
      this.getActiveHeader.bind(this)
    );
  }

  /**
   * Checks if the given chunk matches the header syntax.
   * @param {string} chunk - The chunk to check.
   * @returns {boolean} - True if the chunk matches the header syntax, false otherwise.
   */
  matches(chunk) {
    return this.headerRegex.test(chunk);
  }

  /**
   * Handles the processing of the header chunk.
   * @param {string} chunk - The chunk to process.
   */
  handle(chunk) {
    if (this.matches(chunk)) {
      this.createHeader(chunk);
    } else {
      this.processContent(chunk);
    }
  }

  /**
   * Creates a new header element based on the number of hashtags.
   * @param {string} chunk - The chunk containing the header syntax.
   */
  createHeader(chunk) {
    const headerLevel = chunk.length;
    const header = this.document.createElement(`h${headerLevel}`);
    this.activeHeader = header;
    this.chatDivElement.appendChild(header);
  }

  /**
   * Processes the content of the header.
   * @param {string} chunk - The chunk to process.
   */
  processContent(chunk) {
    if (this.newlineRegex.test(chunk)) {
      this.resetActiveHeader();
      this.doneCallback();
    } else if (this.emphasisHandlerActive) {
      this.emphasis.handle(chunk);
    } else if (this.emphasis.matches(chunk)) {
      this.emphasisHandlerActive = true;
      this.emphasis.handle(chunk);
    } else {
      this.appendContent(chunk);
    }
  }

  /**
   * Appends the content to the active header.
   * @param {string} content - The content to append.
   */
  appendContent(content) {
    if (this.activeHeader) {
      this.activeHeader.innerHTML += content;
    } else {
      console.warn("No active header to append content.");
    }
  }

  /**
   * Deactivates the emphasis handler.
   */
  deactivateEmphasisHandler() {
    this.emphasisHandlerActive = false;
  }

  /**
   * Resets the active header.
   */
  resetActiveHeader() {
    this.activeHeader = null;
  }

  /**
   * Retrieves the active header.
   * @returns {HTMLElement|null} - The active header element or null if not set.
   */
  getActiveHeader() {
    return this.activeHeader;
  }
}

export { HeaderHandler };
