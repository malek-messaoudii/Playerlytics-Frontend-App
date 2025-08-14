import React from 'react';
import { Source } from '../types';
import { FileText } from 'lucide-react';

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  if (!sources.length) return null;

  return (
    <div className="sources-container">
      <h3 className="sources-title">Sources:</h3>
      <div className="sources-list">
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <FileText size={16} className="source-icon" />
            <span className="source-text">
              {source.title} (Page {source.page})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}