import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { FileViewer } from '@/components/FileViewer';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#1e1e1e]">
      <Sidebar />
      <FileViewer />
      <ChatInterface />
    </div>
  );
}
