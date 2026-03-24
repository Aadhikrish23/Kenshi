export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
  bg-white/5 
  backdrop-blur-xl 
  border border-white/10 
  rounded-2xl 
  p-6 
  shadow-lg 
  hover:shadow-2xl 
  hover:scale-105 
  transition duration-300
"
    >
      {children}
    </div>
  );
}
