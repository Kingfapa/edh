import { socket } from "@/lib/socket";
import { Flex, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";

export const SocketStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", () => {
      onConnect();
    });
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [isConnected]);
  return (
    <Flex position="fixed" bottom="0" right="0" p="3" direction={"column"}>
      <Text
        weight={"bold"}
        style={{
          textDecoration: "underline",
        }}
      >
        Socket Status
      </Text>
      <Text>Connected: {isConnected ? "Yes" : "No"}</Text>
      <Text>Transport: {transport}</Text>
    </Flex>
  );
};
