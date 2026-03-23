import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Lobby from "../pages/Lobby";
import Matchmaking from "../pages/Matchmaking";
import Leaderboard from "../pages/Leaderboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}