let ratingChartInstance = null;
let tagChartInstance = null;

function renderRatingChart(userInfo) {
  const container = document.getElementById("rating-chart");
  if (!container) return;

  container.innerHTML = `
    <h2>User Profile</h2>
    <p><strong>Handle:</strong> ${userInfo.handle || "N/A"} | 
       <strong>Rank:</strong> ${userInfo.rank || "Unrated"} | 
       <strong>Rating:</strong> ${userInfo.rating || 0} | 
       <strong>Max Rating:</strong> ${userInfo.maxRating || 0}</p>
    <div style="height:250px; position:relative;">
      <canvas id="ratingCanvas"></canvas>
    </div>
  `;

  if (ratingChartInstance) ratingChartInstance.destroy();

  const ctx = document.getElementById("ratingCanvas").getContext("2d");
  ratingChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Current Rating", "Max Rating"],
      datasets: [
        {
          label: "Rating",
          data: [userInfo.rating || 0, userInfo.maxRating || 0],
          backgroundColor: ["#3b82f6", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function renderTagChart(weakTopicsData) {
  const container = document.getElementById("tag-chart");
  if (!container) return;

  container.innerHTML =
    '<h2>Top Weak Topics</h2><div style="height:300px; position:relative;"><canvas id="tagCanvas"></canvas></div>';

  if (!weakTopicsData || typeof weakTopicsData !== "object") return;

  const entries = Object.entries(weakTopicsData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  if (entries.length === 0) return;

  const tags = [];
  const scores = [];
  for (let i = 0; i < entries.length; i++) {
    tags.push(entries[i][0]);
    scores.push(entries[i][1]);
  }

  if (tagChartInstance) tagChartInstance.destroy();

  const ctx = document.getElementById("tagCanvas").getContext("2d");
  tagChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: tags,
      datasets: [
        {
          label: "Weakness Score",
          data: scores,
          backgroundColor: "#f97316",
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { beginAtZero: true, max: 1 } },
    },
  });
}
