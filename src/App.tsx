import { useState } from 'react';
import { useViewerStore } from './stores/viewerStore';
import Header from './components/Layout/Header';
import MachineryGrid from './components/Home/MachineryGrid';
import ViewerPage from './components/Viewer/ViewerPage';
import FlowchartPage from './components/Flowchart/FlowchartPage';

type Page = 'home' | 'viewer' | 'flowchart';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { selectedMachinery, setSelectedMachinery } = useViewerStore();

  const handleSelectMachinery = (id: string) => {
    setSelectedMachinery(id);
    setCurrentPage('viewer');
  };

  const handleBack = () => {
    setCurrentPage('home');
    setSelectedMachinery(null);
  };

  const handleFlowchart = () => {
    setCurrentPage('flowchart');
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <Header
        currentPage={currentPage}
        onBack={handleBack}
        onFlowchart={handleFlowchart}
        selectedMachinery={selectedMachinery}
      />
      
      <div className="flex-1 overflow-hidden">
        {currentPage === 'home' && (
          <MachineryGrid onSelect={handleSelectMachinery} />
        )}
        {currentPage === 'viewer' && selectedMachinery && (
          <ViewerPage machineryId={selectedMachinery} />
        )}
        {currentPage === 'flowchart' && (
          <FlowchartPage />
        )}
      </div>
    </div>
  );
}

export default App;
