class ParagraphMarkdownParserForTesting {
  constructor() {
    this.boldRegex = /(\S\s*)?(\*\*|__)/;
    this.italicRegex = /(\S\s*)?(\*|_)/;
    this.boldItalicRegex = /(\S\s*)?(\*\*\*|___)/;
    this.strikeThroughRegex = /(\S\s*)?~~/;
    this.inlineCodeRegex = /(\S\s*)?(`)/;
    this.newParagraphRegex = /(\S\s*)?\n\n/;
    this.markdownCounter = 2; //add 2 for the paragraph tag
  }

  legacyParse(chunks) {
    let html = "<p>";
    let isBold = false;
    let isItalic = false;
    let isBoldItalic = false;
    let isStrikethrough = false;
    let isInlineCode = false;

    for (const chunk of chunks) {
      if (this.boldItalicRegex.test(chunk)) {
        this.markdownCounter++;
        isBoldItalic = !isBoldItalic;
        html += isBoldItalic ? " <strong><em>" : "</em></strong>";
      } else if (this.boldRegex.test(chunk)) {
        this.markdownCounter++;
        isBold = !isBold;
        html += isBold ? " <strong>" : "</strong>";
      } else if (this.italicRegex.test(chunk)) {
        this.markdownCounter++;
        isItalic = !isItalic;
        html += isItalic ? " <em>" : "</em>";
      } else if (this.strikeThroughRegex.test(chunk)) {
        this.markdownCounter++;
        isStrikethrough = !isStrikethrough;
        html += isStrikethrough ? " <del>" : "</del>";
      } else if (this.inlineCodeRegex.test(chunk)) {
        this.markdownCounter++;
        isInlineCode = !isInlineCode;
        html += isInlineCode ? " <code>" : "</code>";
      } else if (this.newParagraph.test(chunk)) {
        this.markdownCounter++;
        this.markdownCounter++;
        html += "</p><p>";
      } else {
        html += chunk;
      }
    }
    console.log("Total markdown elements count: ", this.markdownCounter);
    html += "</p>";
    return html;
  }
  parse(chunks) {
    let html = "<p>";
    let isBold = false;
    let isItalic = false;
    let isBoldItalic = false;
    let isStrikethrough = false;
    let isInlineCode = false;

    for (const chunk of chunks) {
      let result;

      // Bold Italic
      result = this.boldItalicRegex.exec(chunk);
      if (result) {
        if (result[1]) html += result[1]; // Add any non-markdown text before the markdown
        this.markdownCounter++;
        isBoldItalic = !isBoldItalic;
        html += isBoldItalic ? " <strong><em>" : "</em></strong>";
      }
      // Bold
      else if ((result = this.boldRegex.exec(chunk))) {
        if (result[1]) html += result[1];
        this.markdownCounter++;
        isBold = !isBold;
        html += isBold ? " <strong>" : "</strong>";
      }
      // Italic
      else if ((result = this.italicRegex.exec(chunk))) {
        if (result[1]) html += result[1];
        this.markdownCounter++;
        isItalic = !isItalic;
        html += isItalic ? " <em>" : "</em>";
      }
      // Strikethrough
      else if ((result = this.strikeThroughRegex.exec(chunk))) {
        if (result[1]) html += result[1];
        this.markdownCounter++;
        isStrikethrough = !isStrikethrough;
        html += isStrikethrough ? " <del>" : "</del>";
      }
      // Inline Code
      else if ((result = this.inlineCodeRegex.exec(chunk))) {
        if (result[1]) html += result[1];
        this.markdownCounter++;
        isInlineCode = !isInlineCode;
        html += isInlineCode ? " <code>" : "</code>";
      }
      // New Paragraph
      else if ((result = this.newParagraphRegex.exec(chunk))) {
        if (result[1]) html += result[1];
        this.markdownCounter += 4;
        html += "</p>\n\n<p>";
      } else {
        html += chunk;
      }
    }
    console.log("Total markdown elements count: ", this.markdownCounter);
    html += "</p>";
    return html;
  }
}

export { ParagraphMarkdownParserForTesting };
