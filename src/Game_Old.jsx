import React, { useState, useEffect } from "react";
import "./Game.css";
import PlayerHand from "./PlayerHand";
import DealerHand from "./DealerHand";
import GameSetup from "./GameSetup";
import CountDisplay from "./CountDisplay";
import GameStatus from "./GameStatus";
import { useGameLogic } from "./useGameLogic";

export default function Game() {
  // Game configuration states
  const [numDecks, setNumDecks] = useState(3);
  const [numHands, setNumHands] = useState(1);
  const [difficulty, setDifficulty] = useState("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [userCountGuess, setUserCountGuess] = useState("");

  // Use the game logic hook
  const {
    dealerHand,
    playerHands,
    count,
    gameOver,
    reshuffling,
    reshuffleCountdown,
    restartCountdown,
    difficultySettings,
    startNewGame,
    handleHit,
    handleStand,
  } = useGameLogic(numDecks, numHands, difficulty);

  const handCount = playerHands.length;

  let cardSize = "md:w-32 md:h-48 w-24 h-36";
  let handPadding = "p-8";
  if (handCount === 1) {
    cardSize = "md:w-48 md:h-72 w-32 h-48";
    handPadding = "p-10";
  } else if (handCount === 2) {
    cardSize = "md:w-36 md:h-56 w-28 h-40";
    handPadding = "p-8";
  } else if (handCount === 3) {
    cardSize = "md:w-28 md:h-44 w-24 h-36";
    handPadding = "p-6";
  } else if (handCount === 4) {
    cardSize = "md:w-24 md:h-36 w-20 h-32";
    handPadding = "p-4";
  } else if (handCount >= 5) {
    cardSize = "md:w-20 md:h-32 w-16 h-24";
    handPadding = "p-2";
  }

  // Initialize game when started
  useEffect(() => {
    if (gameStarted) {
      startNewGame();
    }
  }, [numDecks, numHands, gameStarted]);

  // Handle count guess submission
  const handleCountGuess = () => {
    if (userCountGuess === "") return;
    setShowCount(true);
  };

  // Toggle count visibility
  const toggleCountVisibility = () => {
    setShowCount(!showCount);
  };

  // Start the game with selected configuration
  const handleStartGame = () => {
    setGameStarted(true);
  };

  // Check if we need to reshuffle
  if (checkForReshuffle(workingDeck) && originalDeckSize > 0) {
    handleReshuffle();
    return;
  }

  // Check if we have enough cards (minimum 10 cards needed for a round)
  if (workingDeck.length < 10) {
    handleReshuffle();
    return;
  }

  const newPlayerHands = Array.from({ length: numHands }, () => ({
    cards: [],
    status: "playing",
  }));

  for (let i = 0; i < numHands; i++) {
    newPlayerHands[i].cards = [workingDeck.pop(), workingDeck.pop()];
    const total = totalAndHandleAce(newPlayerHands[i].cards);
    if (total === 21) {
      newPlayerHands[i].status = "blackjack";
    }
  }

  const newDealerHand = [];
  const firstCard = { ...workingDeck.pop(), hidden: false };
  const secondCard = { ...workingDeck.pop(), hidden: true };
  newDealerHand.push(firstCard, secondCard);

  const [playerCount, dealerCount] = calculateInitialCount(
    newPlayerHands,
    newDealerHand
  );
  const newTotalCount = currentCount.count + playerCount + dealerCount;
  const newTrueCount = calcTrueCount(newTotalCount, workingDeck);

  setCount({ count: newTotalCount, trueCount: newTrueCount });
  setDealerHand(newDealerHand);
  setPlayerHands(newPlayerHands);
  setDeck(workingDeck);
  setGameStarted(true);
  setShowCount(false);
  setUserCountGuess("");
  setGameOver(false);
  setRestartCountdown(0);
}

// Initialize game on component mount
useEffect(() => {
  if (gameStarted) {
    startNewGame();
  }
}, [numDecks, numHands]);

useEffect(() => {
  const allDone = playerHands.every((hand) => hand.status !== "playing");
  const allBust = playerHands.every((hand) => hand.status === "bust");

  if (allDone && gameStarted) {
    if (allBust) {
      // All players bust - dealer wins without playing
      const newPlayerHands = playerHands.map((hand) => ({
        ...hand,
        status: "lost",
      }));
      setPlayerHands(newPlayerHands);
      setGameOver(true);

      // Start countdown and auto restart using difficulty setting
      const restartTime = difficultySettings[difficulty].restartTime;
      let timeLeft = Math.ceil(restartTime / 1000);
      setRestartCountdown(timeLeft);

      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setRestartCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          dealNewRound();
        }
      }, 1000);
    } else {
      // At least one player didn't bust - dealer plays
      const revealedDealerHand = dealerHand.map((card, idx) =>
        idx === 1 ? { ...card, hidden: false } : card
      );

      const [finalDealerHand, newDeck, countChange] = dealerPlay(
        revealedDealerHand,
        deck
      );

      const newPlayerHands = playerHands.map((hand) => {
        const totalForPlayer = totalAndHandleAce(hand.cards);
        const totalForDealer = totalAndHandleAce(finalDealerHand);
        let status = hand.status;

        if (status === "bust" || status === "lost") {
          status = "lost";
          return { ...hand, status };
        } else {
          if (totalForDealer > 21) {
            status = "won";
          } else if (totalForDealer < totalForPlayer) {
            status = "won";
          } else if (totalForDealer === totalForPlayer) {
            status = "draw";
          } else {
            status = "lost";
          }
          return { ...hand, status };
        }
      });

      const changed = newPlayerHands.some(
        (hand, i) => hand.status !== playerHands[i].status
      );

      if (changed) {
        setPlayerHands(newPlayerHands);
        const newCount = count.count + countChange;
        const newTrueCount = calcTrueCount(newCount, newDeck);
        setCount({ count: newCount, trueCount: newTrueCount });
        setDealerHand(finalDealerHand);
        setDeck(newDeck);
        setGameOver(true);

        // Start countdown and auto restart using difficulty setting
        const restartTime = difficultySettings[difficulty].restartTime;
        let timeLeft = Math.ceil(restartTime / 1000);
        setRestartCountdown(timeLeft);

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setRestartCountdown(timeLeft);
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            dealNewRound(newDeck, {
              count: newCount,
              trueCount: newTrueCount,
            });
          }
        }, 1000);
      }
    }
  }
}, [playerHands, gameStarted]);

