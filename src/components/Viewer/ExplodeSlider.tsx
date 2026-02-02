import { Maximize2, Minimize2 } from 'lucide-react';

interface ExplodeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ExplodeSlider({ value, onChange }: ExplodeSliderProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-4">
        <Minimize2 className="w-5 h-5 text-gray-600" />
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <Maximize2 className="w-5 h-5 text-gray-600" />
      </div>
      <div className="text-center text-sm text-gray-600 mt-2">
        분해도: {Math.round(value * 100)}%
      </div>
    </div>
  );
}
