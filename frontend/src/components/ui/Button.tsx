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
       w-full mt-4
  bg-blue-600 
  hover:bg-blue-500 
  text-white 
  py-2 
  rounded-lg 
  transition 
  shadow-md 
  hover:shadow-blue-500/30
      "
    >
      {children}
    </button>
  );
}