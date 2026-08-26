# Syntaxdle

A full-stack Wordle-inspired game with a **computer science twist**.

Play classic Wordle or switch to **Syntaxdle** to test your knowledge of CS-related terms.

## Features

- **Wordle-style gameplay**
- **Computer science-themed game mode**
- **User authentication** with bcrypt and sessions
- **Persistent statistics** for wins, games, and streaks
- **Server-side validation** and rate limiting
- **Persistent game state**

## Tech Stack

**Frontend:** React, Vite, JavaScript, CSS  
**Backend:** Node.js, Express  
**Database:** PostgreSQL  
**Authentication:** bcrypt, express-session

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aimbxt/Syntaxdle.git
cd Syntaxdle
2. Start the backend
cd "Wordle Clone/backend"
npm install
npm run dev
3. Start the frontend
In a new terminal:

cd "Wordle Clone/frontend"
npm install
npm run dev
Create a .env file in the backend with your PostgreSQL credentials and session secret.

