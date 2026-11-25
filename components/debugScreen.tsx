import { mouseCoords } from "@/types";

type DebugScreenProps = {
  isLoaded: boolean,
  mousePos?: mouseCoords
}

export default function DebugScreen({ isLoaded, mousePos}: DebugScreenProps) {
  const x = mousePos?.x ?? 0;
  const y = mousePos?.y ?? 0;

  return (
    <div className="text-black opacity-50 absolute h-screen w-screen flex flex-col text-left pointer-events-none">
      <div>
        {"isLoaded: " + isLoaded}
      </div>
      <div>
        {"\ncoords" + `(${x.toLocaleString()},${y.toLocaleString()})`}
      </div>
    </div>
  );
}
