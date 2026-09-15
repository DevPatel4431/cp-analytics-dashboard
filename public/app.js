const API_BASE =
  window.location.port && window.location.port !== "3000"
    ? "http://localhost:3000"
    : "";

function renderRecommendations(recommendations) {
  const container = document.getElementById("recommendations");
  if (!container) return;

  container.innerHTML = "<h2>Recommended Problems</h2>";
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    container.innerHTML += "<p>No recommendations available.</p>";
    return;
  }

  const ul = document.createElement("ul");
  for (let i = 0; i < recommendations.length; i++) {
    const p = recommendations[i];
    const li = document.createElement("li");
    const url = `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`;
    const tags = Array.isArray(p.tags) ? p.tags.join(", ") : "";
    li.innerHTML = `<a href="${url}" target="_blank"><strong>${p.contestId}${p.index} - ${p.name}</strong></a> (Rating: ${p.rating || "N/A"}) - <em>${tags}</em>`;
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

async function loadHandle(handle) {
  const h = (handle || "").trim();
  if (!h) return alert("Enter a Codeforces handle");

  const ratingSec = document.getElementById("rating-chart");
  const tagSec = document.getElementById("tag-chart");
  const recSec = document.getElementById("recommendations");

  if (ratingSec) ratingSec.innerHTML = "<p>Loading...</p>";
  if (tagSec) tagSec.innerHTML = "<p>Loading...</p>";
  if (recSec) recSec.innerHTML = "<p>Loading...</p>";

  try {
    const [userRes, weakRes, recRes] = await Promise.all([
      fetch(`/api/user/${encodeURIComponent(h)}`),
      fetch(`/api/user/${encodeURIComponent(h)}/weak-topics`),
      fetch(`/api/user/${encodeURIComponent(h)}/recommendations`),
      fetch(`${API_BASE}/api/user/${encodeURIComponent(h)}`),
      fetch(`${API_BASE}/api/user/${encodeURIComponent(h)}/weak-topics`),
      fetch(`${API_BASE}/api/user/${encodeURIComponent(h)}/recommendations`),
    ]);

    if (!userRes.ok) {
      let errMsg = "User not found or CF API error";
      try {
        const errJson = await userRes.json();
        if (errJson && errJson.error) errMsg = errJson.error;
      } catch (e) {}
      throw new Error(errMsg);
    }

    const userInfo = await userRes.json();
    const weakTopics = await weakRes.json();
    const recommendations = await recRes.json();

    renderRatingChart(userInfo);
    renderTagChart(weakTopics);
    renderRecommendations(recommendations);
  } catch (err) {
    if (ratingSec)
      ratingSec.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    if (tagSec) tagSec.innerHTML = "";
    if (recSec) recSec.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("search-btn");
  const input = document.getElementById("handle-input");

  if (btn && input) {
    btn.addEventListener("click", () => loadHandle(input.value));
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") loadHandle(input.value);
    });
  }
});
