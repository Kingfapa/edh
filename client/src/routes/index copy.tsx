import { Chat } from "@/components/Chat";
import { SelectUsername } from "@/components/SelectUsername";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";

export const Home = () => {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);

  return (
    (!usernameAlreadySelected && (
      <SelectUsername
        onSubmit={(username) => {
          setUsernameAlreadySelected(true);
          socket.auth = { username };
          socket.connect();
        }}
      />
    )) || <Chat />
  );
};
