import { assert } from "chai";
import {
  executeToolAction,
  inferAssistantReadOnlyToolAction,
  looksLikeAssistantToolIntent,
  parseAssistantToolActions,
  parseAssistantToolAction,
  registerToolActionHandler,
  stripAssistantToolActionMarkup,
} from "../src/modules/agent/toolAction";
import {
  buildWebSearchContext,
  buildWebSearchQuery,
  normalizeWebSearchProvider,
  webSearchTestUtils,
} from "../src/modules/tools/webSearch";

registerToolActionHandler({
  type: "web-search",
  readOnly: true,
  aliases: [
    "联网搜索",
    "搜索",
    "web_search",
    "web search",
    "search_web",
    "search web",
    "search",
  ],
  extractQuery(actionInput, rawRecord) {
    const q =
      (typeof actionInput.query === "string" ? actionInput.query : "") ||
      (typeof actionInput.q === "string" ? actionInput.q : "") ||
      (typeof rawRecord.query === "string" ? rawRecord.query : "");
    return q.replace(/\s+/g, " ").trim();
  },
  isAvailable() {
    return true;
  },
  async execute() {
    return "";
  },
});

registerToolActionHandler({
  type: "disabled-test-tool",
  readOnly: true,
  aliases: ["disabled_test_tool"],
  extractQuery() {
    return "test";
  },
  isAvailable() {
    return false;
  },
  async execute() {
    return "should not run";
  },
});

registerToolActionHandler({
  type: "read-pdf",
  readOnly: true,
  aliases: ["read_pdf", "read pdf", "read-pdf"],
  extractQuery(actionInput) {
    return typeof actionInput.query === "string"
      ? actionInput.query.trim() || "__full__"
      : "__full__";
  },
  isAvailable() {
    return true;
  },
  async execute() {
    return "";
  },
});

registerToolActionHandler({
  type: "list-annotations",
  readOnly: true,
  aliases: ["list_annotations", "list annotations", "list-annotations"],
  extractQuery() {
    return "__all__";
  },
  isAvailable() {
    return true;
  },
  async execute() {
    return "";
  },
});

registerToolActionHandler({
  type: "propose-annotation",
  readOnly: false,
  aliases: ["propose_annotation"],
  extractQuery(actionInput) {
    return typeof actionInput.text === "string"
      ? actionInput.text.trim()
      : "propose-annotation";
  },
  isAvailable() {
    return true;
  },
  async execute() {
    return "";
  },
});

