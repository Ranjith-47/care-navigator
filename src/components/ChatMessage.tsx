import { Bot, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isRedFlag?: boolean;
}

const ChatMessage = ({ role, content, timestamp, isRedFlag }: ChatMessageProps) => {
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-up',
        isAssistant ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full',
          isAssistant
            ? isRedFlag
              ? 'bg-danger-light'
              : 'bg-medical-blue-light'
            : 'bg-secondary'
        )}
      >
        {isAssistant ? (
          isRedFlag ? (
            <AlertTriangle className="h-5 w-5 text-danger" />
          ) : (
            <Bot className="h-5 w-5 text-medical-blue" />
          )
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
          isAssistant
            ? isRedFlag
              ? 'bg-danger-light border border-danger/20 rounded-tl-sm'
              : 'bg-card border border-border rounded-tl-sm'
            : 'bg-medical-blue text-primary-foreground rounded-tr-sm'
        )}
      >
        <p className={cn(
          'text-sm leading-relaxed whitespace-pre-wrap',
          isAssistant ? 'text-foreground' : 'text-primary-foreground'
        )}>
          {content}
        </p>
        <p
          className={cn(
            'mt-2 text-xs',
            isAssistant ? 'text-muted-foreground' : 'text-primary-foreground/70'
          )}
        >
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