function handleHit(i) {
  const copydeck = [...deck];

  const card = copydeck.pop();
  const cardCount = checkCountValue(card);

  const newPlayerHands = playerHands.map((hand, idx) => {
    if (idx === i) {
      const newCards = [...hand.cards, card];
      const total = totalAndHandleAce(newCards);
      let status = hand.status;
      if (total > 21) {
        status = "bust";
      }
      if (total === 21) {
        status = "blackjack";
      }
      return { ...hand, cards: newCards, status };
    }

    return hand;
  });
  const newCount = count.count + cardCount;
  const trueCount = calcTrueCount(newCount, copydeck);

  setCount({ ...count, count: newCount, trueCount });
  setPlayerHands(newPlayerHands);
  setDeck(copydeck);
}

function handleStand(i) {
  const newPlayerHands = [...playerHands];
  const finalPlayerHand = newPlayerHands.map((hand, idx) => {
    if (idx === i) {
      hand.status = "stood";
    }
    return hand;
  });
  setPlayerHands(finalPlayerHand);
}
const handleCountGuess = () => {
  if (userCountGuess === "") return;
  setShowCount(true);
};

const toggleCountVisibility = () => {
  setShowCount(!showCount);
};

const handleStartGame = () => {
  setGameStarted(true);
  startNewGame();
};

