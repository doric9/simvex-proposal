import { X } from 'lucide-react';
import { MachineryPart } from '../../types';
import { useViewerStore } from '../../stores/viewerStore';

interface PartInfoProps {
  part?: MachineryPart;
}

export default function PartInfo({ part }: PartInfoProps) {
  const { setSelectedPart } = useViewerStore();

  if (!part) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{part.name}</h3>
        <button
          onClick={() => setSelectedPart(null)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-3">
        {part.material && (
          <div>
            <span className="text-sm font-semibold text-gray-600">재질:</span>
            <p className="text-gray-800">{part.material}</p>
          </div>
        )}
        {part.role && (
          <div>
            <span className="text-sm font-semibold text-gray-600">역할:</span>
            <p className="text-gray-800">{part.role}</p>
          </div>
        )}
        {part.parent && (
          <div>
            <span className="text-sm font-semibold text-gray-600">연결 부품:</span>
            <p className="text-gray-800">{part.parent}</p>
          </div>
        )}
      </div>
    </div>
  );
}
