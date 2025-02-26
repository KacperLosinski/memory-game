"use client";

import React from "react";

type RankingModalProps = {
  show: boolean;
  ranking: { name: string; moves: number }[];
  onClose: () => void;
};

const RankingModal: React.FC<RankingModalProps> = ({ show, ranking, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded relative w-80">
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Ranking</h2>
        <ul>
          {ranking.map((entry, index) => (
            <li key={index} className="border-b py-1">
              {index + 1}. {entry.name}: {entry.moves} moves
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RankingModal;
