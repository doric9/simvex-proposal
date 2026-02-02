import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus } from 'lucide-react';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: '시작' },
    position: { x: 250, y: 5 },
  },
];

const initialEdges: Edge[] = [];

export default function FlowchartPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'default',
      data: { label: `노드 ${nodes.length + 1}` },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">워크플로우 차트</h2>
        <button
          onClick={addNode}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>노드 추가</span>
        </button>
        <p className="text-sm text-gray-600 mt-4">
          노드를 드래그하여 배치하고<br />
          연결하여 워크플로우를 만드세요
        </p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
