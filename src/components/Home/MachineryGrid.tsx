import { machineryList } from '../../data/machineryData';
import MachineryCard from './MachineryCard';

interface MachineryGridProps {
  onSelect: (id: string) => void;
}

export default function MachineryGrid({ onSelect }: MachineryGridProps) {
  return (
    <div className="w-full h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            학습할 기계 장비를 선택하세요
          </h2>
          <p className="text-lg text-gray-600">
            3D 뷰어를 통해 기계의 구조를 탐험하고 학습하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {machineryList.map((machinery) => (
            <MachineryCard
              key={machinery.id}
              machinery={machinery}
              onSelect={() => onSelect(machinery.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
