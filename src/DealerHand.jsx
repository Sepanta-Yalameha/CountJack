import Card from "./Card.jsx";
import { totalAndHandleAce } from "./utils.js";

export default function DealerHand({
  cards,
  cardSize = "md:w-32 md:h-48 w-24 h-36",
  handPadding = "p-4",
  newlyDealtCards = new Set(),
}) {
  // Calculate total for visible cards only (not hidden)
  const visibleCards = cards.filter((card) => !card.hidden);
  const dealerTotal =
    visibleCards.length > 0 ? totalAndHandleAce(visibleCards) : 0;
  const hasHiddenCard = cards.some((card) => card.hidden);
  const numAces = visibleCards.filter((card) => card.value === "A").length;

  // Calculate both possible totals for visible cards when aces are present
  const getDisplayTotal = () => {
    if (hasHiddenCard) {
      // When there's a hidden card, show visible total + ?
      if (numAces === 0) {
        return `${dealerTotal} + ?`;
      }

      // Calculate both ace possibilities for visible cards
      const lowTotal = visibleCards.reduce((sum, card) => {
        if (card.value === "A") return sum + 1;
        if (["J", "Q", "K"].includes(card.value)) return sum + 10;
        return sum + parseInt(card.value);
      }, 0);

      const highTotal = lowTotal + 10;

      if (highTotal <= 21 && lowTotal !== highTotal) {
        return `${lowTotal}/${highTotal} + ?`;
      }
      return `${dealerTotal} + ?`;
    }

    // No hidden cards - show full total with ace possibilities
    if (numAces === 0) {
      return dealerTotal.toString();
    }

    const lowTotal = visibleCards.reduce((sum, card) => {
      if (card.value === "A") return sum + 1;
      if (["J", "Q", "K"].includes(card.value)) return sum + 10;
      return sum + parseInt(card.value);
    }, 0);

    const highTotal = lowTotal + 10;

    if (highTotal <= 21 && lowTotal !== highTotal) {
      return `${lowTotal} / ${highTotal}`;
    }
    return dealerTotal.toString();
  };

  return (
    <div className={`w-full flex flex-col items-center mb-4 ${handPadding}`}>
      {/* Dealer Total Display */}
      <div className="text-xl font-bold text-white mb-3 bg-red-800 px-4 py-2 rounded-lg border-2 border-red-600">
        Total: <span className="text-yellow-300">{getDisplayTotal()}</span>
      </div>

      <div className="flex flex-row justify-center gap-2 md:gap-4 bg-green-900 rounded-xl px-4 py-3 shadow-lg min-h-[120px]">
        {cards.map((card, idx) => (
          <Card
            key={card.id}
            card={card}
            cardSize={cardSize}
            isNewlyDealt={newlyDealtCards.has(card.id) || card.isNewlyDealt}
          />
        ))}
      </div>
    </div>
  );
}
