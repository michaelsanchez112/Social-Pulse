import React from 'react';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming standard rendering, but we'll use simple rendering to avoid deps

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: string | null;
}

const InsightModal: React.FC<InsightModalProps> = ({ isOpen, onClose, insight }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-indigo-100 overflow-hidden transform transition-all scale-100">
        
        {/* Header with Gradient */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Analysis</h2>
              <p className="text-indigo-100 text-xs">Powered by Gemini 3 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {insight ? (
            <div className="prose prose-indigo prose-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {insight}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <AlertTriangle size={32} className="mb-2 opacity-50" />
              <p>No insights generated yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightModal;
