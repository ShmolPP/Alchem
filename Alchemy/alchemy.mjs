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
  const words = text.split(/\s+/);
  const capitals = words
    .filter(word => /^[A-Z]/.test(word))
    .map(word => word[0]);
  return capitals.join('');
};

const CODEX = {
  1: 'F',
  2: 'I',
  5: 'G',
  8: 'S',
  9: 'P',
  10: 'H',
  12: 'L',
  17: 'T',
  20: 'O',
  23: 'R',
  24: 'A',
  29: 'B',
  34: 'N',
  38: 'C',
  45: 'U',
  46: 'X',
  48: 'V',
  108: 'Y',
  127: 'M',
  131: 'D',
  270: 'W'
};

const ALCHEMICAL_SYMBOLS = {
  "water": "🜄",
  "mercury": "☿",
  "cober": "♀",
  "sulfur": "🜍",
  "heat": "🜂",
  "salt": "🜔",
  "gold": "☉",
  "air": "🜁"
};

const decodeNumberCipher = (numberString) => {
  const numbers = numberString.split(/\s+/).map(Number);
  let result = '';
  for (let num of numbers) {
    if (CODEX[num]) {
      result += CODEX[num];
    } else {
      result += ' ';
    }
  }

  const start = result.indexOf("COMBINE") + 8; 
  const end = result.indexOf(";");
  const recipeText = result.slice(start, end).toLowerCase(); 

  const ingredientOrder = [
    "water",    // 🜄 
    "mercury",  // ☿
    "cober",    // ♀
    "sulfur",   // 🜍
    "heat",     // 🜂
    "salt",     // 🜔
    "water",    // 🜄 
    "gold",     // ☉
    "air"       // 🜁
  ];

  const ingredients = [];
  for (let ingredient of ingredientOrder) {
    if (recipeText.includes(ingredient)) {
      ingredients.push(ingredient);
    }
  }

  return ingredients.map(ing => ALCHEMICAL_SYMBOLS[ing] || '').join(' ');
};

const getAnswerForChallenge = (question) => {
  if (question.includes("☉☿☽♂☉")) {
    return decodeAlchemyCode("☉☿☽♂☉");
  }
  if (question.toLowerCase().includes("lethe")) {
    return "Silver";
  }
  if (question.toLowerCase().includes("paracelsus")) {
    const numberMatch = question.match(/(\d+\s+)+[\d\s,;]+/);
    if (numberMatch) {
      return decodeNumberCipher(numberMatch[0].trim());
    }
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
  extractCapitals("Still flows the Icy Lethe, Veiling all ’neath Eldritch Rime"),
  "SILVER",
  "Extracted capitals should be 'SILVER'"
);
tests.isEqual(
  decodeNumberCipher("17 20 20 29 17 24 4 34 24 38 20 29 9 23 24 34 131 8 45 12 17 , 4 34 9 45 17 10 1 2 20 23 38 45 12 24 2 20 23 17 10 1 17 10 1 2 20 45 23 17 10 1 12 1 38 1 34 17 ; 38 20 29 9 23 24 34 131 8 45 12 2 45 23 20 48 1 23 10 1 24 17 , 24 131 131 8 24 12 17 24 34 131 270 24 17 1 23 , 4 34 2 45 8 1 5 20 12 131 17 10 23 20 45 5 10 24 4 23"),
  "🜄 ☿ ♀ 🜍 🜂 🜔 🜄 ☉ 🜁",
  "Number sequence with 'Paracelsus' decodes to recipe symbols"
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