import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
      
      <div className="w-full max-w-4xl px-4">

        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-10 tracking-wide">
          Kenshi
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card>
            <h2 className="text-xl font-semibold mb-4">Private Match</h2>
            <Button onClick={() => navigate("/lobby")}>
              Create / Join Room
            </Button>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Play Online</h2>
            <Button onClick={() => navigate("/matchmaking")}>
              Auto Matchmaking
            </Button>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
            <Button onClick={() => navigate("/leaderboard")}>
              View Rankings
            </Button>
          </Card>

        </div>

      </div>
    </div>
  );
}