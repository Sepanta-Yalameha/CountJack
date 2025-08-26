const suits = ["H", "D", "C", "S"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export const buildDeck = (numDeks = 1) => {
  let deck = [];
  for (let i = 1; i < numDeks + 1; i++) {
    for (const suit of suits) {
      for (const value of values) {
        const card = {
          name: `${value}-${suit}`,
          value,
          id: `${value}${suit}${i}`,
        };
        deck.push(card);
      }
    }
  }
  return deck;
};

export const shuffleDeck = (deck) => {
  const d = [...deck];
  for (let i = 0; i < d.length; i++) {
    const j = Math.floor(Math.random() * d.length);
    let temp = d[i];
    d[i] = d[j];
    d[j] = temp;
  }
  return d;
};

export const sum = (cards) => {
  return cards.reduce((acc, card) => {
    const v = card.value;
    if (v === "A") {
      return acc + 11; // Ace is worth 11 points
    } else if (v === "K" || v === "Q" || v === "J" || v === "10") {
      return acc + 10; // Face cards are worth 10 points
    } else {
      return acc + parseInt(card.value);
    }
  }, 0);
};

export const totalAndHandleAce = (cards) => {
  const numAces = cards.filter((card) => card.value === "A").length;
  let total = sum(cards);
  // Adjust for Aces if total is over 21
  if (total > 21) {
    if (numAces) {
      for (let i = 0; i < numAces; i++) {
        total -= 10; // Count Ace as 1 instead of 11
      }
    }
  }
  return total;
};

export const checkCountValue = (card) => {
  const v = card.value;
  if (v === "A" || v === "K" || v === "Q" || v === "J" || v === "10") {
    return -1;
  } else if (Number(v) >= 2 && Number(v) <= 6) {
    return 1;
  } else {
    return 0;
  }
};

export function calculateInitialCount(playerHands, dealerHand) {
  let playerCountTotal = 0;
  playerHands.forEach((hand) => {
    playerCountTotal += hand.cards.reduce((acc, card) => {
      acc += checkCountValue(card);
      return acc;
    }, 0);
  });

  const dealerCountTotal = checkCountValue(dealerHand[0]);

  return [playerCountTotal, dealerCountTotal];
}

export function calcTrueCount(playingCount, deck) {
  const remainingDeckCount = Math.ceil(deck.length / 52);
  return Math.round((playingCount / remainingDeckCount) * 10) / 10;
}
