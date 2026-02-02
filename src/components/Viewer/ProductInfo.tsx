import { Machinery } from '../../types';
import ReactMarkdown from 'react-markdown';

interface ProductInfoProps {
  machinery: Machinery;
}

export default function ProductInfo({ machinery }: ProductInfoProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{machinery.name}</h2>
      <p className="text-gray-600 mb-4">{machinery.description}</p>
      
      <div className="prose prose-sm">
        <ReactMarkdown>{machinery.theory}</ReactMarkdown>
      </div>
    </div>
  );
}
