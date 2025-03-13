import { socket } from "@/lib/socket";
import { Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
// import { useContext } from "react";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("123");
  const [roomId, setRoomId] = useState("123");
  const navigate = useNavigate();

  console.log(socket.connected);

  return (
    <Flex align={"center"} justify={"center"} direction={"column"} gap="4">
      <Flex>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Username
          </Text>
          <TextField.Root
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Password
          </Text>
          <TextField.Root
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </label>
      </Flex>

      <button
        onClick={() => {
          socket.auth = { username };
          socket.connect();
          navigate(`/${roomId}`);
        }}
      >
        Implement me
      </button>
    </Flex>
  );
};
