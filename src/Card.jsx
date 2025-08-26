import { useState, useEffect } from "react";
import "./Card.css";

export default function Card({
  card,
  cardSize = "md:w-32 md:h-48 w-24 h-36",
  isNewlyDealt = false,
}) {
  const [isDealing, setIsDealing] = useState(isNewlyDealt);
  const [isFlipping, setIsFlipping] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  useEffect(() => {
    if (isNewlyDealt) {
      setIsDealing(true);
      const timer = setTimeout(() => {
        setIsDealing(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isNewlyDealt]);

  useEffect(() => {
    if (card.wasHidden && !card.hidden && !hasFlipped) {
      setIsFlipping(true);
      setHasFlipped(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [card.hidden, card.wasHidden, hasFlipped]);

  useEffect(() => {
    if (!card.wasHidden) {
      setHasFlipped(false);
    }
  }, [card.id, card.wasHidden]);

  const animationClasses = [
    isDealing ? "card-dealing" : "",
    isFlipping ? "card-flip flipping" : "card-flip",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <img
      className={`rounded-lg shadow-xl border-2 bg-white select-none ${cardSize} flex-shrink min-w-0 max-w-full h-auto ${animationClasses}`}
      src={card.hidden ? `/cards/back.png` : `/cards/${card.name}.png`}
      alt={card.name}
      draggable={false}
    />
  );
}
