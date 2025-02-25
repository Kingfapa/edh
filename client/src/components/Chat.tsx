import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { User } from "./User";
import { Box } from "@mantine/core";
import { MessagePanel } from "./MessagePanel";

export const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    socket.on("connect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
      setUsers([...users]);
    });

    socket.on("disconnect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
      setUsers([...users]);
    });

    const initReactiveProperties = (user: User) => {
      user.connected = true;
      user.messages = [];
      user.hasNewMessages = false;
    };

    socket.on("users", (users: User[]) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // put the current user first, and sort by username
      users = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers([...users]);
    });

    socket.on("user connected", (user) => {
      initReactiveProperties(user);
      setUsers((users) => [...users, user]);
    });

    socket.on("user disconnected", (id) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
      setUsers([...users]);
    });

    socket.on("private message", ({ content, from }) => {
      console.log("private message");
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false,
          });
          if (user !== selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
      setUsers([...users]);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, [selectedUser, users]);

  const selectUser = (user: User) => {
    setSelectedUser(user);
    user.hasNewMessages = false;
  };

  const onMessage = (content: string) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      selectedUser.messages.push({
        content,
        fromSelf: true,
      });
      setSelectedUser(selectedUser);
    }
  };

  return (
    <>
      <Box
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "260px",
          overflowX: "hidden",
          backgroundColor: "#3f0e40",
          color: "white",
        }}
      >
        {users.map((user) => (
          <User
            key={user.userID}
            user={user}
            selected={selectedUser === user}
            onSelect={() => selectUser(user)}
          />
        ))}
      </Box>
      {selectedUser ? (
        <Box className="right-panel" style={{ marginLeft: "260px" }}>
          <MessagePanel onMessage={onMessage} user={selectedUser} />
        </Box>
      ) : null}
    </>
  );
};
