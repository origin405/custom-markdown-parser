import { MainParser } from "./mainParser.js";
import { extractContentFromChunks } from "./testUtils.js";
import { ParagraphMarkdownParserForTesting } from "./paragraphTest.js";

// Define the markdownParse function
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
const paragraphRawChunks2 = {
  chunks: [
    {
      content: "",
    },
    {
      content: "*",
    },
    {
      content: "Ap",
    },
    {
      content: "ologies",
    },
    {
      content: " for",
    },
    {
      content: " that",
    },
    {
      content: " oversight",
    },
    {
      content: "!",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " a",
    },
    {
      content: " ",
    },
    {
      content: "50",
    },
    {
      content: "-word",
    },
    {
      content: " paragraph",
    },
    {
      content: " with",
    },
    {
      content: " the",
    },
    {
      content: " requested",
    },
    {
      content: " markdown",
    },
    {
      content: "s",
    },
    {
      content: ":*",
    },
    {
      content: " \n\n",
    },
    {
      content: "*",
    },
    {
      content: "In",
    },
    {
      content: " the",
    },
    {
      content: " world",
    },
    {
      content: " of",
    },
    {
      content: " programming",
    },
    {
      content: ",",
    },
    {
      content: " **",
    },
    {
      content: "_",
    },
    {
      content: "coding",
    },
    {
      content: "_",
    },
    {
      content: "**",
    },
    {
      content: " allows",
    },
    {
      content: " individuals",
    },
    {
      content: " to",
    },
    {
      content: " create",
    },
    {
      content: " **",
    },
    {
      content: "inn",
    },
    {
      content: "ov",
    },
    {
      content: "ative",
    },
    {
      content: "**",
    },
    {
      content: " solutions",
    },
    {
      content: " to",
    },
    {
      content: " **",
    },
    {
      content: "complex",
    },
    {
      content: "**",
    },
    {
      content: " problems",
    },
    {
      content: ".",
    },
    {
      content: " Learning",
    },
    {
      content: " to",
    },
    {
      content: " code",
    },
    {
      content: " opens",
    },
    {
      content: " up",
    },
    {
      content: " a",
    },
    {
      content: " world",
    },
    {
      content: " of",
    },
    {
      content: " possibilities",
    },
    {
      content: ",",
    },
    {
      content: "\n",
    },
    {
      content: " from",
    },
    {
      content: " building",
    },
    {
      content: " websites",
    },
    {
      content: " using",
    },
    {
      content: " `",
    },
    {
      content: "HTML",
    },
    {
      content: "`",
    },
    {
      content: " and",
    },
    {
      content: " **",
    },
    {
      content: "CSS",
    },
    {
      content: "**",
    },
    {
      content: " to",
    },
    {
      content: " developing",
    },
    {
      content: " software",
    },
    {
      content: " and",
    },
    {
      content: " applications",
    },
    {
      content: " using",
    },
    {
      content: " languages",
    },
    {
      content: " like",
    },
    {
      content: " **",
    },
    {
      content: "Python",
    },
    {
      content: "**",
    },
    {
      content: " or",
    },
    {
      content: " **",
    },
    {
      content: "Java",
    },
    {
      content: "**",
    },
    {
      content: ".",
    },
    {
      content: " Em",
    },
    {
      content: "brace",
    },
    {
      content: " the",
    },
    {
      content: " power",
    },
    {
      content: " of",
    },
    {
      content: " coding",
    },
    {
      content: " today",
    },
    {
      content: "!*",
    },
    {
      content: "",
    },
  ],
};
const nestedParagraphEmphasisChunk = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Yes",
    },
    {
      content: ",",
    },
    {
      content: " it",
    },
    {
      content: " is",
    },
    {
      content: "**",
    },
    {
      content: " possible",
    },
    {
      content: " to",
    },
    {
      content: " have",
    },
    {
      content: " nested",
    },
    {
      content: "**",
    },
    {
      content: " emphasis",
    },
    {
      content: " markdown",
    },
    {
      content: " in",
    },
    {
      content: " a",
    },
    {
      content: " paragraph",
    },
    {
      content: ".",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " an",
    },
    {
      content: " example",
    },
    {
      content: " sentence",
    },
    {
      content: ":\n\n",
    },
    {
      content: "*",
    },
    {
      content: "In",
    },
    {
      content: " the",
    },
    {
      content: " **",
    },
    {
      content: "world",
    },
    {
      content: "**",
    },
    {
      content: " of",
    },
    {
      content: " coding",
    },
    {
      content: ",",
    },
    {
      content: " mastering",
    },
    {
      content: " _",
    },
    {
      content: "multiple",
    },
    {
      content: "_",
    },
    {
      content: " programming",
    },
    {
      content: " languages",
    },
    {
      content: " can",
    },
    {
      content: " open",
    },
    {
      content: " up",
    },
    {
      content: " a",
    },
    {
      content: " realm",
    },
    {
      content: " of",
    },
    {
      content: " **",
    },
    {
      content: "_",
    },
    {
      content: "end",
    },
    {
      content: "less",
    },
    {
      content: " possibilities",
    },
    {
      content: "_",
    },
    {
      content: "**",
    },
    {
      content: ".*",
    },
    {
      content: "",
    },
  ],
};

