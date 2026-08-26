Syntaxdle
A full-stack Wordle-inspired game with a computer science twist.

Play classic Wordle or switch to Syntaxdle to test your knowledge of CS-related terms.

Features
Wordle-style gameplay
Computer science-themed game mode
User authentication with bcrypt and sessions
Persistent wins, games, and streak statistics
Server-side validation and rate limiting
Persistent game state
Tech Stack
Frontend: React, Vite, JavaScript, CSS
Backend: Node.js, Express
Database: PostgreSQL
Authentication: bcrypt, express-session

Getting Started
git clone https://github.com/aimbxt/Syntaxdle.git
cd Syntaxdle

# Backend
cd "Wordle Clone/backend"
npm install
npm run dev

# Frontend
cd "../frontend"
npm install
npm run dev
Create a .env file in the backend with your PostgreSQL credentials and session secret.

Built for CS students, developers, and anyone who enjoys a challenge.
