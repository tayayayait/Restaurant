import React from 'react';
import { RecommendationResult } from '../types';
import { ShareButton } from './ShareButton';

interface ResultCardProps {
  data: RecommendationResult;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, index }) => {
  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 70) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full opacity-0 animate-fade-in-up transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      {/* Image Header */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
        <img 
          src={data.image_url} 
          alt={data.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(data.match_score)} shadow-sm backdrop-blur-sm bg-opacity-90`}>
             적합도 {data.match_score}%
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
            <h3 className="text-white text-xl font-bold truncate shadow-sm tracking-tight">{data.name}</h3>
            <p className="text-slate-200 text-sm font-medium">{data.category} • {data.price_range}</p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* AI Reason */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10 1c3.866 0 7 1.79 7 4s-3.134 4-7 4-7-1.79-7-4 3.134-4 7-4zm5.694 8.13c.464-.264.91-.583 1.306-.952V10c0 2.21-3.134 4-7 4s-7-1.79-7-4V8.178c.396.37.842.689 1.306.953C5.838 10.006 7.854 10.5 10 10.5s4.162-.494 5.694-1.37zM3 13.179V15c0 2.21 3.134 4 7 4s7-1.79 7-4v-1.822c-.396.37-.842.689-1.306.953-1.532.875-3.548 1.369-5.694 1.369s-4.162-.494-5.694-1.37A7.009 7.009 0 013 13.179z" clipRule="evenodd" />
                </svg>
            </div>
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">AI 큐레이터 코멘트</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed word-keep-all">
            {data.reason}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.tags.map((tag, i) => (
            <span key={i} className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium border border-slate-200">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions - Sticky at bottom of card context */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
           <ShareButton restaurant={data} />
           
           <a 
             href={data.external_url} 
             target="_blank" 
             rel="noreferrer"
             className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group/link"
           >
             지도 보기
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
             </svg>
           </a>
        </div>
      </div>
    </div>
  );
};