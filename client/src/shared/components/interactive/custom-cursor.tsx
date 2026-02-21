import { useCustomCursor } from "@/shared/hooks/use-custom-cursor";

export default function CustomCursor() {
  const { cursorPosition, isClicking } = useCustomCursor();

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={`w-4 h-4 border border-white ${isClicking ? "bg-white" : ""}`} />
    </div>
  );
}
