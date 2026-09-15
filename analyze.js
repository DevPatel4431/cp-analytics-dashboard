// Weakness Score Formula:
// weakness_score = (1 - solve_rate) * 0.7 + wa_tle_ratio * 0.3
// - solve_rate = solved / total attempts
// - wa_tle_ratio = (WA + TLE count) / total attempts
function scoreWeakTopics(submissions) {
  if (!Array.isArray(submissions)) return {};

  const stats = {};

  for (let i = 0; i < submissions.length; i++) {
    const sub = submissions[i];
    if (!sub || !sub.problem || !Array.isArray(sub.problem.tags)) continue;

    const v = sub.verdict;
    const isOk = v === "OK";
    const isWaOrTle = v === "WRONG_ANSWER" || v === "TIME_LIMIT_EXCEEDED";

    for (let j = 0; j < sub.problem.tags.length; j++) {
      const tag = sub.problem.tags[j];
      if (!stats[tag]) {
        stats[tag] = { total: 0, solved: 0, waTle: 0 };
      }
      stats[tag].total++;
      if (isOk) stats[tag].solved++;
      if (isWaOrTle) stats[tag].waTle++;
    }
  }

  const tagList = [];
  const keys = Object.keys(stats);
  for (let i = 0; i < keys.length; i++) {
    const tag = keys[i];
    const s = stats[tag];
    const solveRate = s.total > 0 ? s.solved / s.total : 0;
    const waTleRatio = s.total > 0 ? s.waTle / s.total : 0;
    const score = (1 - solveRate) * 0.7 + waTleRatio * 0.3;
    tagList.push({ tag, score });
  }

  tagList.sort((a, b) => b.score - a.score);

  const result = {};
  for (let i = 0; i < tagList.length; i++) {
    result[tagList[i].tag] = tagList[i].score;
  }
  return result;
}

function recommend(weakTopics, problemset, limit = 10) {
  if (!weakTopics || typeof weakTopics !== "object") return [];

  const problems = Array.isArray(problemset)
    ? problemset
    : problemset && Array.isArray(problemset.problems)
      ? problemset.problems
      : [];

  if (problems.length === 0) return [];

  const topTags = Object.keys(weakTopics).slice(0, 5);
  if (topTags.length === 0) return [];

  const topTagSet = new Set(topTags);
  const recs = [];

  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];
    if (!p || !Array.isArray(p.tags)) continue;

    let recScore = 0;
    for (let j = 0; j < p.tags.length; j++) {
      const tag = p.tags[j];
      if (topTagSet.has(tag)) {
        recScore += weakTopics[tag] || 0;
      }
    }

    if (recScore > 0) {
      recs.push({ ...p, recommendationScore: recScore });
    }
  }

  recs.sort((a, b) => b.recommendationScore - a.recommendationScore);
  return recs.slice(0, limit);
}

module.exports = {
  scoreWeakTopics,
  recommend,
};
