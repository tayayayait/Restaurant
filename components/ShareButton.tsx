import React, { useMemo, useRef, useState } from 'react';
import { RecommendationResult } from '../types';

interface ShareButtonProps {
  restaurant: RecommendationResult;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ restaurant }) => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [showFallback, setShowFallback] = useState(false);
  const fallbackInputRef = useRef<HTMLTextAreaElement | null>(null);

  const textToShare = useMemo(
    () =>
      `[다인마이트 추천] 🍽️\n\n📍 곳: ${restaurant.name}\n💡 추천 이유: ${restaurant.reason}\n🔗 링크: ${restaurant.external_url}`,
    [restaurant.external_url, restaurant.name, restaurant.reason],
  );

  const updateStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: null, message: '' }), 3000);
  };

  const checkClipboardPermission = async () => {
    try {
      if (!navigator.permissions?.query) return true;
      const result = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
      return result.state !== 'denied';
    } catch {
      return true;
    }
  };

  const shareWithClipboard = async (content: string) => {
    const hasPermission = await checkClipboardPermission();
    if (!navigator.clipboard?.writeText || !hasPermission) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(content);
      updateStatus('success', '클립보드에 복사했어요!');
      return true;
    } catch {
      return false;
    }
  };

  const shareWithWebShare = async (content: string) => {
    if (!navigator.share) return false;

    try {
      await navigator.share({
        title: '다인마이트 추천',
        text: content,
        url: restaurant.external_url,
      });
      updateStatus('success', '공유 링크를 보냈어요!');
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') return true;
      return false;
    }
  };

  const openFallback = () => {
    setShowFallback(true);
    updateStatus('error', '자동 복사에 실패했어요. 아래 내용을 직접 복사해주세요.');
  };

  const handleManualCopy = async () => {
    if (fallbackInputRef.current) {
      fallbackInputRef.current.select();
      document.execCommand('copy');
    }

    const copied = await shareWithClipboard(textToShare);
    if (!copied) {
      updateStatus('error', '복사에 실패했어요. 내용을 직접 복사해주세요.');
    } else {
      setShowFallback(false);
    }
  };

  const handleShare = async () => {
    const webShareHandled = await shareWithWebShare(textToShare);
    if (webShareHandled) return;

    const clipboardHandled = await shareWithClipboard(textToShare);
    if (clipboardHandled) return;

    openFallback();
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        title="공유하기"
      >
        {status.type === 'success' ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-600 font-semibold">완료!</span>
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

      {status.type && (
        <div
          className={`mt-2 text-xs font-medium ${
            status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {status.message}
        </div>
      )}

      {showFallback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">직접 복사해서 공유하기</h3>
                <p className="text-sm text-slate-600">클립보드 접근이 제한되어 있어요. 아래 내용을 복사해 주세요.</p>
              </div>
              <button
                onClick={() => setShowFallback(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <textarea
              ref={fallbackInputRef}
              value={textToShare}
              readOnly
              className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowFallback(false)}
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                닫기
              </button>
              <button
                onClick={handleManualCopy}
                className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
              >
                복사하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