const ol5 = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Sure",
    },
    {
      content: ",",
    },
    {
      content: " here",
    },
    {
      content: " is",
    },
    {
      content: " an",
    },
    {
      content: " example",
    },
    {
      content: " of",
    },
    {
      content: " an",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: ":\n\n",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "**",
    },
    {
      content: " is",
    },
    {
      content: " an",
    },
    {
      content: " example",
    },
    {
      content: "**",
    },
    {
      content: "\n",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "3",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "3",
    },
    {
      content: "\n",
    },
    {
      content: "4",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "4",
    },
    {
      content: "\n",
    },
    {
      content: "5",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "5",
    },
    {
      content: "",
    },
  ],
}; //clear

const ul5 = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Certainly",
    },
    {
      content: "!",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " an",
    },
    {
      content: " example",
    },
    {
      content: " of",
    },
    {
      content: " an",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: ":\n\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "3",
    },
    {
      content: "\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "4",
    },
    {
      content: "\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "5",
    },
    {
      content: "\n\n",
    },
    {
      content: "Each",
    },
    {
      content: " item",
    },
    {
      content: " in",
    },
    {
      content: " this",
    },
    {
      content: " list",
    },
    {
      content: " is",
    },
    {
      content: " preceded",
    },
    {
      content: " by",
    },
    {
      content: " a",
    },
    {
      content: " bullet",
    },
    {
      content: " point",
    },
    {
      content: " to",
    },
    {
      content: " indicate",
    },
    {
      content: " that",
    },
    {
      content: " the",
    },
    {
      content: " items",
    },
    {
      content: " are",
    },
    {
      content: " in",
    },
    {
      content: " no",
    },
    {
      content: " particular",
    },
    {
      content: " order",
    },
    {
      content: ".",
    },
    {
      content: "",
    },
  ],
}; //clear

const ol3_2ol = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Certainly",
    },
    {
      content: "!",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " 1",
    },
    {
      content: " example",
    },
    {
      content: " of",
    },
    {
      content: " a",
    },
    {
      content: " nested",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: ":\n\n",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "3",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " C",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " C",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " C",
    },
    {
      content: "2",
    },
    {
      content: "\n\n",
    },
    {
      content: "In",
    },
    {
      content: " a",
    },
    {
      content: " nested",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: ",",
    },
    {
      content: " sub",
    },
    {
      content: "items",
    },
    {
      content: " are",
    },
    {
      content: " ind",
    },
    {
      content: "ented",
    },
    {
      content: " to",
    },
    {
      content: " show",
    },
    {
      content: " their",
    },
    {
      content: " hierarchical",
    },
    {
      content: " relationship",
    },
    {
      content: " with",
    },
    {
      content: " the",
    },
    {
      content: " main",
    },
    {
      content: " items",
    },
    {
      content: ".",
    },
    {
      content: "",
    },
  ],
}; //clear

