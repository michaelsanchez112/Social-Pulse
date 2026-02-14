import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { FacebookPost } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (posts: FacebookPost[]) => void;
}

const SAMPLE_JSON = `[
  {
    "id": "101",
    "author": { "name": "John Doe", "handle": "@johndoe", "avatarUrl": "..." },
    "content": "Hello World",
    "mediaType": "TEXT",
    "postedAt": "2023-10-27T10:00:00Z",
    "postUrl": "#",
    "stats": { "likes": 10, "comments": 2, "shares": 0, "views": 100 }
  }
]`;

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("Input must be an array of posts.");
      }
      // Basic validation could go here
      onImport(parsed as FacebookPost[]);
      onClose();
      setJsonInput('');
      setError(null);
    } catch (e) {
      setError("Invalid JSON format. Please check your syntax.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Import Raw JSON</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">
            Paste your raw Facebook post JSON array below. Ensure it matches the expected schema.
          </p>
          
          <textarea
            className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={`Paste JSON here...\n\nExample:\n${SAMPLE_JSON}`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />

          {error && (
            <div className="mt-4 flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleImport}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md transition-all flex items-center"
          >
            <Check size={18} className="mr-2" />
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
