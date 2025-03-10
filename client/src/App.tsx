import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { BrowserRouter, Routes, Route } from "react-router";
import { Room } from "./routes/room.tsx";
// import { Home } from "./routes/index.tsx";
import { Box, MantineProvider, Text } from "@mantine/core";
import "@mantine/core/styles.css";
import { TablePage } from "./routes/table.page.tsx";

const SocketStatus = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    console.log("i ran");
    if (socket.connected) {
      onConnect();
    }

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
      console.log("i am connected");
    });
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [isConnected]);
  return (
    <Box pos="fixed" bottom="0" right="0" p={3}>
      <Text
        fw={700}
        style={{
          textDecoration: "underline",
        }}
      >
        Socket Status
      </Text>
      <Text>Connected: {isConnected ? "Yes" : "No"}</Text>
      <Text>Transport: {transport}</Text>
    </Box>
  );
};

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<TablePage />} />
          <Route path="/:room" element={<Room />} />
        </Routes>
        <SocketStatus />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