const ol_2ul = {
  chunks: [
    {
      content: "",
    },
    {
      content: "I",
    },
    {
      content: " see",
    },
    {
      content: " that",
    },
    {
      content: " you",
    },
    {
      content: " are",
    },
    {
      content: " looking",
    },
    {
      content: " for",
    },
    {
      content: " an",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: " with",
    },
    {
      content: " two",
    },
    {
      content: " items",
    },
    {
      content: " under",
    },
    {
      content: " each",
    },
    {
      content: " main",
    },
    {
      content: " item",
    },
    {
      content: ",",
    },
    {
      content: " similar",
    },
    {
      content: " to",
    },
    {
      content: " an",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: " with",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: " bullet",
    },
    {
      content: " points",
    },
    {
      content: " each",
    },
    {
      content: " as",
    },
    {
      content: " you",
    },
    {
      content: " mentioned",
    },
    {
      content: ".",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " an",
    },
    {
      content: " example",
    },
    {
      content: ":\n\n",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Main",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Main",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "3",
    },
    {
      content: ".",
    },
    {
      content: " Main",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "3",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n\n",
    },
    {
      content: "In",
    },
    {
      content: " this",
    },
    {
      content: " example",
    },
    {
      content: ",",
    },
    {
      content: " each",
    },
    {
      content: " main",
    },
    {
      content: " item",
    },
    {
      content: " in",
    },
    {
      content: " the",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: " has",
    },
    {
      content: " two",
    },
    {
      content: " bullet",
    },
    {
      content: " points",
    },
    {
      content: " under",
    },
    {
      content: " it",
    },
    {
      content: ",",
    },
    {
      content: " creating",
    },
    {
      content: " a",
    },
    {
      content: " nested",
    },
    {
      content: " structure",
    },
    {
      content: " with",
    },
    {
      content: " two",
    },
    {
      content: " sub",
    },
    {
      content: "items",
    },
    {
      content: " for",
    },
    {
      content: " each",
    },
    {
      content: " main",
    },
    {
      content: " item",
    },
    {
      content: ".",
    },
    {
      content: "",
    },
  ],
}; //clear

const ul_2ol_2ul = {
  chunks: [
    {
      content: "",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: " \n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "      ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "      ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "      ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "      ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "",
    },
  ],
}; //clear

const ol_2ol_2ul = {
  chunks: [
    {
      content: "",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Main",
    },
    {
      content: " Item",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Bullet",
    },
    {
      content: " B",
    },
    {
      content: "",
    },
  ],
}; //clear

const ul_2ul = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Sure",
    },
    {
      content: "!",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " a",
    },
    {
      content: " simple",
    },
    {
      content: " list",
    },
    {
      content: " sample",
    },
    {
      content: ":\n\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "",
    },
  ],
}; //clear!

const ol2_ul2_ol1 = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Sure",
    },
    {
      content: "!",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " a",
    },
    {
      content: " sample",
    },
    {
      content: " of",
    },
    {
      content: " a",
    },
    {
      content: " nested",
    },
    {
      content: " list",
    },
    {
      content: " starting",
    },
    {
      content: " with",
    },
    {
      content: " an",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: " of",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: " items",
    },
    {
      content: ",",
    },
    {
      content: " each",
    },
    {
      content: " with",
    },
    {
      content: " an",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: " with",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: " items",
    },
    {
      content: ",",
    },
    {
      content: " and",
    },
    {
      content: " each",
    },
    {
      content: " with",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: " of",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: " item",
    },
    {
      content: ":\n\n",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "    ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "    ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "    ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "    ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "",
    },
  ],
};

const ol2__ol2_ul2 = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Certainly",
    },
    {
      content: "!",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " a",
    },
    {
      content: " sample",
    },
    {
      content: " of",
    },
    {
      content: " a",
    },
    {
      content: " nested",
    },
    {
      content: " list",
    },
    {
      content: " starting",
    },
    {
      content: " with",
    },
    {
      content: " an",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: " of",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: " items",
    },
    {
      content: ",",
    },
    {
      content: " each",
    },
    {
      content: " with",
    },
    {
      content: " an",
    },
    {
      content: " ordered",
    },
    {
      content: " list",
    },
    {
      content: " of",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: " items",
    },
    {
      content: ",",
    },
    {
      content: " and",
    },
    {
      content: " each",
    },
    {
      content: " with",
    },
    {
      content: " an",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: ":\n\n",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "list",
    },
    {
      content: " item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "",
    },
  ],
}; //clear!

