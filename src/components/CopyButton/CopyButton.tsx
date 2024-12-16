import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from './useCopyToClipboard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Arrow } from '@radix-ui/react-tooltip';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copiedText, setCopy] = useCopyToClipboard();

  const handleCopy = () => {
    setCopy(text);
    // Reset the copied text after 2 seconds
    setTimeout(() => {
      setCopy('');
    }, 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={className}
            onClick={handleCopy}
          >
            {copiedText === text ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={4} className="bg-background text-foreground">
          Copy
          <Arrow className="fill-background" width={12} height={6} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
