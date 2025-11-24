import React, { useState } from 'react';
import { RecommendationResult } from '../types';

interface ShareButtonProps {
  restaurant: RecommendationResult;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ restaurant }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const textToShare = `[다인마이트 추천] 🍽️\n\n📍 곳: ${restaurant.name}\n💡 추천 이유: ${restaurant.reason}\n🔗 링크: ${restaurant.external_url}`;
    
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      title="클립보드에 복사"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
          </svg>
          <span className="text-emerald-600 font-semibold">복사완료!</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.345 1.093m0 0c.044.493-.077.997-.344 1.487m.688-2.58a2.25 2.25 0 012.186 2.186m-2.186-2.186c-1.291.04-2.545.48-3.594 1.205m0 0A9.01 9.01 0 018.35 15m0 0c.498.715.857 1.498 1.06 2.332" />
          </svg>
          <span>공유하기</span>
        </>
      )}
    </button>
  );
};