😸 Exploding Kitten
Welcome to the Exploding Kitten card game! 🎉 This project is a web-based implementation of the popular card game with a single-player twist.

🧰 Setup Instructions
Prerequisites
-Go
-Redis
-React

Backend Setup:
1. Clone the repository:
   git clone https://github.com/VanshajBisht09/Exploding-Kitten-Game.git
   cd exploding-kitten

2. Navigate to the backend directory:
   cd backend
   
4. Install dependencies:
   go mod tidy

5. Run the server:
   go run main.go

Frontend Setup:
1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

Redis Setup:
1. Start the Redis server:
   redis-server

2. Configure the backend to connect to Redis (update config.yaml or .env with Redis host and port if necessary).


🚀 Features
-Interactive Gameplay: Draw random cards from a deck and try your luck!
-Leaderboard: Track your wins and compete with others.
-Real-time Updates: View live changes on the leaderboard.
-Game Persistence: Continue where you left off with automatic save functionality.
-Simple Rules:
#Draw all cards without triggering the Exploding Kitten 💣 to win!
#Use strategy to shuffle, defuse, and avoid the bomb.


This will be an online single-player card game that consists of 4 different types of cards
- Cat Card 😼: Simply removed from the deck when drawn.
- Defuse Card 🙅‍♂️: Can defuse an Exploding Kitten card if drawn later.
- Shuffle Card 🔀: Reshuffles the deck with 5 new cards.
- Exploding Kitten Card 💣: Causes the player to lose immediately if not defused.

There will be a button to start the game. When the game is started there will be a deck of 5 cards ordered randomly. Each time user clicks on the deck a card is revealed and that card is removed from the deck. A player wins the game once he draws all 5 cards from the deck and there is no card left to draw.

Rules –
- If the card drawn from the deck is a cat card, then the card is removed from the deck.
- If the card is exploding kitten (bomb) then the player loses the game.
- If the card is a defusing card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.
- If the card is a shuffle card, then the game is restarted and the deck is filled with 5 cards again.