if (!gameStarted) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 flex flex-col items-center justify-center">
      <div className="bg-black/70 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-extrabold text-yellow-300 text-center mb-8 tracking-wider">
          Blackjack Setup
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">
              Number of Decks:
            </label>
            <select
              value={numDecks}
              onChange={(e) => setNumDecks(parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-emerald-800 text-white font-semibold border-2 border-emerald-600 focus:border-yellow-300 focus:outline-none"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} Deck{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">
              Number of Hands:
            </label>
            <select
              value={numHands}
              onChange={(e) => setNumHands(parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-emerald-800 text-white font-semibold border-2 border-emerald-600 focus:border-yellow-300 focus:outline-none"
            >
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n} Hand{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">
              Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 rounded-lg bg-emerald-800 text-white font-semibold border-2 border-emerald-600 focus:border-yellow-300 focus:outline-none"
            >
              {Object.entries(difficultySettings).map(([key, setting]) => (
                <option key={key} value={key}>
                  {setting.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-emerald-300 mt-1">
              Controls how fast new rounds start after game ends
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-6 rounded-lg text-xl shadow-lg hover:from-yellow-300 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 flex flex-col items-center justify-center overflow-auto">
    <div className="w-full max-w-5xl rounded-2xl shadow-2xl bg-black/70 p-2 md:p-6 flex flex-col gap-4 flex-grow">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-300 tracking-wider drop-shadow-lg text-center">
          Blackjack
        </h1>

        {/* Count Display and Guess Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div
            onClick={toggleCountVisibility}
            className="cursor-pointer bg-emerald-800 px-4 py-2 rounded-lg border-2 border-emerald-600 hover:border-yellow-300 transition-colors"
          >
            <div className="text-lg md:text-xl font-semibold text-white text-center">
              Count:{" "}
              <span className="text-yellow-400">
                {showCount
                  ? `${count.count}, True Count: ${count.trueCount}`
                  : "???"}
              </span>
            </div>
          </div>

          {!showCount && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Your guess"
                value={userCountGuess}
                onChange={(e) => setUserCountGuess(e.target.value)}
                className="w-24 p-2 rounded bg-emerald-800 text-white border border-emerald-600 focus:border-yellow-300 focus:outline-none"
              />
              <button
                onClick={handleCountGuess}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-2 rounded transition-colors"
              >
                Guess
              </button>
            </div>
          )}

          {showCount && userCountGuess && (
            <div className="text-sm text-center">
              <span className="text-white">Your guess: </span>
              <span
                className={`font-bold ${
                  parseInt(userCountGuess) === count.count
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {userCountGuess}
              </span>
              <span className="text-white"> / Actual: </span>
              <span className="text-yellow-400 font-bold">{count.count}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-8 w-full items-center justify-center">
        <div className="w-full flex flex-col items-center justify-start">
          <DealerHand
            cards={dealerHand}
            cardSize={cardSize}
            handPadding={handPadding}
          />
        </div>
        <div className="w-full max-h-[60vh] overflow-y-auto md:overflow-visible scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-emerald-700">
          <div className="flex flex-col md:flex-row-reverse items-center md:items-start justify-center gap-4 md:gap-0">
            {playerHands.map((hand, index) => (
              <div key={index} className="w-full md:w-auto flex-shrink-0">
                <PlayerHand
                  hand={hand}
                  handNum={index + 1}
                  hitFunc={() => handleHit(index)}
                  standFunc={() => handleStand(index)}
                  cardSize={cardSize}
                  handPadding={handPadding}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {reshuffling && (
        <div className="text-center bg-red-800/80 p-4 rounded-lg border-2 border-red-600">
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">
            🔄 RESHUFFLING DECK
          </h2>
          <p className="text-white mb-2">
            Deck is running low. Shuffling new deck...
          </p>
          <div className="text-3xl font-bold text-red-300">
            {reshuffleCountdown}
          </div>
          <p className="text-sm text-red-200">Count will be reset to 0</p>
        </div>
      )}

      {gameOver && !reshuffling && (
        <div className="text-center bg-emerald-800/80 p-4 rounded-lg border-2 border-emerald-600">
          <div className="text-yellow-300 font-semibold mb-2">Game Over!</div>
          <div className="text-2xl font-bold text-white mb-1">
            Next round starts in:
          </div>
          <div className="text-4xl font-bold text-yellow-400">
            {restartCountdown}
          </div>
          <div className="text-sm text-emerald-200 mt-2">
            Difficulty: {difficultySettings[difficulty].name}
          </div>
        </div>
      )}
    </div>
  </div>
);
