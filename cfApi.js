const axios = require("axios");

const BASE_URL = "https://codeforces.com/api";

async function fetchFromCF(endpoint, params = {}) {
  try {
    const res = await axios.get(`${BASE_URL}/${endpoint}`, { params });
    if (res.data && res.data.status === "FAILED") {
      throw new Error(res.data.comment || "Codeforces API error");
    }
    return res.data.result;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.comment) {
      throw new Error(err.response.data.comment);
    }
    throw err;
  }
}

async function getUserInfo(handle) {
  return fetchFromCF("user.info", { handles: handle });
}

async function getUserSubmissions(handle) {
  return fetchFromCF("user.status", { handle });
}

async function getProblemset() {
  return fetchFromCF("problemset.problems");
}

module.exports = {
  getUserInfo,
  getUserSubmissions,
  getProblemset,
};
