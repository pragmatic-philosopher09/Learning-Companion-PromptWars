// Free Dictionary API — fetches word definitions for key terms
export interface DictionaryResult {
  word: string;
  phonetic?: string;
  definition: string;
  example?: string;
  partOfSpeech: string;
}

export async function fetchDefinition(word: string): Promise<DictionaryResult | null> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) return null;
    const data = await res.json();
    
    const entry = data[0];
    const meaning = entry.meanings?.[0];
    const def = meaning?.definitions?.[0];

    return {
      word: entry.word,
      phonetic: entry.phonetic,
      definition: def?.definition || 'No definition found.',
      example: def?.example,
      partOfSpeech: meaning?.partOfSpeech || '',
    };
  } catch (error) {
    console.error('Dictionary API Error:', error);
    return null;
  }
}
