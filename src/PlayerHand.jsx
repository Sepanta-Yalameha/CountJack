import { totalAndHandleAce } from "./utils.js";
import Card from "./Card.jsx";
export default function PlayerHand({
  hand,
  handNum,
  hitFunc,
  standFunc,
  cardSize = "md:w-32 md:h-48 w-24 h-36",
  handPadding = "p-4",
  newlyDealtCards = new Set(),
  isDealing = false,
  splitFunc,
}) {
  const playerTotal = totalAndHandleAce(hand.cards);
  const numAces = hand.cards.filter((card) => card.value === "A").length;

  // Calculate both possible totals when aces are present
  const getDisplayTotal = () => {
    if (numAces === 0) {
      return playerTotal.toString();
    }

    // Calculate total with all aces as 1
    const lowTotal = hand.cards.reduce((sum, card) => {
      if (card.value === "A") return sum + 1;
      if (["J", "Q", "K"].includes(card.value)) return sum + 10;
      return sum + parseInt(card.value);
    }, 0);

    // Calculate total with one ace as 11 (if beneficial)
    const highTotal = lowTotal + 10;

    // If both totals are valid (≤21), show both
    if (highTotal <= 21 && lowTotal !== highTotal) {
      return `${lowTotal} / ${highTotal}`;
    }
    // If only low total is valid, show the actual calculated total
    return playerTotal.toString();
  };

  return (
    <div
      className={`rounded-2xl bg-green-900 shadow-lg flex flex-col items-center min-w-0 w-full md:w-auto max-w-full ${handPadding}`}
    >
      <div className="text-base md:text-lg font-bold text-white mb-2 tracking-wide drop-shadow">
        Hand {handNum}
      </div>
      <div className="flex flex-row flex-nowrap justify-center items-center gap-2 mb-2 overflow-x-auto">
        {hand.cards.map((card) => (
          <div key={card.id} className="flex-shrink min-w-0">
            <Card
              card={card}
              cardSize={cardSize}
              isNewlyDealt={newlyDealtCards.has(card.id) || card.isNewlyDealt}
            />
          </div>
        ))}
      </div>

      {/* Hand Total Display */}
      <div className="text-xl font-bold text-white mb-3 bg-emerald-800 px-4 py-2 rounded-lg border-2 border-emerald-600">
        Total: <span className="text-yellow-300">{getDisplayTotal()}</span>
      </div>

      <div className="text-center min-h-[28px]">
        <span
          className={
            hand.status === "bust"
              ? "text-red-400 font-bold"
              : hand.status === "blackjack"
              ? "text-yellow-300 font-bold"
              : hand.status === "won"
              ? "text-green-400 font-bold"
              : hand.status === "lost"
              ? "text-red-300 font-bold"
              : hand.status === "draw"
              ? "text-gray-300 font-bold"
              : ""
          }
        >
          {hand.status === "bust"
            ? "Bust!"
            : hand.status === "blackjack"
            ? "Blackjack!"
            : hand.status === "won"
            ? "You won!"
            : hand.status === "lost"
            ? "You lost!"
            : hand.status === "draw"
            ? "It's a draw!"
            : null}
        </span>
      </div>
      <div className="flex flex-row justify-center gap-4 mt-4 w-full">
        <button
          className="flex-1 min-w-[90px] px-4 py-2 border-2 border-green-500 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={hitFunc}
          disabled={hand.status !== "playing" || isDealing}
        >
          Hit
        </button>
        <button
          className="flex-1 min-w-[90px] px-4 py-2 border-2 border-red-600 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={standFunc}
          disabled={
            hand.status !== "playing" ||
            totalAndHandleAce(hand.cards) === 21 ||
            isDealing
          }
        >
          Stand
        </button>
        {hand.canSplit ? (
          <button
            className="flex-1 min-w-[90px] px-4 py-2 border-2 border-blue-500 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={splitFunc}
            disabled={hand.status !== "playing" || isDealing}
          >
            Split
          </button>
        ) : null}
      </div>
    </div>
  );
}
