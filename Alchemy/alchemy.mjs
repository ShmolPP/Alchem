import fetch from 'node-fetch';
import test from './test.mjs'; 

const API = "https://alchemy-kd0l.onrender.com";
const PLAYER_NAME = "solat@uia.no";

const decodeAlchemyCode = (code) => {
  const symbolMap = {
    "☉": "Gold",
    "☿": "Quicksilver",
    "☽": "Silver",
    "♂": "Iron"
  };
  return code
    .split('')
    .map(symbol => symbolMap[symbol] || symbol)
    .join(' ');
};

const extractCapitals = (text) => {
  return text
    .split(/\s+/)
    .filter(word => /^[A-Z]/.test(word))
    .map(word => word[0])
    .join('');
};

const tests = test("Alchemy Code Decoding and Challenge Answer Tests");
tests.isEqual(
  decodeAlchemyCode("☉☿☽♂☉"),
  "Gold Quicksilver Silver Iron Gold",
  "Decoding '☉☿☽♂☉' should return 'Gold Quicksilver Silver Iron Gold'"
);
tests.isEqual(
  extractCapitals("Still flows the Icy Lethe, Veiling all ’neath Eldritch Rime"),
  "SILVER",
  "Extracted capitals should be 'SILVER'"
);

const getAnswerForChallenge = (question) => {

  if (question.includes("☉☿☽♂☉")) {
    return decodeAlchemyCode("☉☿☽♂☉"); 
  }
  if (question.toLowerCase().includes("mercury") && !question.includes("☉☿☽♂☉")) {
    return "Mercury is a modern name, it was not used at the time of these scientists and philoopers time.";
  }
  if (question.toLowerCase().includes("lethe")) {
    const capitals = extractCapitals(question);
    if (capitals === "SILVER") {
      return "Silver";
    }
  }
  return "Default Answer";
};

const startGame = async () => {
  try {
    const response = await fetch(`${API}/start?player=${PLAYER_NAME}`);
    const data = await response.json();
    console.log("Game started. Challenge:", data);
    return data;
  } catch (err) {
    console.error("Error starting game:", err);
    throw err;
  }
};

const submitAnswer = async (answer) => {
  try {
    const response = await fetch(`${API}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: PLAYER_NAME, answer }),
    });
    const data = await response.json();
    console.log("Answer submitted. Response:", data);
    return data;
  } catch (err) {
    console.error("Error submitting answer:", err);
    throw err;
  }
};

const main = async () => {
  try {
    const challenge = await startGame();
    if (challenge && challenge.challenge) {
      console.log("Challenge received:", challenge.challenge);
      const answer = getAnswerForChallenge(challenge.challenge);
      console.log("Submitting answer:", answer);
      const nextChallenge = await submitAnswer(answer);
      console.log("Next challenge received:", nextChallenge);
    } else {
      console.log("No challenge question received.");
    }
  } catch (error) {
    console.error("An error occurred in main:", error);
  }
};

main();
