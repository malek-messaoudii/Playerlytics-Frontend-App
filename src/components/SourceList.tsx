import React from 'react';
import { Source } from '../types';
import { FileText } from 'lucide-react';

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  if (!sources.length) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Sources:</h3>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <FileText size={16} className="mt-1 flex-shrink-0" />
            <span>
              {source.title} (Page {source.page})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}