'use client';

import { Button } from '@/components/ui/Button';

export interface ResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ResetButton({ onClick, disabled = false }: ResetButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      Reset Filters
    </Button>
  );
}
