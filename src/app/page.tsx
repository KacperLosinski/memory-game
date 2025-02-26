import MemoryGame from "../components/MemoryGame";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundImage: 'url(/images/Back.jpg)' }}>
      <MemoryGame />
    </div>
  );
}
