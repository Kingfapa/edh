import { BrowserRouter, Routes, Route } from "react-router";
import { Room } from "./routes/room.tsx";
// import { Home } from "./routes/index.tsx";
import "@mantine/core/styles.css";
import { Table2Page } from "./routes/table2.page.tsx";
import { SocketStatus } from "./components/SocketStatus.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Table2Page />} />
        <Route path="/:room" element={<Room />} />
      </Routes>
      <SocketStatus />
    </BrowserRouter>
  );
}

export default App;
