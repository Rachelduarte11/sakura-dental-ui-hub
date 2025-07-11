import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { 
  FileText, 
  Download, 
  MessageCircle, 
  Send 
} from 'lucide-react';

interface QuoteActionsProps {
  onSave: () => void;
  onExportPDF: () => void;
  onSendWhatsApp: () => void;
  onSendEmail: () => void;
  disabled?: boolean;
}

const QuoteActions: React.FC<QuoteActionsProps> = ({
  onSave,
  onExportPDF,
  onSendWhatsApp,
  onSendEmail,
  disabled = false
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:relative md:bottom-auto md:border-0 md:bg-transparent md:p-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={onSave}
          disabled={disabled}
          className="bg-sakura-red hover:bg-sakura-red/90 h-12"
        >
          <FileText className="h-4 w-4 mr-2" />
          Guardar
        </Button>
        
        <Button
          variant="outline"
          onClick={onExportPDF}
          disabled={disabled}
          className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white h-12"
        >
          <Download className="h-4 w-4 mr-2" />
          PDF
        </Button>
        
        <Button
          variant="outline"
          onClick={onSendWhatsApp}
          disabled={disabled}
          className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white h-12"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
        
        <Button
          variant="outline"
          onClick={onSendEmail}
          disabled={disabled}
          className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white h-12"
        >
          <Send className="h-4 w-4 mr-2" />
          Email
        </Button>
      </div>
    </div>
  );
};

export default QuoteActions; 