import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import Chance from "chance";

const LobbyScreen = () => {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const chance = new Chance();

  const generateRandomName = () => {
    const profession = chance
      .profession()
      .toLocaleLowerCase()
      .replace(" ", "-");
    const animal = chance.animal().toLocaleLowerCase().replace(" ", "-");
    const name = `${profession}-${animal}`;
    return name;
  };

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { userName, room });
    },
    [userName, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { userName, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    const name = generateRandomName();
    setUserName(name);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="lobby">
      <h1>Welcome {userName} 👋🏻</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="room">Room Id</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
