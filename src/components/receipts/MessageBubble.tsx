import React from 'react';
import { AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  type: 'system' | 'user' | 'error';
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ type, content }) => {
  if (type === 'user' && content.startsWith('blob:')) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-sm">
          <img 
            src={content} 
            alt="Receipt" 
            className="rounded-lg shadow-md max-h-48 object-contain"
          />
        </div>
      </div>
    );
  }

  const bubbleClasses = {
    system: 'bg-white text-gray-800',
    user: 'bg-blue-600 text-white ml-auto',
    error: 'bg-red-50 text-red-800 border border-red-200'
  }[type];

  return (
    <div className={`max-w-3xl rounded-lg p-4 ${bubbleClasses}`}>
      {type === 'error' && (
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="font-medium">Erro</span>
        </div>
      )}
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  );
};