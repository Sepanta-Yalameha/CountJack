# 🃏 CountJack - BlackJack Card Counting Trainer

<div align="center">

![CountJack Gameplay Demo](./demo/countjack-demo.gif)

_Experience realistic card dealing animations, live count tracking, and interactive BlackJack training_

</div>

---

A sophisticated web-based BlackJack card counting training application built with React and Tailwind CSS. Master the art of card counting with realistic gameplay, animated card dealing, multiple difficulty levels, and live count tracking.

## 🎯 Features

- **🎭 Realistic Card Dealing Animation** - Cards are dealt one by one with smooth animations and flip effects
- **⚡ Multiple Difficulty Levels** - Easy (10s), Medium (7s), and Hard (3s) restart timers to challenge your speed
- **📊 Live Card Counting** - Track running count and true count in real-time with guess-before-reveal gameplay
- **🃏 Multi-Hand Play** - Practice with 1-3 hands simultaneously for advanced training
- **🎯 Smart Ace Value Display** - Shows both possible totals (e.g., "7/17") for hands containing Aces
- **♻️ Automatic Deck Reshuffling** - Realistic casino experience with reshuffling when deck reaches 1/3 capacity
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **🎮 Interactive Count Challenge** - Guess the running count before revealing to test your skills

## 🚀 Live Demo

**[Play CountJack Now →](https://count-jack.vercel.app/)**

> 🎮 **Ready to play!** Test your card counting skills with realistic BlackJack gameplay.

## 🎮 How to Play

1. **📋 Setup Game**: Choose number of decks (1-8), hands (1-3), and difficulty level
2. **🎲 Watch Cards Deal**: Cards are dealt automatically with realistic casino-style animations
3. **🧮 Count Cards**: Keep track of high/low cards using the Hi-Lo counting system:
   - **Low Cards (2-6)**: +1 point each
   - **Neutral Cards (7-9)**: 0 points each
   - **High Cards (10, J, Q, K, A)**: -1 point each
4. **❓ Make Your Guess**: Try to guess the running count before checking your accuracy
5. **📈 Track True Count**: Monitor the true count (running count ÷ remaining decks)
6. **🏆 Master the Skills**: Practice across multiple rounds with persistent deck state

## 🛠️ Built With

- **⚛️ React 18** - Modern React with Hooks and functional components
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid styling
- **⚡ Vite** - Lightning-fast build tool and development server
- **🔥 Modern JavaScript ES6+** - Latest JavaScript features and syntax

## 🏁 Getting Started

### Prerequisites

- **Node.js** 16+
- **npm** or **yarn** package manager

### Installation

1. **📥 Clone the repository**

   ```bash
   git clone https://github.com/Sepanta-Yalameha/CountJack.git
   cd CountJack
   ```

2. **📦 Install dependencies**

   ```bash
   npm install
   ```

3. **🚀 Start development server**

   ```bash
   npm run dev
   ```

4. **🌐 Open your browser**
   ```
   http://localhost:5173
   ```

## 🎲 Card Counting System (Hi-Lo)

### Card Values

- **Low Cards (2, 3, 4, 5, 6)**: **+1 point** - Good for player
- **Neutral Cards (7, 8, 9)**: **0 points** - Neutral
- **High Cards (10, J, Q, K, A)**: **-1 point** - Good for dealer

### Running Count vs True Count

- **Running Count**: Sum of all card values seen
- **True Count**: Running Count ÷ Number of remaining decks
- **Higher true counts** = Better odds for the player

### Deck Penetration

- Deck reshuffles automatically when **1/3 of cards remain**
- Realistic casino simulation for authentic training

## 📁 Project Structure

```
CountJack/
├── public/
│   ├── cards/              # All 52 card images + back design
│   │   ├── A-C.png         # Ace of Clubs
│   │   ├── K-H.png         # King of Hearts
│   │   ├── BACK.png        # Card back design
│   │   └── ...             # All other cards
│   └── favicon.png         # Site favicon
├── src/
│   ├── App.jsx             # Root component
│   ├── Game.jsx            # Main game orchestrator
│   ├── Card.jsx            # Individual card with animations
│   ├── Card.css            # Card animation styles
│   ├── PlayerHand.jsx      # Player hand display & controls
│   ├── PlayerHand.css      # Player hand styles
│   ├── DealerHand.jsx      # Dealer hand with hidden card logic
│   ├── DealerHand.css      # Dealer hand styles
│   ├── GameSetup.jsx       # Initial configuration screen
│   ├── CountDisplay.jsx    # Count tracking & guessing UI
│   ├── GameStatus.jsx      # Game state & countdown messages
│   ├── Game.css            # Game-specific styles
│   ├── useGameLogic.js     # Main game state management hook
│   ├── utils.js            # Helper functions (deck, scoring, etc.)
│   └── main.jsx            # React entry point
├── .gitignore              # Git ignore file
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## 🎯 Key Components

- **🎮 Game.jsx**: Main game orchestrator handling configuration and layout
- **🧠 useGameLogic.js**: Custom hook managing all game state, dealing, and counting logic
- **🃏 Card.jsx**: Individual card component with dealing and flip animations
- **👤 PlayerHand.jsx**: Player hand display with hit/stand controls and live totals
- **🎰 DealerHand.jsx**: Dealer hand with hidden card reveal logic
- **⚙️ GameSetup.jsx**: Initial configuration screen for decks, hands, and difficulty

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **🍴 Fork** the project
2. **🌿 Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push** to the branch (`git push origin feature/AmazingFeature`)
5. **🔁 Open** a Pull Request

### Ideas for Contributions

- 📊 Add statistics tracking (hands played, accuracy, etc.)
- 🎵 Sound effects for card dealing and game events
- 📈 Advanced counting systems (KO, Hi-Opt I, etc.)

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sepanta Yalameha**

- 🔗 LinkedIn: [Sepanta Yalameha](https://linkedin.com/in/sepanta-yalameha)
- 💻 GitHub: [@Sepanta-Yalameha](https://github.com/Sepanta-Yalameha)
- 📧 Email: sepantayalameha2006@gmail.com

## 🙏 Acknowledgments

- 🎯 Inspired by professional casino blackjack gameplay
- 📚 Built as a comprehensive learning project showcasing React, animations, and game state management
- 🌟 Special thanks to the React and Tailwind CSS communities for excellent documentation

## 📊 Technical Highlights

- **⚡ Performance**: Optimized React rendering with proper key props and state management
- **🎭 Animations**: Smooth CSS animations for card dealing, flipping, and transitions
- **📱 Responsive**: Mobile-first design with Tailwind CSS responsive utilities
- **♿ Accessibility**: Semantic HTML and keyboard navigation support
- **🧹 Code Quality**: Clean component architecture with custom hooks
- **🎯 State Management**: Comprehensive game state with proper cleanup and error handling

---

⭐ **Star this repo if you found it helpful!** ⭐

_Built with ❤️ by Sepanta Yalameha_
