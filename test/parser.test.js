import { MainParser } from "./mainParser.js";
import { extractContentFromChunks } from "./testUtils.js";
import { ParagraphMarkdownParserForTesting } from "./paragraphTest.js";
import { JSDOM } from "jsdom";
const { document } = new JSDOM(`...`).window;
describe("MainParser", () => {
  test("parses paragraph chunks correctly", () => {
    //Raw Paragraph Test Chunks
    const paragraphRawChunks = {
      chunks: [
        {
          content: "",
        },
        {
          content: "Lorem",
        },
        {
          content: " ipsum",
        },
        {
          content: " dolor",
        },
        {
          content: " sit",
        },
        {
          content: " amet",
        },
        {
          content: ",",
        },
        {
          content: " consectetur",
        },
        {
          content: " **",
        },
        {
          content: "ad",
        },
        {
          content: "ip",
        },
        {
          content: "iscing",
        },
        {
          content: "**",
        },
        {
          content: " elit",
        },
        {
          content: ".",
        },
        {
          content: " Sed",
        },
        {
          content: " *",
        },
        {
          content: "vit",
        },
        {
          content: "ae",
        },
        {
          content: "*",
        },
        {
          content: " maur",
        },
        {
          content: "is",
        },
        {
          content: " sed",
        },
        {
          content: " enim",
        },
        {
          content: " orn",
        },
        {
          content: "are",
        },
        {
          content: " sag",
        },
        {
          content: "itt",
        },
        {
          content: "is",
        },
        {
          content: ".",
        },
        {
          content: " Ut",
        },
        {
          content: " nec",
        },
        {
          content: " est",
        },
        {
          content: " *",
        },
        {
          content: "met",
        },
        {
          content: "us",
        },
        {
          content: "*",
        },
        {
          content: " eget",
        },
        {
          content: " lorem",
        },
        {
          content: " sol",
        },
        {
          content: "licit",
        },
        {
          content: "ud",
        },
        {
          content: "in",
        },
        {
          content: ".",
        },
        {
          content: " ~~",
        },
        {
          content: "Null",
        },
        {
          content: "am",
        },
        {
          content: "~~",
        },
        {
          content: " fin",
        },
        {
          content: "ibus",
        },
        {
          content: " libero",
        },
        {
          content: " at",
        },
        {
          content: " eros",
        },
        {
          content: ".",
        },
        {
          content: " Sed",
        },
        {
          content: " nec",
        },
        {
          content: " `",
        },
        {
          content: "s",
        },
        {
          content: "api",
        },
        {
          content: "en",
        },
        {
          content: "`",
        },
        {
          content: " fe",
        },
        {
          content: "ug",
        },
        {
          content: "iat",
        },
        {
          content: ",",
        },
        {
          content: " orn",
        },
        {
          content: "are",
        },
        {
          content: " justo",
        },
        {
          content: " sit",
        },
        {
          content: " amet",
        },
        {
          content: ",",
        },
        {
          content: " i",
        },
        {
          content: "ac",
        },
        {
          content: "ulis",
        },
        {
          content: " enim",
        },
        {
          content: ".",
        },
        {
          content: "",
        },
      ],
    };
    const test1 = {
      chunks: [
        {
          content: "",
        },
        {
          content: "This",
        },
        {
          content: " **",
        },
        {
          content: "_",
        },
        {
          content: "short",
        },
        {
          content: "_",
        },
        {
          content: "**",
        },
        {
          content: " paragraph",
        },
        {
          content: " includes",
        },
        {
          content: " some",
        },
        {
          content: " *",
        },
        {
          content: "italic",
        },
        {
          content: "*",
        },
        {
          content: " and",
        },
        {
          content: " `",
        },
        {
          content: "inline",
        },
        {
          content: " **",
        },
        {
          content: "code",
        },
        {
          content: "**",
        },
        {
          content: "`",
        },
        {
          content: " as",
        },
        {
          content: " well",
        },
        {
          content: " as",
        },
        {
          content: " ~~",
        },
        {
          content: "st",
        },
        {
          content: "rik",
        },
        {
          content: "eth",
        },
        {
          content: "rough",
        },
        {
          content: "~~",
        },
        {
          content: " text",
        },
        {
          content: ".",
        },
        {
          content: "",
        },
      ],
    };
    const chatDivElement = document.createElement("div");
    let testResultObject = {
      expectedHtmlOutputTestResult: "",
    };
    let mainParser = new MainParser(document, chatDivElement, testResultObject);
    const testParser = new ParagraphMarkdownParserForTesting();

    //Extract raw chunks into an array of strings HERE!
    let paragraphChunks = extractContentFromChunks(test1);

    //Pass processed chunks to main parser to get test result
    paragraphChunks.forEach((chunk) => {
      mainParser.parseChunkTester(chunk);
    });

    //Run test parser to get the correct output string
    const expectedHtml = testParser.parse(paragraphChunks);

    // Execute the parser
    const outputHtml = mainParser.returnTestResultString();

    // Assert the output
    expect(outputHtml).toBe(expectedHtml);
  });
});
