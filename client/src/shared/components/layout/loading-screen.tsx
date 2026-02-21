export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-black text-white font-pixel flex items-center justify-center">
      <div className="text-xl glow-text animate-flicker">{message}</div>
    </div>
  );
}
