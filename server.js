const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ dodotokanzi API is alive!");
});

app.get("/word-info", (req, res) => {
  const query = req.query.query || "없음";
  res.json({
    status: "✅ 정상 작동 확인됨",
    query,
    example: query.split("")
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
