import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSearch(value);
      }
    }
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSearch(value);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative group z-10">
      <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative flex items-end bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="예: 조용한 분위기에서 소개팅하기 좋은 파스타 맛집 찾아줘"
          className="w-full p-4 pr-14 bg-transparent text-slate-800 placeholder-slate-400 outline-none resize-none text-lg leading-relaxed min-h-[60px] max-h-[200px]"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          aria-label="검색"
        >
          {isLoading ? (
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      <div className="text-xs text-slate-400 mt-2 ml-2 font-medium">
        <b>Enter</b> 키를 눌러 검색
      </div>
    </div>
  );
};