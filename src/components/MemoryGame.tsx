"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import RankingModal from "./RankingModal";

// Typy danych dla kart
type Card = {
  id: number;
  image: string;
  backImage: string;
  flipped: boolean;
};

type PlayerScore = {
  name: string;
  moves: number;
};

const imagePairs: string[] = [
  "/images/Climat.jpg",
  "/images/Deforest.jpg",
  "/images/NoiseP.jpg",
  "/images/Pestic.jpg",
  "/images/SoilP.jpg",
  "/images/Water.jpg",
];

const backImages = [
  "/images/Triangle.png",
  "/images/Square.png",
  "/images/Star.png",
];

const MemoryGame: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [ranking, setRanking] = useState<PlayerScore[]>([]);
  const [showRanking, setShowRanking] = useState<boolean>(false);
  const [showCongratulations, setShowCongratulations] = useState<boolean>(false);

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (showCongratulations) {
      const timer = setTimeout(() => {
        setShowCongratulations(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCongratulations]);

  const initializeGame = () => {
    const shuffledCards: Card[] = [...imagePairs, ...imagePairs.map(img => img.replace(".jpg", "2.jpg"))]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image, // Obraz przodu karty
        backImage: backImages[Math.floor(Math.random() * backImages.length)], // Losowy obraz tyłu
        flipped: false,
      }));

    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setShowCongratulations(false);
  };

  const handleNewGame = () => {
    setPlayerName("");
    setGameStarted(false);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2 || matchedCards.includes(index)) return;

    const newCards = cards.map((card, i) =>
      i === index ? { ...card, flipped: true } : card
    );

    setCards(newCards);
    setSelectedCards([...selectedCards, index]);
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;

      if (cards[first].image.replace("2.jpg", ".jpg") === cards[second].image.replace("2.jpg", ".jpg")) {
        setMatchedCards([...matchedCards, first, second]);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              selectedCards.includes(index) ? { ...card, flipped: false } : card
            )
          );
        }, 1000);
      }
      setSelectedCards([]);
      setMoves((prevMoves) => prevMoves + 1);
    }
  }, [selectedCards, cards]);

  useEffect(() => {
    if (matchedCards.length === cards.length && gameStarted) {
      setRanking((prevRanking) => [...prevRanking, { name: playerName, moves }]);
      setShowCongratulations(true);
      setShowRanking(true);
    }
  }, [matchedCards]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center mt-10  font-serif text-yellow-800">
        <h1 className="text-2xl font-bold">Enter your name:</h1>
        <input
          type="text"
          className="border p-2 mt-2"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          className="mt-4 px-4 py-2 bg-yellow-700 text-white rounded"
          onClick={() => setGameStarted(true)}
          disabled={!playerName.trim()}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative text-yellow-800">
      {showCongratulations && (
        <div className="absolute top-10 bg-green-500 text-white p-4 rounded shadow-lg z-50 text-lg font-semibold">
          🎉 Congratulations, {playerName}! You completed the game in {moves} moves! 🎉
        </div>
      )}
<h1 className="text-4xl font-bold mb-6">Welcome, {playerName}!</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
          key={card.id}
          className="w-24 h-24 cursor-pointer perspective"
          onClick={() => handleCardClick(index)}
        >
          {/* Cała karta obraca się! */}
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              card.flipped ? "rotate-y-180" : ""
            } border-4 border-yellow-700 rounded-lg shadow-md`}
          >
            {/* Tył karty (gdy zakryta) */}
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white rounded-lg">
              <Image
                src={card.backImage}
                alt="Back of Card"
                width={96}
                height={96}
                className="rounded-lg"
              />
            </div>
        
            {/* Przód karty (gdy odkryta) */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-white rounded-lg">
              <Image
                src={card.image}
                alt="Card"
                width={96}
                height={96}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
        
        
        
        ))}
      </div>
      <p className="mt-4 text-lg font-medium">Moves: {moves}</p>
      <div className="flex gap-4 mt-4">
        <button className="px-5 py-2 bg-yellow-900 text-white rounded" onClick={handleNewGame}>
          New Game
        </button>
        <button className="px-5 py-2 bg-yellow-900 text-white rounded" onClick={initializeGame}>
          Reset
        </button>
        <button className="px-5 py-2 bg-yellow-900 text-white rounded" onClick={() => setShowRanking(true)}>
          Show Ranking
        </button>
      </div>
      <RankingModal show={showRanking} ranking={ranking} onClose={() => setShowRanking(false)} />
    </div>
  );
};

export default MemoryGame;