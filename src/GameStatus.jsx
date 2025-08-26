import React from "react";

const GameStatus = ({
  gameOver,
  reshuffling,
  reshuffleCountdown,
  restartCountdown,
  difficultySettings,
  difficulty,
}) => {
  if (reshuffling) {
    return (
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
    );
  }

  if (gameOver) {
    return (
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
    );
  }

  return null;
};

export default GameStatus;
