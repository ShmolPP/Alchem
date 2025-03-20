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
  return code .split('')
    .map(symbol => symbolMap[symbol] || symbol)
    .join(' ');
};

const tests = test("Alchemy Code Decoding Tests");
tests.isEqual(decodeAlchemyCode("☉☿☽♂☉"), "Gold Quicksilver Silver Iron Gold", "Decoding '☉☿☽♂☉' should return 'Gold Quicksilver Silver Iron Gold'");

const getAnswerForChallenge = (question) => {
  if (question.includes("☉☿☽♂☉")) {
    return decodeAlchemyCode("☉☿☽♂☉");
  }
  if (question.toLowerCase().includes("mercury") && !question.includes("☉☿☽♂☉")) {
    return "Mercury is a modern name, it was not used at the time of these scientists and philoopers time.";
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
    let challenge = await startGame();
    while (challenge && challenge.challenge) {
      console.log("Challenge received:", challenge.challenge);
      const answer = getAnswerForChallenge(challenge.challenge);
      const nextChallenge = await submitAnswer(answer);
      console.log("Next challenge received:", nextChallenge);
      challenge = nextChallenge;
    }
    console.log("No more challenges received.");
  } catch (error) {
    console.error("An error occurred", error);
  }
};

main();