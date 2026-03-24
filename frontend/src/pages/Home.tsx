import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, login, logout } from "../services/nakama/auth";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
 
  const [loading, setLoading] = useState(false);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
  }, []);

  const handleLogin = async () => {
  try {
     setLoading(true);
     
    const session = await login();
    
    await delay(1000)

    setUser({
      id: session.user_id,
      username: session.username,
    });
    localStorage.setItem("session", JSON.stringify(session));

  } catch (err) {
    console.error("❌ Login failed:", err);
  }
  finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    setLoading(true);

  // optional delay for smooth UX
  setTimeout(() => {
    logout();
    localStorage.removeItem("session");
    setUser(null);
    setLoading(false);
  }, 800);
  };

  // ✅ IMPORTANT: render GameBoard here (NOT inside function)

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
      <div className="absolute top-6 right-6">
  {!user ? (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="px-5 py-2 bg-white text-black rounded-lg font-medium flex items-center gap-2 hover:opacity-80 transition disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          Logging in...
        </>
      ) : (
        "Login"
      )}
    </button>
  ) : (
    <div className="flex items-center gap-3">
      
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
        {user.username?.[0]?.toUpperCase() || "P"}
      </div>

      {/* Username */}
      <div className="text-sm text-zinc-300">
        {user.username}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-black transition flex items-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Logging out...
          </>
        ) : (
          "Logout"
        )}
      </button>
    </div>
  )}
</div>

      <div className="w-full max-w-4xl px-4">
        <h1
          className="text-5xl font-bold text-center mb-10 tracking-wide 
  bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent"
        >
          Kenshi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Private Match</h2>
            <Button onClick={() => navigate("/lobby")}>
              Create / Join Room
            </Button>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Play Online</h2>
            {/* <Button onClick={handleMatchmaking}>
              Auto Matchmaking
            </Button> */}
            <Button onClick={() => navigate("/matchmaking")}>
              Auto Matchmaking
            </Button>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
            <Button
              onClick={() => {
                const session = getSession();

                if (!session) {
                  alert("Login required");
                  return;
                }
                navigate("/leaderboard");
              }}
            >
              View Rankings
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
