// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { startMatchmaking } from "../services/nakama/match";
// import Modal from "../components/ui/Modal";

// export default function Matchmaking() {
//   const navigate = useNavigate();

//   const startedRef = useRef(false);
//   const cancelledRef = useRef(false);
//   const navigatedRef = useRef(false);

//   const socketRef = useRef<any>(null);
//   const ticketRef = useRef<string | null>(null);

//   const [showCancelModal, setShowCancelModal] = useState(false);

// useEffect(() => {
//   cancelledRef.current = false;

//   const findMatch = async () => {
//     try {
//       console.log("🔍 Starting matchmaking...");

//       const { match, socket, ticketId } = await startMatchmaking();

//       if (cancelledRef.current) return;

//       socketRef.current = socket;
//       ticketRef.current = ticketId;

//       if (navigatedRef.current) return;
//       navigatedRef.current = true;

//       console.log("🚀 Match found, navigating...");

//       navigate("/game", {
//         state: {
//           matchId: match.match_id,
//           isAutomated: true,
//         },
//       });
//     } catch (err) {
//       if (!cancelledRef.current) {
//         console.error("❌ Matchmaking failed:", err);
//       }
//     }
//   };

//   findMatch();

//   return () => {
//     console.log("🧹 Component unmounted (no auto cancel)");

//     cancelledRef.current = true;

//     if (socketRef.current) {
//       // socketRef.current.onmatchmakermatched = null;
//       socketRef.current.onmatchmakermatched = () => {};
//     }
//   };
// }, []);

//   /**
//    * ❌ USER CANCEL
//    */
//   const handleCancel = () => {
//     cancelledRef.current = true;

//     if (socketRef.current && ticketRef.current) {
//       try {
//         socketRef.current.removeMatchmaker(ticketRef.current);
//         console.log("🧹 Matchmaker cancelled (manual)");
//       } catch (e) {
//         console.warn("Cancel failed:", e);
//       }
//     }

//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
      
//       {/* 🎯 Title */}
//       <h1 className="text-4xl font-bold mb-2">
//         Finding Opponent...
//       </h1>

//       {/* 💡 Subtitle */}
//       <p className="text-zinc-400 mb-6">
//         Matching you with a player of equal skill
//       </p>

//       {/* ⚡ Loader */}
//       <div className="flex gap-3 mb-8">
//         <div className="w-4 h-4 bg-white rounded-full animate-bounce" />
//         <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-150" />
//         <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-300" />
//       </div>

//       {/* 🎮 Status */}
//       <p className="text-sm text-zinc-500 mb-10 animate-pulse">
//         Searching for players...
//       </p>

//       {/* ❌ Cancel */}
//       <button
//         onClick={() => setShowCancelModal(true)}
//         className="px-6 py-2 border border-white/30 rounded-lg hover:bg-white hover:text-black transition"
//       >
//         Cancel
//       </button>

//       {/* 🧠 Modal */}
//       <Modal
//         isOpen={showCancelModal}
//         title="Cancel Matchmaking?"
//         message="You will stop searching for a match."
//         confirmText="Yes, Cancel"
//         cancelText="Stay"
//         onCancel={() => setShowCancelModal(false)}
//         onConfirm={handleCancel}
//       />
//     </div>
//   );
// }


export default function Matchmaking() {
  return (
    <div>Matchmaking</div>
  )
}
