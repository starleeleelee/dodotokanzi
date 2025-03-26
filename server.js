const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ dodotokanzi API is alive!");
});

app.get("/word-info", (req, res) => {
  const query = req.query.query || "알 수 없음";

  console.log("👉 /word-info 요청 수신됨");
  console.log("📦 query:", query);

  res.json({
    status: "✅ 정상 작동 확인됨",
    query,
    queryLength: query.length,
    chars: query.split(""),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Basic test server running on port ${PORT}`);
});
