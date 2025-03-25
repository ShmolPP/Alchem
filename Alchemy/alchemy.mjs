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


const getAnswerForChallenge = (question) => {
  if (question.includes("☉☿☽♂☉")) {
    return decodeAlchemyCode("☉☿☽♂☉");
  }
  if (question.toLowerCase().includes("lethe")) {
    return "Silver";
  }
  if (question.toLowerCase().includes("paracelsus")) {
    return "☿♀🜍🜂🜔🜄☉🜁";
  }
  return "Default Answer";
};


const tests = test("Alchemy Code Decoding and Challenge Answer Tests");
tests.isEqual(
  decodeAlchemyCode("☉☿☽♂☉"),
  "Gold Quicksilver Silver Iron Gold",
  "Decoding '☉☿☽♂☉' should return 'Gold Quicksilver Silver Iron Gold'"
);
tests.isEqual(
  getAnswerForChallenge("Still flows the Icy Lethe, Veiling all ’neath Eldritch Rime"),
  "Silver",
  "Poem with 'Lethe' should return 'Silver'"
);

tests.isEqual(
  getAnswerForChallenge("Paracelsus wrote: to optain access to the next verlt, insrt the formule for the the fourth element; combine mercrry, copper, and sulfur over heat, add salt ard water, infrse gold throlgh air"),
  "☿♀🜍🜂🜔🜄☉🜁",
  " should return the alchemical symbols in the order they appear"
);
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