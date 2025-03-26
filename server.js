const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// 입력된 문자열에서 한자만 뽑아내는 함수
function extractKanji(str) {
  return Array.from(str).filter((char) => char.match(/[\u4e00-\u9faf]/));
}

// 루트 라우터: 서버 살아 있는지 확인용
app.get("/", (req, res) => {
  res.send("✅ dodotokanzi API is alive!");
});

// 핵심 API: 단어 분석
app.get("/word-info", async (req, res) => {
  // ✅ 자동 인코딩 처리
  const raw = req.query.query || '';
  const query = decodeURIComponent(raw);
  if (!query.trim()) {
    return res.status(400).json({ error: "Missing or invalid query" });
  }

  // 한자 리스트 뽑기
  const kanjiList = extractKanji(query);

  // 각 한자에 대해 KanjiAPI 호출
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

  // 단어 유래 (Jisho.org에서 수집)
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

  // 최종 응답 구조
  res.json({
    query,
    kanji: kanjiResults,
    origin,
    display: {
      word: query,
      kanjiNames: kanjiResults.map((k) => `${k.char}(${k.meaning})`).join(", "),
    },
  });
});

// ✅ Render용 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
