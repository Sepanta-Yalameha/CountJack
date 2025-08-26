import React from "react";

const CountDisplay = ({
  count,
  showCount,
  userCountGuess,
  setUserCountGuess,
  onToggleCountVisibility,
  onCountGuess,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div
        onClick={onToggleCountVisibility}
        className="cursor-pointer bg-emerald-800 px-4 py-2 rounded-lg border-2 border-emerald-600 hover:border-yellow-300 transition-colors"
      >
        <div className="text-lg md:text-xl font-semibold text-white text-center">
          Count:{" "}
          <span className="text-yellow-400">
            {showCount
              ? `${count.count} | True Count ≈ ${count.trueCount}`
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
            className="w-28 p-2 rounded bg-emerald-800 text-white border border-emerald-600 focus:border-yellow-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={onCountGuess}
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
  );
};

export default CountDisplay;
