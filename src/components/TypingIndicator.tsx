import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-medical-blue-light">
        <Bot className="h-5 w-5 text-medical-blue" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-medical-blue animate-typing" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 rounded-full bg-medical-blue animate-typing" style={{ animationDelay: '200ms' }} />
        <span className="h-2 w-2 rounded-full bg-medical-blue animate-typing" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
