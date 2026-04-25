'use client';

import { memo } from 'react';

import { ExternalLink, BookOpen, X, Globe, Library, GraduationCap } from 'lucide-react';

interface WikiData {
  title: string;
  extract: string;
  url?: string;
  thumbnail?: string;
}

interface BookData {
  title: string;
  author: string;
  coverUrl?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wikiData: WikiData | null;
  relatedTopics: string[];
  books: BookData[];
  onSelectTopic: (topic: string) => void;
}

const ReferencePanel = memo(function ReferencePanel({ isOpen, onClose, wikiData, relatedTopics, books, onSelectTopic }: Props) {
  if (!isOpen) return null;

  return (
    <aside
      style={{
        width: 320,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        borderLeft: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        zIndex: 30,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Reference</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg transition-colors" aria-label="Close reference panel">
          <X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Wikipedia */}
        {wikiData ? (
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold">W</div>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Wikipedia</span>
            </div>
            {wikiData.thumbnail && (
              <img 
                src={wikiData.thumbnail} 
                alt={wikiData.title}
                className="w-full h-32 object-cover rounded-xl mb-3 shadow-sm"
              />
            )}
            <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{wikiData.title}</h3>
            <p className="text-xs leading-relaxed line-clamp-6" style={{ color: 'var(--text-secondary)' }}>
              {wikiData.extract}
            </p>
            {wikiData.url && (
              <a 
                href={wikiData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Read full article <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : (
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
              Start a topic to see reference material here...
            </p>
          </div>
        )}

        {/* Recommended Books */}
        {books.length > 0 && (
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Library className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Recommended Reading</span>
            </div>
            <div className="space-y-2">
              {books.slice(0, 4).map((book, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-8 h-12 rounded object-cover shadow-sm" />
                  ) : (
                    <div className="w-8 h-12 rounded flex items-center justify-center" style={{ background: 'var(--border-color)' }}>
                      <BookOpen className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{book.title}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Explore Next</span>
            </div>
            <div className="space-y-1.5">
              {relatedTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectTopic(topic)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)' }}
                >
                  → {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
});

export default ReferencePanel;
