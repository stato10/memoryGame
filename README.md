# 🧠 Memory Game - Professional Edition

A modern, responsive, and aesthetically pleasing Memory Game built with vanilla JavaScript, featuring 3D animations and a Glassmorphism design system.

![Memory Game Preview](assets/memory-game.png)

## ✨ Features

-   **Glassmorphism UI**: A sleek, frosted-glass interface with vibrant gradients.
-   **3D Card Animations**: Smooth, hardware-accelerated 3D flips using CSS `preserve-3d`.
-   **Local High Scores**: Persists top scores and names using `localStorage`, filtering out junk data.
-   **Responsive Design**: Fully adapts to different screen sizes, from mobile to desktop.
-   **Professional UX**: Replaced annoying browser alerts with custom modals for a seamless experience.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Time and a sharp memory!
-   [Node.js](https://nodejs.org/) (optional, only for running the local dev server)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/memory-game.git
    cd memory-game
    ```

2.  **Run the project**
    We use `npx` to serve the static files easily.
    ```bash
    npm run dev
    ```
    This will start a local server at `http://localhost:3000`.

## 🎮 How to Play

1.  **Flip Cards**: Click on a card to reveal its symbol.
2.  **Match Pairs**: Find the matching symbol to clear the pair.
3.  **Win**: Match all pairs before the timer runs out or you run out of lives!
4.  **Save Score**: If you win, enter your name to save your high score.

## 🛠️ Built With

-   **HTML5** - Semantic structure
-   **CSS3** - Glassmorphism, CSS Grid, 3D Transforms
-   **JavaScript (ES6+)** - Game logic and DOM manipulation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
