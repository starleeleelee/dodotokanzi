const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/word-info", async (req, res) => {
  const query = req.query.query || "自撮り";
  res.json({
    query,
    kanji: [
      { char: "自", meaning: "스스로 자", radicals: ["目", "丿"], components: "目 + 丿" },
      { char: "撮", meaning: "찍을 촬", radicals: ["扌", "最"], components: "扌 + 最" }
    ],
    origin: "自(스스로) + 撮る(찍다) → 스스로 찍는다는 뜻에서 유래된 말이야.",
    display: {
      word: query,
      kanjiNames: "自(스스로 자), 撮(찍을 촬)"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
