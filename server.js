const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ dodotokanzi API is alive!");
});

app.get("/word-info", (req, res) => {
  const query = req.query.query || "알 수 없음";
  res.json({
    message: "✅ 외부 요청 없이 작동 확인됨",
    query,
    testKanji: ["自", "撮"]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Basic test server running on port ${PORT}`);
});
