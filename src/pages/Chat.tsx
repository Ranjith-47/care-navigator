import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ChatInterface />
    </div>
  );
};

export default Chat;
