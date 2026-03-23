export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full py-3 rounded-xl 
        bg-blue-600 
        hover:bg-blue-500 
        active:scale-95
        transition-all duration-200 
        font-semibold
        shadow-md
      "
    >
      {children}
    </button>
  );
}