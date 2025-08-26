import { useState, useEffect } from "react";
import {
  buildDeck,
  shuffleDeck,
  totalAndHandleAce,
  checkCountValue,
  calculateInitialCount,
  calcTrueCount,
} from "./utils";

export const useGameLogic = (numDecks, numHands, difficulty) => {
  const gameActive = numDecks > 0;

  // Game states
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHands, setPlayerHands] = useState([]);
  const [deck, setDeck] = useState([]);
  const [count, setCount] = useState({ count: 0, trueCount: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [reshuffling, setReshuffling] = useState(false);
  const [reshuffleCountdown, setReshuffleCountdown] = useState(5);
  const [originalDeckSize, setOriginalDeckSize] = useState(0);
  const [restartCountdown, setRestartCountdown] = useState(0);
  const [isDealing, setIsDealing] = useState(false);
  const [newlyDealtCards, setNewlyDealtCards] = useState(new Set());
  const [activeTimers, setActiveTimers] = useState(new Set());

  const clearAllTimers = () => {
    activeTimers.forEach((timer) => clearInterval(timer));
    setActiveTimers(new Set());
  };

  const difficultySettings = {
    easy: { restartTime: 10000, name: "Easy (10s)" },
    medium: { restartTime: 7000, name: "Medium (7s)" },
    hard: { restartTime: 3000, name: "Hard (3s)" },
  };

  const checkForReshuffle = (currentDeck) => {
    const remainingCards = currentDeck.length;
    // Reshuffling if remaining cards are less than 1/3 of the original deck size
    const reshuffleThreshold = Math.floor(originalDeckSize / 3);
    return remainingCards < reshuffleThreshold;
  };

  // Handle reshuffling with countdown
  const handleReshuffle = () => {
    clearAllTimers(); // Clear existing timers
    setReshuffling(true);
    setReshuffleCountdown(5);

    const countdown = setInterval(() => {
      setReshuffleCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setActiveTimers((prev) => {
            const newTimers = new Set(prev);
            newTimers.delete(countdown);
            return newTimers;
          });

          // After countdown, create new deck and reset count
          const newdeck = shuffleDeck(buildDeck(numDecks));
          const deckSize = numDecks * 52;
          setDeck(newdeck);
          setOriginalDeckSize(deckSize);
          setCount({ count: 0, trueCount: 0 });
          setReshuffling(false);
          dealNewRound(newdeck, { count: 0, trueCount: 0 });
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    setActiveTimers((prev) => new Set(prev).add(countdown));
  };

  const startNewGame = () => {
    const newdeck = shuffleDeck(buildDeck(numDecks));
    const deckSize = numDecks * 52;
    setDeck(newdeck);
    setOriginalDeckSize(deckSize);
    setCount({ count: 0, trueCount: 0 });
    setReshuffling(false);
    dealNewRound(newdeck, { count: 0, trueCount: 0 });
  };

  const dealNewRound = async (currentDeck = deck, currentCount = count) => {
    if (reshuffling || isDealing) return;

    const workingDeck = [...currentDeck];

    // Check if we need to reshuffle
    if (checkForReshuffle(workingDeck) && originalDeckSize > 0) {
      handleReshuffle();
      return;
    }

    if (workingDeck.length < 10) {
      handleReshuffle();
      return;
    }

    clearAllTimers();

    setIsDealing(true);
    setGameOver(false);
    setRestartCountdown(0);
    setNewlyDealtCards(new Set());

    setPlayerHands([]);
    setDealerHand([]);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const newPlayerHands = Array.from({ length: numHands }, () => ({
      cards: [],
      status: "playing",
      canSplit: false, // Initialize canSplit property
    }));

    const newDealerHand = [];
    const dealtCardIds = new Set();

    // Deal first card to each player
    for (let i = 0; i < numHands; i++) {
      const card = {
        ...workingDeck.pop(),
        isNewlyDealt: true,
        id: `${workingDeck.length}_${Date.now()}_${i}`,
      };
      dealtCardIds.add(card.id);
      newPlayerHands[i].cards.push(card);
      setPlayerHands([...newPlayerHands]);
      setNewlyDealtCards(new Set(dealtCardIds));
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    // Deal first card to dealer (face up)
    const dealerFirstCard = {
      ...workingDeck.pop(),
      hidden: false,
      isNewlyDealt: true,
      id: `dealer_1_${Date.now()}`,
    };
    dealtCardIds.add(dealerFirstCard.id);
    newDealerHand.push(dealerFirstCard);
    setDealerHand([...newDealerHand]);
    setNewlyDealtCards(new Set(dealtCardIds));
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Deal second card to each player
    for (let i = 0; i < numHands; i++) {
      const card = {
        ...workingDeck.pop(),
        isNewlyDealt: true,
        id: `${workingDeck.length}_${Date.now()}_${i}_2`,
      };
      dealtCardIds.add(card.id);
      newPlayerHands[i].cards.push(card);

      // Check for blackjack
      const total = totalAndHandleAce(newPlayerHands[i].cards);
      if (total === 21) {
        newPlayerHands[i].status = "blackjack";
      }

      // check for split:
      const canSplit = newPlayerHands[i].cards.every(
        (card) => card.value === newPlayerHands[i].cards[0].value
      );
      newPlayerHands[i].canSplit = canSplit;

      setPlayerHands([...newPlayerHands]);
      setNewlyDealtCards(new Set(dealtCardIds));
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    // Deal second card to dealer (face down)
    const dealerSecondCard = {
      ...workingDeck.pop(),
      hidden: true,
      isNewlyDealt: true,
      id: `dealer_2_${Date.now()}`,
    };
    dealtCardIds.add(dealerSecondCard.id);
    newDealerHand.push(dealerSecondCard);
    setDealerHand([...newDealerHand]);
    setNewlyDealtCards(new Set(dealtCardIds));

    // Calculate count
    const [playerCount, dealerCount] = calculateInitialCount(
      newPlayerHands,
      newDealerHand
    );
    const newTotalCount = currentCount.count + playerCount + dealerCount;
    const newTrueCount = calcTrueCount(newTotalCount, workingDeck);

    setCount({ count: newTotalCount, trueCount: newTrueCount });
    setDeck(workingDeck);

    // Clear newly dealt card tracking
    setTimeout(() => {
      setNewlyDealtCards(new Set());
      setIsDealing(false);
    }, 1000);
  };

  const handleSplit = (handIndex) => {
    const handToSplit = playerHands[handIndex];
    const hand1 = {
      ...handToSplit,
      cards: [handToSplit.cards[0]],
      canSplit: false,
    };
    const hand2 = {
      ...handToSplit,
      cards: [handToSplit.cards[1]],
      canSplit: false,
    };
    const newPlayerHands = [...playerHands];

    newPlayerHands.splice(handIndex, 1, hand1, hand2);
    setPlayerHands(newPlayerHands);
  };

  const handleHit = async (handIndex) => {
    if (isDealing || gameOver) return;

    const copydeck = [...deck];
    const card = {
      ...copydeck.pop(),
      isNewlyDealt: true,
      id: `hit_${Date.now()}_${handIndex}`,
    };
    const cardCount = checkCountValue(card);

    const newPlayerHands = playerHands.map((hand, idx) => {
      if (idx === handIndex) {
        const newCards = [...hand.cards, card];
        const total = totalAndHandleAce(newCards);
        let status = hand.status;
        if (total > 21) {
          status = "bust";
        }
        if (total === 21) {
          status = "stood";
        }
        return { ...hand, cards: newCards, status, canSplit: false };
      }
      return hand;
    });

    const newCount = count.count + cardCount;
    const trueCount = calcTrueCount(newCount, copydeck);

    setCount({ ...count, count: newCount, trueCount });
    setPlayerHands(newPlayerHands);
    setDeck(copydeck);

    setNewlyDealtCards(new Set([card.id]));

    setTimeout(() => {
      setNewlyDealtCards(new Set());
    }, 700);
  };

  const dealerPlayAnimated = async (currentDealerHand, currentDeck) => {
    const newDealerHand = [...currentDealerHand];
    let countChange = 0;
    const newDeck = [...currentDeck];

    const hasHiddenCard = newDealerHand.some((card) => card.hidden);
    if (hasHiddenCard) {
      const revealedHand = newDealerHand.map((card, idx) => {
        if (card.hidden) {
          return {
            ...card,
            hidden: false,
            wasHidden: true,
            flipId: `flip_${Date.now()}_${idx}`,
          };
        }
        return card;
      });
      setDealerHand(revealedHand);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const cleanedHand = revealedHand.map((card) => {
        const { wasHidden, flipId, ...cleanCard } = card;
        return cleanCard;
      });
      newDealerHand.splice(0, newDealerHand.length, ...cleanedHand);
    }

    while (totalAndHandleAce(newDealerHand) < 17) {
      const card = {
        ...newDeck.pop(),
        isNewlyDealt: true,
        id: `dealer_hit_${Date.now()}`,
      };
      countChange += checkCountValue(card);
      newDealerHand.push(card);
      setDealerHand([...newDealerHand]);

      setNewlyDealtCards(new Set([card.id]));
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setNewlyDealtCards(new Set());
    return [newDealerHand, newDeck, countChange];
  };

  const handleStand = (handIndex) => {
    const newPlayerHands = [...playerHands];
    const finalPlayerHand = newPlayerHands.map((hand, idx) => {
      if (idx === handIndex) {
        hand.status = "stood";
        hand.canSplit = false;
      }
      return hand;
    });
    setPlayerHands(finalPlayerHand);
  };

  useEffect(() => {
    if (gameActive && playerHands.length === 0) {
      startNewGame();
    }
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || isDealing || gameOver) return;

    const allDone = playerHands.every((hand) => hand.status !== "playing");
    const allBust = playerHands.every((hand) => hand.status === "bust");

    if (allDone && playerHands.length > 0) {
      if (allBust) {
        // All players bust - dealer wins without playing
        const newPlayerHands = playerHands.map((hand) => ({
          ...hand,
          status: "lost",
        }));
        setPlayerHands(newPlayerHands);
        setGameOver(true);

        // Clear any existing timers and start countdown
        clearAllTimers();
        const restartTime = difficultySettings[difficulty].restartTime;
        let timeLeft = Math.ceil(restartTime / 1000);
        setRestartCountdown(timeLeft);

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setRestartCountdown(timeLeft);
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            setActiveTimers((prev) => {
              const newTimers = new Set(prev);
              newTimers.delete(countdownInterval);
              return newTimers;
            });
            dealNewRound();
          }
        }, 1000);

        setActiveTimers((prev) => new Set(prev).add(countdownInterval));
      } else {
        setGameOver(true);

        const handleAnimatedDealerPlay = async () => {
          const [finalDealerHand, newDeck, countChange] =
            await dealerPlayAnimated(dealerHand, deck);

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

          setPlayerHands(newPlayerHands);
          const newCount = count.count + countChange;
          const newTrueCount = calcTrueCount(newCount, newDeck);
          setCount({ count: newCount, trueCount: newTrueCount });
          setDeck(newDeck);

          clearAllTimers();
          const restartTime = difficultySettings[difficulty].restartTime;
          let timeLeft = Math.ceil(restartTime / 1000);
          setRestartCountdown(timeLeft);

          const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            setRestartCountdown(timeLeft);
            if (timeLeft <= 0) {
              clearInterval(countdownInterval);
              setActiveTimers((prev) => {
                const newTimers = new Set(prev);
                newTimers.delete(countdownInterval);
                return newTimers;
              });
              dealNewRound(newDeck, {
                count: newCount,
                trueCount: newTrueCount,
              });
            }
          }, 1000);

          setActiveTimers((prev) => new Set(prev).add(countdownInterval));
        };

        handleAnimatedDealerPlay();
      }
    }
  }, [playerHands, difficulty, gameActive, isDealing, gameOver]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return {
    // State
    dealerHand,
    playerHands,
    deck,
    count,
    gameOver,
    reshuffling,
    reshuffleCountdown,
    restartCountdown,
    difficultySettings,
    isDealing,
    newlyDealtCards,

    // Actions
    startNewGame,
    handleHit,
    handleStand,
    handleSplit,
  };
};
