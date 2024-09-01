// src/Game.js
import React, { useState, useEffect } from 'react';
import './App.css';

const Square = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

const Board = ({ xIsNext, onClick, squares }) => {
  const winner = calculateWinner(squares);
  const isDraw = squares.every(square => square !== null);
  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? 'เสมอ!'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div>
      <div className="status">{status}</div>
      <div>
        {[0, 1, 2].map(row => (
          <div key={row} className="board-row">
            {[0, 1, 2].map(col => (
              <Square
                key={row * 3 + col}
                value={squares[row * 3 + col]}
                onClick={() => onClick(row * 3 + col)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    if (!xIsNext) {
      const bestMove = findBestMove(squares);
      if (bestMove !== null) {
        handleClick(bestMove);
      }
    }
  }, [xIsNext]);

  const handleClick = (i) => {
    const newSquares = squares.slice();
    if (calculateWinner(newSquares) || newSquares[i] || squares.every(square => square !== null)) return;
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(squares);
  const isDraw = squares.every(square => square !== null) && !winner;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          xIsNext={xIsNext}
          onClick={handleClick}
        />
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const findBestMove = (squares) => {
  let bestMove = null;
  let bestScore = -Infinity;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = 'O';
      const score = minimax(squares, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

const minimax = (squares, isMaximizing) => {
  const winner = calculateWinner(squares);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (!squares.includes(null)) return 0;

  const scores = [];
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = isMaximizing ? 'O' : 'X';
      scores.push(minimax(squares, !isMaximizing));
      squares[i] = null;
    }
  }

  return isMaximizing
    ? Math.max(...scores)
    : Math.min(...scores);
};

export default Game;
