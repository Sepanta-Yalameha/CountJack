const GameSetup = ({
  numDecks,
  setNumDecks,
  numHands,
  setNumHands,
  difficulty,
  setDifficulty,
  difficultySettings,
  onStartGame,
}) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 flex flex-col items-center justify-center">
      <div className="bg-black/70 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-extrabold text-yellow-300 text-center mb-8 tracking-wider">
          Setup
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">
              Number of Decks in the shoe:
            </label>
            <select
              value={numDecks}
              onChange={(e) => setNumDecks(parseInt(e.target.value))}
              className="w-full p-3 rounded-lg bg-emerald-800 text-white font-semibold border-2 border-emerald-600 focus:border-yellow-300 focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
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
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-6 rounded-lg text-xl shadow-lg hover:from-yellow-300 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
