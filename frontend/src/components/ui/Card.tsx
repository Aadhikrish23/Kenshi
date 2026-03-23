export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white/5 
      backdrop-blur-md 
      border border-white/10 
      rounded-2xl 
      p-6 
      shadow-lg 
      hover:scale-105 
      hover:border-blue-500/50
      transition-all duration-300
    ">
      {children}
    </div>
  );
}