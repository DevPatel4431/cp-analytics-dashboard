const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const { getUserInfo, getUserSubmissions, getProblemset } = require("./cfApi");
const { scoreWeakTopics, recommend } = require("./analyze");

const app = express();
const PORT = process.env.PORT || 3000;
const PROBLEMSET_FILE = path.join(__dirname, "problemset.json");

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

async function loadProblemset() {
  try {
    const data = await fs.readFile(PROBLEMSET_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (
      Array.isArray(parsed)
        ? parsed.length > 0
        : parsed.problems && parsed.problems.length > 0
    ) {
      return parsed;
    }
  } catch (e) {}

  const fresh = await getProblemset();
  await fs.writeFile(PROBLEMSET_FILE, JSON.stringify(fresh, null, 2));
  return fresh;
}

app.get("/api/user/:handle", async (req, res) => {
  try {
    const info = await getUserInfo(req.params.handle);
    const user = Array.isArray(info) ? info[0] : info;
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/:handle/weak-topics", async (req, res) => {
  try {
    const subs = await getUserSubmissions(req.params.handle);
    res.json(scoreWeakTopics(subs));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/:handle/recommendations", async (req, res) => {
  try {
    const subs = await getUserSubmissions(req.params.handle);
    const weakTopics = scoreWeakTopics(subs);
    const problemset = await loadProblemset();
    res.json(recommend(weakTopics, problemset));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
