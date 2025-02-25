import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Room = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const params = useParams<{ room: string }>();

  useEffect(() => {
    socket.emit("room:join", params.room);

    socket.on("room:update", (data) => {
      setNumberOfUsers(data);
    });

    return () => {
      socket.off("room:update");
    };
  }, [params.room]);

  useEffect(() => {
    return () => {
      socket.emit("room:leave", params.room);
    };
  }, [params.room]);

  return (
    <>
      <p>Room ID: {params.room}</p>
      <p>Users connected: {numberOfUsers}</p>
    </>
  );
};
