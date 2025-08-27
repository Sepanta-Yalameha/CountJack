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
  const [numDecks, setNumDecks] = useState(5);
  const [numHands, setNumHands] = useState(1);
  const [difficulty, setDifficulty] = useState("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [userCountGuess, setUserCountGuess] = useState("");

  // Difficulty settings
  const difficultySettings = {
    easy: { restartTime: 10000, name: "Easy (10s)" },
    medium: { restartTime: 7000, name: "Medium (7s)" },
    hard: { restartTime: 3000, name: "Hard (3s)" },
  };

  // Only use the game logic hook when game is started
  const gameLogic = useGameLogic(
    gameStarted ? numDecks : 0,
    gameStarted ? numHands : 0,
    difficulty
  );

  // Extract values with fallbacks for when game hasn't started
  const {
    dealerHand = [],
    playerHands = [],
    count = { count: 0, trueCount: 0 },
    gameOver = false,
    reshuffling = false,
    reshuffleCountdown = 5,
    restartCountdown = 0,
    isDealing = false,
    newlyDealtCards = new Set(),
    startNewGame,
    handleHit,
    handleStand,
    handleSplit,
  } = gameStarted ? gameLogic : {};

  const handCount = playerHands.length;

  // Dynamic card sizing based on number of hands
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

  const handleCountGuess = () => {
    if (userCountGuess === "") return;
    setShowCount(true);
  };

  const toggleCountVisibility = () => {
    setShowCount(!showCount);
  };

  const handleReset = () => {
    // Reset all game states and return to setup screen
    setGameStarted(false);
    setShowCount(false);
    setUserCountGuess("");
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  // If game hasn't started, show configuration screen
  if (!gameStarted) {
    return (
      <GameSetup
        numDecks={numDecks}
        setNumDecks={setNumDecks}
        numHands={numHands}
        setNumHands={setNumHands}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        difficultySettings={difficultySettings}
        onStartGame={handleStartGame}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 flex flex-col items-center justify-center overflow-auto relative">
      {/* Reset Button - Top Right */}
      <button
        onClick={handleReset}
        className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        title="Reset & Change Game Settings"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Reset
      </button>

      <div className="w-full max-w-5xl rounded-2xl shadow-2xl bg-black/70 p-2 md:p-6 flex flex-col gap-4 flex-grow">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-300 tracking-wider drop-shadow-lg text-center">
            Count Jack
          </h1>

          <CountDisplay
            count={count}
            showCount={showCount}
            userCountGuess={userCountGuess}
            setUserCountGuess={setUserCountGuess}
            onToggleCountVisibility={toggleCountVisibility}
            onCountGuess={handleCountGuess}
          />
        </header>

        <div className="flex flex-col gap-8 w-full items-center justify-center">
          <div className="w-full flex flex-col items-center justify-start">
            <DealerHand
              cards={dealerHand}
              cardSize={cardSize}
              handPadding={handPadding}
              newlyDealtCards={newlyDealtCards}
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
                    splitFunc={() => handleSplit(index)}
                    cardSize={cardSize}
                    handPadding={handPadding}
                    newlyDealtCards={newlyDealtCards}
                    isDealing={isDealing}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <GameStatus
          gameOver={gameOver}
          reshuffling={reshuffling}
          reshuffleCountdown={reshuffleCountdown}
          restartCountdown={restartCountdown}
          difficultySettings={difficultySettings}
          difficulty={difficulty}
        />
      </div>
    </div>
  );
}
