import { findClosestTopic, getTopicMeta, getAllTopicSlugs } from '@/lib/topic-database';

describe('topic-database', () => {
  describe('getTopicMeta', () => {
    it('returns metadata for a known topic', () => {
      const result = getTopicMeta('machine learning');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Machine Learning');
      expect(result!.category).toBe('Artificial Intelligence');
      expect(result!.difficulty).toBe('moderate');
    });

    it('returns null for an unknown topic', () => {
      expect(getTopicMeta('underwater basket weaving')).toBeNull();
    });

    it('is case-insensitive', () => {
      const result = getTopicMeta('Machine Learning');
      expect(result).not.toBeNull();
      expect(result!.slug).toBe('machine-learning');
    });

    it('trims whitespace', () => {
      const result = getTopicMeta('  quantum computing  ');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Quantum Computing');
    });

    it('returns correct structure with all required fields', () => {
      const result = getTopicMeta('philosophy');
      expect(result).toMatchObject({
        slug: expect.any(String),
        name: expect.any(String),
        category: expect.any(String),
        difficulty: expect.any(String),
        prerequisites: expect.any(Array),
        relatedTopics: expect.any(Array),
        keyTerms: expect.any(Array),
        learningPath: expect.any(Array),
        funFact: expect.any(String),
      });
    });
  });

  describe('findClosestTopic', () => {
    it('finds exact match', () => {
      const result = findClosestTopic('climate change');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Climate Change');
    });

    it('finds partial match — query contains topic', () => {
      const result = findClosestTopic('I want to learn about machine learning');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Machine Learning');
    });

    it('finds partial match — topic contains query', () => {
      const result = findClosestTopic('economics');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Economics');
    });

    it('is case-insensitive', () => {
      const result = findClosestTopic('SPACE EXPLORATION');
      expect(result).not.toBeNull();
      expect(result!.slug).toBe('space-exploration');
    });

    it('returns null when no match found', () => {
      expect(findClosestTopic('something completely unrelated xyz')).toBeNull();
    });

    it('matches by name field when key does not match', () => {
      const result = findClosestTopic('The Human Brain');
      expect(result).not.toBeNull();
      expect(result!.category).toBe('Neuroscience');
    });
  });

  describe('getAllTopicSlugs', () => {
    it('returns an array of topic keys', () => {
      const slugs = getAllTopicSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThanOrEqual(10);
    });

    it('includes known topics', () => {
      const slugs = getAllTopicSlugs();
      expect(slugs).toContain('machine learning');
      expect(slugs).toContain('quantum computing');
      expect(slugs).toContain('philosophy');
    });
  });
});
