import React, { useState } from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { TopNav } from './components/navbar/TopNav';
import { SplitPane } from './components/layout/SplitPane';
import { DocumentViewer } from './components/reader/DocumentViewer';
import { CompanionPanel } from './components/companion/CompanionPanel';
import { UploadModal } from './components/modals/UploadModal';

const WorkspaceContent: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-[#070A11] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <TopNav onOpenUpload={() => setIsUploadOpen(true)} />

      {/* Main Split-Screen Study Canvas */}
      <SplitPane
        left={<DocumentViewer />}
        right={<CompanionPanel />}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceContent />
    </WorkspaceProvider>
  );
}
