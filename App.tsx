import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { searchRestaurants } from './services/geminiService';
import { RecommendationResult, SearchState } from './types';

function App() {
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [status, setStatus] = useState<SearchState>(SearchState.IDLE);
  const [query, setQuery] = useState('');

  const handleSearch = async (userQuery: string) => {
    setStatus(SearchState.LOADING);
    setQuery(userQuery);
    setResults([]);
    
    try {
      const data = await searchRestaurants(userQuery);
      if (data.length === 0) {
        setStatus(SearchState.EMPTY);
      } else {
        setResults(data);
        setStatus(SearchState.SUCCESS);
      }
    } catch (error) {
      console.error(error);
      setStatus(SearchState.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header / Hero Section */}
      <header className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 border-b border-transparent ${status === SearchState.IDLE ? 'py-40 bg-gradient-to-b from-white to-slate-50' : 'py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          
          <div className={`text-center transition-all duration-700 ${status === SearchState.IDLE ? 'mb-12 scale-100 opacity-100' : 'mb-0 flex flex-col md:flex-row md:items-center md:justify-between w-full gap-6'}`}>
            
            <div className={`${status !== SearchState.IDLE && 'text-left shrink-0'}`}>
              <h1 className={`font-black text-slate-900 tracking-tighter transition-all duration-500 ${status === SearchState.IDLE ? 'text-4xl md:text-6xl mb-4' : 'text-2xl'}`}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">다인</span>마이트
              </h1>
              {status === SearchState.IDLE && (
                <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto font-medium word-keep-all leading-relaxed">
                  오늘의 기분, 상황, 먹고 싶은 것을 말해보세요.<br className="hidden md:block"/>
                  AI가 딱 맞는 맛집을 찾아드립니다.
                </p>
              )}
            </div>

            {/* Search Bar - Moves based on state */}
            <div className={`w-full transition-all duration-700 ${status === SearchState.IDLE ? 'max-w-xl mx-auto' : 'max-w-3xl flex-1'}`}>
               <SearchBar onSearch={handleSearch} isLoading={status === SearchState.LOADING} />
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-20 pt-8">
        
        {/* Loading State */}
        {status === SearchState.LOADING && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map((i) => (
               <div key={i} className="bg-white rounded-2xl p-0 overflow-hidden shadow-sm border border-slate-100 animate-pulse h-full">
                 <div className="aspect-video bg-slate-200 w-full"></div>
                 <div className="p-5">
                   <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                   <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
                   <div className="space-y-2 mb-6">
                     <div className="h-3 bg-slate-100 rounded w-full"></div>
                     <div className="h-3 bg-slate-100 rounded w-full"></div>
                     <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                   </div>
                   <div className="flex gap-2 pt-4 mt-auto">
                     <div className="h-6 w-16 bg-slate-100 rounded-lg"></div>
                     <div className="h-6 w-16 bg-slate-100 rounded-lg"></div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        )}

        {/* Results State */}
        {status === SearchState.SUCCESS && (
          <div className="animate-fade-in">
             <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
               <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    <span className="text-indigo-600">"{query}"</span>에 대한 추천 결과
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">AI가 리뷰 데이터를 분석하여 선별했습니다.</p>
               </div>
               <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded hidden md:block">Powered by Gemini 2.5 Flash</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {results.map((item, idx) => (
                 <ResultCard key={item.id} data={item} index={idx} />
               ))}
             </div>
          </div>
        )}

        {/* Error State */}
        {status === SearchState.ERROR && (
          <div className="text-center mt-32 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">문제가 발생했습니다</h3>
            <p className="text-slate-500">요청을 처리하는 중에 오류가 생겼습니다.<br/>잠시 후 다시 시도해 주세요.</p>
          </div>
        )}

        {/* Empty State */}
        {status === SearchState.EMPTY && (
          <div className="text-center mt-32 animate-fade-in">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">검색 결과가 없습니다</h3>
             <p className="text-slate-500">다른 키워드로 검색하거나,<br/>질문을 조금 더 구체적으로 해보세요.</p>
          </div>
        )}
      </main>

      {/* CSS Animation Keyframes injection */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation-name: fade-in-up;
          animation-duration: 0.6s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in {
          animation-name: fade-in;
          animation-duration: 0.4s;
          animation-timing-function: ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;