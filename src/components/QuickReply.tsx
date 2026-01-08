import { Button } from '@/components/ui/button';

interface QuickReplyProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

const QuickReply = ({ options, onSelect, disabled }: QuickReplyProps) => {
  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      {options.map((option) => (
        <Button
          key={option}
          variant="medical-outline"
          size="sm"
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="rounded-full text-xs"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default QuickReply;
