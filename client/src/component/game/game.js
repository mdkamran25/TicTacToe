import React, { useEffect, useState, useRef } from "react";
import "./game.css";
import Square from "./square";
import { winningPatterns } from "../../utils/winnigPattern";
import { updateGameApi } from "../../api/game.api";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const Game = ({ setUserGame, roomCode, userGame }) => {
  const isMounted = useRef(true);
  const [recivedSocketData, setRecievedSocketData] = useState(false);
  const checkUpdate = () => {
    const winnerFound = checkWin();
    if (winnerFound) {
      console.log("winner found");
      updateGameData();
      return;
    }

    checkTie();
    updateGameData();
  };
  console.log({ recivedSocketData });
  useEffect(() => {
    function update() {
      // if (isMounted.current) {
      //   isMounted.current = false;
      //   return;
      // }
      if (recivedSocketData) {
        const winnerFound = checkWin();
        if (winnerFound) {
          console.log("winner found");
          updateGameData();
          return;
        }

        checkTie();
        updateGameData();
        console.log("Api called");
      }
    }
    update();
  }, [userGame?.game?.board]);

  useEffect(() => {
    const handleReceiveUpdateGameData = (updatedGameData) => {
      console.log({ updatedGameData });
      if (recivedSocketData) {
        setUserGame((...prev) => ({ ...prev, game: updatedGameData }));
        setRecievedSocketData(!recivedSocketData);
      }
    };

    socket.on("recieveUpdateGameData", handleReceiveUpdateGameData);

    return () => {
      socket.off("recieveUpdateGameData", handleReceiveUpdateGameData);
      // socket.disconnect();
    };
  }, [socket]);

  const updateGameData = async () => {
    try {
      await updateGameApi({
        roomCode: roomCode,
        turn: userGame?.game?.turn,
        board: userGame?.game?.board,
        winner: userGame?.game?.winner,
        status: userGame?.game?.status,
      });

      socket.emit("updateGameData", userGame.game);
    } catch (err) {
      console.log(err.message);
    }
  };

  const chooseSquare = (square) => {
    // checkUpdate()
    if (!userGame?.game?.status) {
      return;
    }

    const { turn, board } = userGame?.game;
    const currentPlayer =
      userGame?.user?.email === userGame?.game?.playerX?.email ? "X" : "O";

    if (turn === currentPlayer && board[square] === "") {
      const updatedBoard = [...board];
      updatedBoard[square] = currentPlayer;

      setUserGame((prev) => ({
        ...prev,
        game: {
          ...prev.game,
          turn: turn === "X" ? "O" : "X",
          board: updatedBoard,
        },
      }));
    }
  };

  const checkWin = () => {
    for (const currentPatterns of winningPatterns) {
      const firstPlayer = userGame?.game?.board[currentPatterns[0]];
      if (firstPlayer === "") continue;

      let foundWinningPatterns = true;

      for (const index of currentPatterns) {
        if (userGame?.game?.board[index] !== firstPlayer) {
          foundWinningPatterns = false;
          break;
        }
      }

      if (foundWinningPatterns) {
        setUserGame((prev) => ({
          ...prev,
          game: {
            ...prev.game,
            winner: userGame.game.board[currentPatterns[0]],
            status: false,
          },
          state: "You won",
        }));
        return true;
      }
    }

    return false;
  };

  const checkTie = () => {
    let filled = true;
    userGame?.game?.board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });
    if (filled) {
      setUserGame((prev) => ({
        ...prev,
        game: { ...prev.game, winner: "none", status: false },
        state: "Match Tie",
      }));
      return true;
    }
  };

  return (
    <div
      className={`board d-flex flex-column justify-content-center align-items-center`}
    >
      <div className="rows">
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(0)}
          value={userGame?.game?.board[0]}
          apiCalled={setRecievedSocketData}
        />
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(1)}
          value={userGame?.game?.board[1]}
          apiCalled={setRecievedSocketData}
        />
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.game?.user}
          chooseSquare={() => chooseSquare(2)}
          value={userGame?.game?.board[2]}
          apiCalled={setRecievedSocketData}
        />
      </div>
      <div className="rows">
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(3)}
          value={userGame?.game?.board[3]}
          apiCalled={setRecievedSocketData}
        />
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(4)}
          value={userGame?.game?.board[4]}
          apiCalled={setRecievedSocketData}
        />
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(5)}
          value={userGame?.game?.board[5]}
          apiCalled={setRecievedSocketData}
        />
      </div>
      <div className="rows">
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(6)}
          value={userGame?.game?.board[6]}
          apiCalled={setRecievedSocketData}
        />
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(7)}
          value={userGame?.game?.board[7]}
          apiCalled={setRecievedSocketData}
        />
        <Square
          turn={userGame?.game?.turn}
          game={userGame?.game}
          user={userGame?.user}
          chooseSquare={() => chooseSquare(8)}
          value={userGame?.game?.board[8]}
          apiCalled={setRecievedSocketData}
        />
      </div>
    </div>
  );
};

export default Game;
