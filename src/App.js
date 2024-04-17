import React, { useState, useEffect } from "react";
import "./App.scss";

function Game() {
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("gameHistory")) || [Array(9).fill(null)],
  );
  const [currentMove, setCurrentMove] = useState(
    parseInt(localStorage.getItem("currentMove"), 10) || 0,
  );
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    localStorage.setItem("gameHistory", JSON.stringify(history));
    localStorage.setItem("currentMove", String(currentMove));
  }, [history, currentMove]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    if (nextMove === 0) {
      setHistory([Array(9).fill(null)]);
    }
  }

  function calculateWinner(squares) {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  }

  function isDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        return false;
      }
    }
    return true;
  }

  let result = calculateWinner(currentSquares);
  let winner = result ? result.winner : null;
  let winningLine = result ? result.line : null;

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw(currentSquares)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (currentSquares[i] || winner) {
      return;
    }
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    handlePlay(nextSquares);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to new game";
    }
    return (
      <li key={move}>
        <button className="return-button" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <h1 className="game-name">TIC TAC GAME</h1>
        <div className="board">
          {currentSquares.map((value, index) => (
            <button
              key={index}
              className={
                "square" +
                (winningLine && winningLine.includes(index) ? " winner" : "")
              }
              onClick={() => handleClick(index)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="status">{status}</div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

export default Game;
