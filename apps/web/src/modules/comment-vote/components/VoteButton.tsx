import { Button } from '@workspace/ui/components/button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';

type Props = {
  direction: 'up' | 'down';
  isActive: boolean;
  disabled: boolean;
  onClick?: () => void;
};

export const VoteButton = ({
  direction,
  isActive,
  disabled,
  onClick,
}: Props) => {
  const Icon = direction === 'up' ? ArrowBigUp : ArrowBigDown;

  return (
    <Button
      variant="outline"
      size="icon-sm"
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className={isActive ? 'fill-current' : ''} />
    </Button>
  );
};
