import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";

const createDeck = () => {
  const cardPool = [
    "Cat 😼",
    "Cat 😼",
    "Cat 😼",
    "Cat 😼",
    "Cat 😼",
    "Defuse 🙅‍♂️",
    "Shuffle 🔀",
    "Exploding Kitten 💣",
    "Exploding Kitten 💣",
  ];
  let deck = [];
  while (deck.length < 5) {
    const randomIndex = Math.floor(Math.random() * cardPool.length);
    deck.push(cardPool[randomIndex]);
    cardPool.splice(randomIndex, 1);
  }
  return deck;
};

const Game = () => {
  const dispatch = useDispatch();
  const { deck, gameStatus, username, usernameValid, defuseCount } =
    useSelector((state) => state);

  const [leaderboard, setLeaderboard] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:8080/leaderboard");
      const data = await response.json();
      console.log(data);
      setLeaderboard(data.message ? [] : data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const startGame = () => {
    const newDeck = createDeck();
    setCardsInPlay(newDeck.slice(0, 5));
    setFlippedCards({});
    dispatch({ type: "START_GAME", payload: { deck: newDeck } });
  };

  const selectCard = async (index) => {
    if (!usernameValid || flippedCards[index]) return;

    const card = cardsInPlay[index];
    setFlippedCards((prev) => ({ ...prev, [index]: true }));

    console.log(card);
    // Handle special cards
    if (card === "Exploding Kitten 💣") {
      if (defuseCount > 0) {
        dispatch({ type: "DECREMENT_DEFUSE" });
        alert("Defuse card used to save yourself!");
      } else {
        setTimeout(async () => {
          dispatch({ type: "SET_GAME_STATUS", payload: "lost" });
          await saveScore(cardsInPlay.length);
          await fetchLeaderboard();
        }, 500);
      }
    } else if (card === "Defuse 🙅‍♂️") {
      dispatch({ type: "INCREMENT_DEFUSE" });
    } else if (card === "Shuffle 🔀") {
      setTimeout(async () => {
        setFlippedCards({});
      }, 400);
      setTimeout(async () => {
        const newDeck = createDeck();
        setCardsInPlay(newDeck.slice(0, 5));
      }, 800);
      return;
    }

    // Check if all cards are flipped
    if (Object.keys(flippedCards).length + 1 === cardsInPlay.length) {
      dispatch({ type: "SET_GAME_STATUS", payload: "won" });
      await saveScore(cardsInPlay.length);
      await fetchLeaderboard();
    }
  };

  const saveScore = async (score) => {
    try {
      const response = await fetch("http://localhost:8080/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score }),
      });

      const data = await response.json();
      if (data.status === "success") {
        console.log("Score saved successfully");
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const restartGame = () => {
    const newDeck = createDeck();
    setCardsInPlay([]);
    setFlippedCards({});
    dispatch({ type: "SET_GAME_STATUS", payload: "not_started" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-purple-800 via-pink-600 to-red-500 text-white flex flex-col items-center justify-start font-nunito">
      {/* Current Player Display */}
      {gameStatus === "playing" && (
        <div className="absolute top-6 left-6 bg-blue-700 text-white py-2 px-4 rounded-xl shadow-lg text-lg font-bold">
          Current Player: {username}
        </div>
      )}
      <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-8 mt-12">
        Exploding Kitten Game 😸
      </h1>
      <div className="flex flex-row justify-center gap-6 w-full p-2">
        <div className="flex flex-row justify-between h-[70vh] gap-6 w-full p-4">
          {/* Left Panel: Leaderboard */}
          <div className="flex flex-col bg-gradient-to-r from-white to-gray-100 text-gray-900 p-6 rounded-lg shadow-lg w-1/5 max-h-[80vh] overflow-y-auto border-2 border-gray-300">
            <Leaderboard leaderboard={leaderboard} />
          </div>
          {/* Center Panel: Game Area */}
          <div className="flex flex-col items-center justify-center w-2/4">
            {gameStatus === "not_started" && (
              <div className="flex flex-col items-center gap-6">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) =>
                    dispatch({ type: "SET_USERNAME", payload: e.target.value })
                  }
                  className="w-80 h-14 p-4 rounded-xl border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-800 text-lg shadow-md"
                />
                <button
                  onClick={startGame}
                  disabled={!usernameValid}
                  className="w-64 h-14 px-6 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:bg-gray-400 shadow-lg transition-transform transform hover:scale-105 disabled:scale-100"
                >
                  Start Game
                </button>
              </div>
            )}

            {gameStatus === "playing" && (
              <div className="flex flex-col items-center gap-6 mt-6">
                <h2 className="text-2xl font-bold mb-4">Pick a card:</h2>
                <div className="grid grid-cols-5 gap-6">
                  {cardsInPlay.map((card, index) => (
                    <div
                      key={index}
                      className={`relative w-40 h-64 cursor-pointer perspective ${
                        flippedCards[index]
                          ? ""
                          : "hover:scale-105 transition-transform"
                      }`}
                      onClick={() => selectCard(index)}
                    >
                      <div
                        className={`w-full h-full absolute transform-style-3d duration-500 ${
                          flippedCards[index] ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Back Face */}
                        <div className="absolute w-full h-full bg-blue-700 rounded-lg backface-hidden text-center shadow-lg flex items-center justify-center text-2xl font-bold">
                          ?
                        </div>

                        {/* Front Face */}
                        <div className="absolute w-full h-full bg-white rounded-lg backface-hidden text-center shadow-lg rotate-y-180 flex items-center justify-center text-2xl font-bold text-gray-800 ">
                          {card}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>Defused cards: {defuseCount}</div>
              </div>
            )}

            {gameStatus === "won" && (
              <p className="text-2xl font-bold text-green-400 mt-6">
                Congratulations! You Won!
              </p>
            )}
            {gameStatus === "lost" && (
              <p className="text-2xl font-bold text-red-400 mt-6">
                Oh no! You Lost!
              </p>
            )}

            {(gameStatus === "won" || gameStatus === "lost") && (
              <button
                onClick={restartGame}
                className="mt-4 px-6 py-2 bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Restart Game
              </button>
            )}
          </div>

          {/* Right Panel: Rule Book */}
          <div className="flex flex-col bg-gradient-to-r from-white to-gray-100 text-gray-900 p-6 rounded-lg shadow-lg w-1/5 max-h-[80vh] overflow-y-auto border-2 border-gray-300">
            <h2 className="text-2xl mt-2 font-extrabold text-center text-purple-700">
              📝 Rule Book
            </h2>
            <ul className="list-none space-y-4 text-lg mt-8">
              <li className="flex items-start space-x-2">
                <span>🎴</span>
                <p>Each player takes turns picking a card from the deck.</p>
              </li>
              <li className="flex items-start space-x-2">
                <span>💣</span>
                <p>
                  If you pick an Exploding Kitten, use a Defuse card to survive.
                </p>
              </li>
              <li className="flex items-start space-x-2">
                <span>❌</span>
                <p>No Defuse card? You lose!</p>
              </li>
              <li className="flex items-start space-x-2">
                <span>🔄</span>
                <p>Special cards like Shuffle can mix up the deck.</p>
              </li>
              <li className="flex items-start space-x-2">
                <span>🏆</span>
                <p>Clear all cards to win the game!</p>
              </li>
            </ul>
            <p className="mt-auto text-center text-xl font-bold text-purple-700">
              Master the rules, and let the game begin! 🐾
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Leaderboard = ({ leaderboard }) => (
  <div>
    <h2 className="text-2xl mt-2 font-extrabold text-center text-purple-700">
      🏅 Leaderboard
    </h2>
    <ul className="list-decimal space-y-4 text-lg mt-8">
      {leaderboard.map((player, index) => (
        <li key={index} className="flex justify-between items-center">
          {/* <span>{player}</span> */}
          <span className="font-bold text-purple-700">{player.Member}</span>
          <span className="text-purple-700 font-extrabold">
            {player.Score} pts
          </span>
        </li>
      ))}
    </ul>
    <p className="mt-auto text-center text-xl font-bold text-purple-700">
      Keep climbing the leaderboard! 🌟
    </p>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}

export default App;
