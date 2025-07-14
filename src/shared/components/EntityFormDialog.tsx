import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface EntityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  trigger: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitButtonText: string;
}

const EntityFormDialog: React.FC<EntityFormDialogProps> = ({
  open,
  onOpenChange,
  title,
  trigger,
  onSubmit,
  children,
  submitButtonText,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sakura-red">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <button
            type="submit"
            className="w-full bg-sakura-red hover:bg-sakura-red-dark text-white rounded px-4 py-2 mt-2"
          >
            {submitButtonText}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EntityFormDialog; 