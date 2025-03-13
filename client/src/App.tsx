import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { Room } from "./routes/table2.page.tsx";
import { SocketStatus } from "./components/SocketStatus.tsx";
import { Home } from "./routes/index.tsx";

function App() {
  // const { socket } = useSocket({ enabled: false, auth: { username: "test" } });
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/:room" element={<Room />} />
      </Routes>
      <SocketStatus />
    </BrowserRouter>
  );
}

export default App;
