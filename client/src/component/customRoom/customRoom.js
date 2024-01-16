import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Game from "../game/game";
import { getUserProfile } from "../../api/user.api";
import { fetchRoomApi } from "../../api/game.api";
import io from "socket.io-client";
import ConfettiComponent from "../confetti/confetti";

const socket = io("http://localhost:5001");

const CustomRoom = () => {
  const [userGame, setUserGame] = useState({
    user: "",
    game: "",
    state: "none"
  });
  
  const { roomCode } = useParams();
  const isMounted = useRef(true);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        userData.status && setUserGame((prev) =>( { ...prev, user: userData.data }));
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchGameData = async () => {
      if (isMounted.current) {
        isMounted.current = false;
        return;
      }
      const res = await fetchRoomApi(roomCode);
      if (!res.status) {
        return;
      }
      socket.emit("gameData", res.data);
      setUserGame((prev) => ({...prev, game: res.data }));
    };
    fetchGameData();
  }, [roomCode]);

  useEffect(() => {
    socket.on("recieveGameData", (updatedGameData) => {
      setUserGame( (prev) =>( {...prev,
        game: updatedGameData,
      }));
    });
    return () => {
      socket.off("recieveGameData");
    };
  }, [socket]);


  return (
    <div>
      
      <div className="container">
        <div className="row pt-2">
          <div className="col-12 text-center">
            <p className="">
              {userGame.user && userGame.game && userGame?.user?.email === userGame?.game?.playerO?.email
                ? "You have joined the game successfully: "
                : "Share it with your friend to join the room: "}
              <span className="fw-semibold">{roomCode}</span>
            </p>
          </div>
        </div>
        <div className="row d-flex flex-column-reverse flex-sm-row pt-3 mb-3 mb-sm-0  g-0">
          <div className="col-12 col-sm-5 col-md-6 d-flex justify-content-center align-items-center flex-column">
            {userGame?.game && (
              <Game
                setUserGame={setUserGame}
                roomCode={roomCode}
                userGame={userGame}
              />
            )}
            <button
              className="btn btn-warning mt-3"
              onClick={() => window.location.reload(false)}
            >
              Refresh
            </button>
          </div>
          <div className="col-12 mb-4 ps-2 ps-sm-5 col-sm-7 col-md-6">
            <div className="col-12 col-xl-6">
              Your Sybmol:{" "}
              {userGame.user &&
              userGame?.game &&
              userGame?.game?.playerX?.email &&
              userGame?.user?.email === userGame?.game?.playerX?.email
                ? "X"
                : "O"}
            </div>
            <div className="col-12 col-xl-6">
              Turn:{" "}
              {userGame?.game && userGame?.user && userGame?.game?.winner
                ? userGame?.game?.winner === "none"
                  ? "Match Tie"
                  : <>Game is completed & winner is 
                      {userGame?.game?.winner }
                    <ConfettiComponent /> </>
                : (userGame?.game?.turn === "X" && userGame?.user?.email === userGame?.game?.playerX?.email) ||
                  (userGame?.game?.turn === "O" && userGame?.user?.email === userGame?.game?.playerO?.email)
                ? "Your Turn"
                : "Opponent Turn"}
            </div>
            <div className="col-12 col-xl-6">
              Opponent:{" "}
              {userGame?.game && userGame?.user
                ? userGame?.user?.email === userGame?.game?.playerX?.email
                  ? userGame?.game?.playerO?.name || "Waiting for opponent..."
                  : userGame?.game?.playerX?.name
                : " "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomRoom;
