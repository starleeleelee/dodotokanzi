const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

function extractKanji(str) {
  return Array.from(str).filter((char) => char.match(/[\u4e00-\u9faf]/));
}

app.get("/", (req, res) => {
  res.send("✅ dodotokanzi API is alive!");
});

app.get("/word-info", async (req, res) => {
  const query = req.query.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Missing or invalid query" });
  }

  try {
    const kanjiList = extractKanji(query);

    const kanjiResults = await Promise.all(
      kanjiList.map(async (char) => {
        try {
          const { data } = await axios.get(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(char)}`);
          return {
            char,
            meaning: data.meanings?.[0] || "N/A",
            kunyomi: data.kun_readings || [],
            onyomi: data.on_readings || [],
            radicals: data.radical ? [data.radical] : [],
            stroke_count: data.stroke_count || null,
          };
        } catch (err) {
          return { char, error: "Not found in KanjiAPI" };
        }
      })
    );

    let origin = "";
    try {
      const jishoRes = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}`);
      const data = jishoRes.data.data?.[0];
      if (data) {
        origin = data.japanese[0].word || data.japanese[0].reading;
      } else {
        origin = "(유래 정보 없음)";
      }
    } catch (e) {
      origin = "(유래 정보 없음)";
    }

    // ✅ 성공 응답 보내기
    res.json({
      query,
      kanji: kanjiResults,
      origin,
      display: {
        word: query,
        kanjiNames: kanjiResults.map((k) => `${k.char}(${k.meaning})`).join(", "),
      },
    });

  } catch (e) {
    // ✅ 오류 발생 시에도 반드시 응답 보내기
    console.error("서버 처리 중 오류:", e.message);
    res.status(500).json({ error: "서버 내부 오류 발생", message: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