const ol2_ol2_ol2 = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Here",
    },
    {
      content: " is",
    },
    {
      content: " a",
    },
    {
      content: " structured",
    },
    {
      content: " example",
    },
    {
      content: " of",
    },
    {
      content: " a",
    },
    {
      content: " nested",
    },
    {
      content: " list",
    },
    {
      content: " with",
    },
    {
      content: " two",
    },
    {
      content: " ordered",
    },
    {
      content: " lists",
    },
    {
      content: ",",
    },
    {
      content: " each",
    },
    {
      content: " with",
    },
    {
      content: " two",
    },
    {
      content: " ordered",
    },
    {
      content: " lists",
    },
    {
      content: ",",
    },
    {
      content: " and",
    },
    {
      content: " each",
    },
    {
      content: " of",
    },
    {
      content: " those",
    },
    {
      content: " with",
    },
    {
      content: " two",
    },
    {
      content: " more",
    },
    {
      content: " ordered",
    },
    {
      content: " lists",
    },
    {
      content: ":\n\n",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " I",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " II",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " I",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " II",
    },
    {
      content: "\n",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " I",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " II",
    },
    {
      content: "\n",
    },
    {
      content: "  ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " I",
    },
    {
      content: "\n",
    },
    {
      content: "     ",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: ".",
    },
    {
      content: " Sub",
    },
    {
      content: "sub",
    },
    {
      content: "item",
    },
    {
      content: " II",
    },
    {
      content: "\n\n",
    },
    {
      content: "This",
    },
    {
      content: " structure",
    },
    {
      content: " illustrates",
    },
    {
      content: " the",
    },
    {
      content: " nesting",
    },
    {
      content: " of",
    },
    {
      content: " ordered",
    },
    {
      content: " lists",
    },
    {
      content: " within",
    },
    {
      content: " ordered",
    },
    {
      content: " lists",
    },
    {
      content: ".",
    },
    {
      content: "",
    },
  ],
}; //clear!

const ul2_ul2 = {
  chunks: [
    {
      content: "",
    },
    {
      content: "Certainly",
    },
    {
      content: "!",
    },
    {
      content: " Here",
    },
    {
      content: " is",
    },
    {
      content: " an",
    },
    {
      content: " example",
    },
    {
      content: " of",
    },
    {
      content: " a",
    },
    {
      content: " nested",
    },
    {
      content: " list",
    },
    {
      content: " with",
    },
    {
      content: " an",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: " containing",
    },
    {
      content: " two",
    },
    {
      content: " list",
    },
    {
      content: " items",
    },
    {
      content: ",",
    },
    {
      content: " where",
    },
    {
      content: " each",
    },
    {
      content: " list",
    },
    {
      content: " item",
    },
    {
      content: " has",
    },
    {
      content: " an",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: " with",
    },
    {
      content: " two",
    },
    {
      content: " list",
    },
    {
      content: " items",
    },
    {
      content: ":\n\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "1",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " A",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " B",
    },
    {
      content: "\n",
    },
    {
      content: "-",
    },
    {
      content: " Item",
    },
    {
      content: " ",
    },
    {
      content: "2",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " C",
    },
    {
      content: "\n",
    },
    {
      content: " ",
    },
    {
      content: " -",
    },
    {
      content: " Sub",
    },
    {
      content: "item",
    },
    {
      content: " D",
    },
    {
      content: "\n\n",
    },
    {
      content: "In",
    },
    {
      content: " this",
    },
    {
      content: " structure",
    },
    {
      content: ",",
    },
    {
      content: " the",
    },
    {
      content: " main",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: " has",
    },
    {
      content: " two",
    },
    {
      content: " list",
    },
    {
      content: " items",
    },
    {
      content: ",",
    },
    {
      content: " and",
    },
    {
      content: " each",
    },
    {
      content: " list",
    },
    {
      content: " item",
    },
    {
      content: " has",
    },
    {
      content: " an",
    },
    {
      content: " unordered",
    },
    {
      content: " list",
    },
    {
      content: " with",
    },
    {
      content: " two",
    },
    {
      content: " sub",
    },
    {
      content: "-list",
    },
    {
      content: " items",
    },
    {
      content: ".",
    },
    {
      content: "",
    },
  ],
}; //clear
//Naive testing stuff
// let testResultObject = {
//   expectedHtmlOutputTestResult: "",
// };

async function simulateApiResponse() {
  const chatDivElement = document.getElementById("chatContainer");

  let paragraphChunks = extractContentFromChunks(nestedParagraphEmphasisChunk); //REPLACE TEST CHUNKS HERE
  let mainParser = new MainParser(document, chatDivElement);
  for (let chunk of paragraphChunks) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 10)); // Random delay between 0-1000 milliseconds
    mainParser.parseChunk(chunk);
  }
  let paragraphChunks1 = extractContentFromChunks(ol5); //REPLACE TEST CHUNKS HERE
  let mainParser1 = new MainParser(document, chatDivElement);
  for (let chunk of paragraphChunks1) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 10)); // Random delay between 0-1000 milliseconds
    mainParser1.parseChunk(chunk);
  }
}

// Example usage

document.addEventListener("DOMContentLoaded", (event) => {
  // Ensure the DOM is fully loaded
  document
    .getElementById("parseButton")
    .addEventListener("click", simulateApiResponse);
});