describe("web search logic", function () {
  it("should build a bounded query with item hints", function () {
    const query = buildWebSearchQuery("find recent discussion", {
      title: "A Very Specific Research Paper",
      doi: "10.1234/example",
      year: "2026",
    });

    assert.include(query, "find recent discussion");
    assert.include(query, "A Very Specific Research Paper");
    assert.include(query, "10.1234/example");
    assert.isAtMost(query.length, 240);
  });

  it("should parse DuckDuckGo abstract and nested topics", function () {
    const results = webSearchTestUtils.parseDuckDuckGoResults(
      JSON.stringify({
        Heading: "Zotero",
        AbstractText: "Reference manager.",
        AbstractURL: "https://www.zotero.org/",
        AbstractSource: "Wikipedia",
        RelatedTopics: [
          {
            Topics: [
              {
                FirstURL: "https://example.com/plugin",
                Text: "Plugin - A useful extension.",
              },
            ],
          },
        ],
      }),
      5,
    );

    assert.lengthOf(results, 2);
    assert.deepInclude(results[0], {
      title: "Zotero",
      url: "https://www.zotero.org/",
      snippet: "Reference manager.",
      source: "Wikipedia",
    });
    assert.deepInclude(results[1], {
      title: "Plugin",
      url: "https://example.com/plugin",
      snippet: "A useful extension.",
    });
  });

  it("should parse DuckDuckGo HTML search fallback results", function () {
    const results = webSearchTestUtils.parseDuckDuckGoHTMLResults(
      `
      <html><body>
        <div class="result results_links">
          <h2 class="result__title">
            <a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fpaper&amp;rut=abc">
              Example Paper
            </a>
          </h2>
          <a class="result__snippet">A <b>useful</b> search result.</a>
          <a class="result__url">example.com/paper</a>
        </div>
      </body></html>
      `,
      5,
    );

    assert.deepEqual(results, [
      {
        title: "Example Paper",
        url: "https://example.com/paper",
        snippet: "A useful search result.",
        source: "example.com/paper",
      },
    ]);
  });

  it("should parse SearXNG JSON results", function () {
    const results = webSearchTestUtils.parseSearXNGResults(
      JSON.stringify({
        results: [
          {
            title: "Result title",
            url: "https://example.com/result",
            content: "Result <b>snippet</b>.",
            engine: "example",
            publishedDate: "2026-05-05",
          },
        ],
      }),
      5,
    );

    assert.deepEqual(results, [
      {
        title: "Result title",
        url: "https://example.com/result",
        snippet: "Result snippet.",
        source: "example",
        publishedAt: "2026-05-05",
      },
    ]);
  });

  it("should format web search context with citation instructions", function () {
    const context = buildWebSearchContext({
      provider: "duckduckgo",
      query: "zotero cat",
      results: [
        {
          title: "Project",
          url: "https://example.com/project",
          snippet: "Project snippet.",
        },
      ],
    });

    assert.include(context, "Web search results");
    assert.include(context, "Cite URLs");
    assert.include(context, "https://example.com/project");
  });

  it("should normalize unsupported search providers to the default", function () {
    assert.equal(normalizeWebSearchProvider("searxng"), "searxng");
    assert.equal(normalizeWebSearchProvider("unknown"), "duckduckgo");
  });

  it("should return rawInput alongside parsed action", function () {
    const action = parseAssistantToolAction(
      '{"action":"search","action_input":{"query":"test query"}}',
    );
    assert.isNotNull(action);
    assert.equal(action!.type, "web-search");
    assert.equal(action!.query, "test query");
    assert.deepEqual(action!.rawInput, { query: "test query" });
  });

  it("should return null for unregistered tool action names", function () {
    const action = parseAssistantToolAction(
      '{"action":"unknown_tool","action_input":{"query":"test"}}',
    );
    assert.isNull(action);
  });

  it("should parse model-emitted web search action JSON", function () {
    const action = parseAssistantToolAction(`
我将搜索最新研究。

\`\`\`json
{
  "action": "联网搜索",
  "action_input": {
    "query": "soil moisture prediction transformer LSTM 2025 2026"
  }
}
\`\`\`
`);

    assert.deepEqual(action, {
      type: "web-search",
      query: "soil moisture prediction transformer LSTM 2025 2026",
      rawInput: {
        query: "soil moisture prediction transformer LSTM 2025 2026",
      },
      readOnly: true,
    });
  });

  it("should parse model-emitted tagged tool calls", function () {
    const content = `我来帮你读取这篇文章，找出重点内容并进行高亮标注。<tool_call>
<function=read_pdf>
</invoke>
<tool_name>read_pdf</tool_name>
</function>
</tool_call>`;
    const action = parseAssistantToolAction(content);
    assert.deepEqual(action, {
      type: "read-pdf",
      query: "__full__",
      rawInput: {},
      readOnly: true,
    });
    assert.equal(
      stripAssistantToolActionMarkup(content),
      "我来帮你读取这篇文章，找出重点内容并进行高亮标注。",
    );
  });

  it("should detect tool intent when the model omits an executable action", function () {
    assert.isTrue(
      looksLikeAssistantToolIntent(
        "我将继续阅读全文，并为你标注剩余部分的核心重点。现在开始读取第4页及以后的内容。",
      ),
    );
    assert.isFalse(looksLikeAssistantToolIntent("这篇文章的核心观点如下。"));
  });

  it("should infer safe read-only PDF actions from omitted tool calls", function () {
    const action = inferAssistantReadOnlyToolAction(
      "我将继续阅读全文，并为你标注剩余部分的核心重点。现在开始读取第4页及以后的内容。",
    );
    assert.deepEqual(action, {
      type: "read-pdf",
      query:
        "我将继续阅读全文，并为你标注剩余部分的核心重点。现在开始读取第4页及以后的内容。",
      rawInput: {
        query:
          "我将继续阅读全文，并为你标注剩余部分的核心重点。现在开始读取第4页及以后的内容。",
      },
      readOnly: true,
    });
  });

  it("should infer annotation listing before write plans", function () {
    const action = inferAssistantReadOnlyToolAction(
      "好的，我已经读取了第4页的内容。让我先查看已有的标注，然后继续为剩余部分添加重点标注。",
    );
    assert.deepEqual(action, {
      type: "list-annotations",
      query: "__all__",
      rawInput: {},
      readOnly: true,
    });
  });

  it("should report parsed but unavailable tools explicitly", async function () {
    const result = await executeToolAction(
      {
        type: "disabled-test-tool",
        query: "test",
        rawInput: {},
        readOnly: true,
      },
      { requestToken: 1 },
    );
    assert.match(result, /^ERROR:/);
    assert.include(result, "disabled-test-tool");
  });

  it("should keep repeated tool actions when raw inputs differ", function () {
    const actions = parseAssistantToolActions(`
[
  {"action":"propose_annotation","action_input":{"text":"shared phrase","page":1,"color":"#ffd400"}},
  {"action":"propose_annotation","action_input":{"text":"shared phrase","page":2,"color":"#ff6666"}}
]
`);
    assert.lengthOf(actions, 2);
    assert.deepEqual(
      actions.map((action) => action.rawInput),
      [
        { text: "shared phrase", page: 1, color: "#ffd400" },
        { text: "shared phrase", page: 2, color: "#ff6666" },
      ],
    );
  });
});
