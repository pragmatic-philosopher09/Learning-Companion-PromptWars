// Pre-populated topic knowledge base for adaptive learning
// This serves as a "database" of curated topic metadata, learning paths,
// and related concepts that the AI tutor can reference

export interface TopicMeta {
  slug: string;
  name: string;
  category: string;
  difficulty: 'beginner-friendly' | 'moderate' | 'advanced';
  prerequisites: string[];
  relatedTopics: string[];
  keyTerms: string[];
  learningPath: string[];
  funFact: string;
}

const TOPIC_DATABASE: Record<string, TopicMeta> = {
  'quantum computing': {
    slug: 'quantum-computing',
    name: 'Quantum Computing',
    category: 'Computer Science',
    difficulty: 'advanced',
    prerequisites: ['Linear Algebra', 'Classical Computing', 'Physics Basics'],
    relatedTopics: ['Quantum Mechanics', 'Cryptography', 'Superposition', 'Quantum Entanglement', 'Qubits'],
    keyTerms: ['qubit', 'superposition', 'entanglement', 'quantum gate', 'decoherence', 'quantum supremacy'],
    learningPath: ['What is a Bit?', 'Superposition', 'Qubits', 'Quantum Gates', 'Quantum Algorithms', 'Real-World Applications'],
    funFact: 'Google\'s Sycamore processor performed a calculation in 200 seconds that would take a classical supercomputer ~10,000 years.',
  },
  'machine learning': {
    slug: 'machine-learning',
    name: 'Machine Learning',
    category: 'Artificial Intelligence',
    difficulty: 'moderate',
    prerequisites: ['Statistics', 'Programming Basics', 'Linear Algebra'],
    relatedTopics: ['Deep Learning', 'Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Data Science'],
    keyTerms: ['supervised learning', 'unsupervised learning', 'neural network', 'gradient descent', 'overfitting', 'training data'],
    learningPath: ['What is ML?', 'Types of Learning', 'Linear Regression', 'Decision Trees', 'Neural Networks', 'Deep Learning'],
    funFact: 'The concept of neural networks was inspired by the biological neural networks in the human brain.',
  },
  'climate change': {
    slug: 'climate-change',
    name: 'Climate Change',
    category: 'Environmental Science',
    difficulty: 'beginner-friendly',
    prerequisites: [],
    relatedTopics: ['Greenhouse Effect', 'Renewable Energy', 'Carbon Cycle', 'Ocean Acidification', 'Sustainability'],
    keyTerms: ['greenhouse gases', 'carbon footprint', 'global warming', 'renewable energy', 'Paris Agreement', 'carbon neutral'],
    learningPath: ['Earth\'s Climate System', 'Greenhouse Effect', 'Human Impact', 'Effects & Consequences', 'Solutions', 'What You Can Do'],
    funFact: 'The last time CO2 levels were this high was over 3 million years ago, during the Pliocene epoch.',
  },
  'human brain': {
    slug: 'human-brain',
    name: 'The Human Brain',
    category: 'Neuroscience',
    difficulty: 'moderate',
    prerequisites: ['Biology Basics'],
    relatedTopics: ['Neuroscience', 'Psychology', 'Memory', 'Consciousness', 'Neuroplasticity'],
    keyTerms: ['neuron', 'synapse', 'cortex', 'hippocampus', 'neuroplasticity', 'neurotransmitter'],
    learningPath: ['Brain Anatomy', 'Neurons & Synapses', 'Brain Regions', 'Memory', 'Neuroplasticity', 'Consciousness'],
    funFact: 'Your brain generates about 20 watts of power — enough to power a dim light bulb.',
  },
  'space exploration': {
    slug: 'space-exploration',
    name: 'Space Exploration',
    category: 'Astronomy',
    difficulty: 'beginner-friendly',
    prerequisites: [],
    relatedTopics: ['Solar System', 'Black Holes', 'Mars Colonization', 'Telescopes', 'Astrophysics'],
    keyTerms: ['orbit', 'light-year', 'exoplanet', 'space station', 'rocket propulsion', 'cosmic radiation'],
    learningPath: ['History of Space Travel', 'Our Solar System', 'The Moon & Mars', 'Space Technology', 'Exoplanets', 'Future of Space'],
    funFact: 'Voyager 1, launched in 1977, is the farthest human-made object from Earth, now over 15 billion miles away.',
  },
  'genetics & dna': {
    slug: 'genetics-dna',
    name: 'Genetics & DNA',
    category: 'Biology',
    difficulty: 'moderate',
    prerequisites: ['Biology Basics', 'Chemistry Basics'],
    relatedTopics: ['CRISPR', 'Heredity', 'Evolution', 'Genomics', 'Genetic Engineering'],
    keyTerms: ['DNA', 'gene', 'chromosome', 'mutation', 'CRISPR', 'genome', 'allele'],
    learningPath: ['What is DNA?', 'Genes & Chromosomes', 'How DNA Replicates', 'Heredity', 'Mutations', 'Genetic Engineering'],
    funFact: 'Humans share about 60% of their DNA with bananas.',
  },
  'world history': {
    slug: 'world-history',
    name: 'World History',
    category: 'History',
    difficulty: 'beginner-friendly',
    prerequisites: [],
    relatedTopics: ['Ancient Civilizations', 'World War II', 'Industrial Revolution', 'Cold War', 'Renaissance'],
    keyTerms: ['civilization', 'empire', 'revolution', 'colonialism', 'democracy', 'industrialization'],
    learningPath: ['Ancient Civilizations', 'Classical Empires', 'Middle Ages', 'Renaissance', 'Modern Era', 'Contemporary World'],
    funFact: 'The Roman Empire at its peak controlled about 20% of the world\'s population.',
  },
  'philosophy': {
    slug: 'philosophy',
    name: 'Philosophy',
    category: 'Humanities',
    difficulty: 'moderate',
    prerequisites: [],
    relatedTopics: ['Ethics', 'Logic', 'Metaphysics', 'Epistemology', 'Existentialism'],
    keyTerms: ['ethics', 'metaphysics', 'epistemology', 'logic', 'existentialism', 'utilitarianism'],
    learningPath: ['What is Philosophy?', 'Ancient Greek Philosophy', 'Ethics', 'Logic & Reasoning', 'Modern Philosophy', 'Contemporary Thought'],
    funFact: 'Socrates never wrote anything down — everything we know about his ideas comes from his students, especially Plato.',
  },
  'economics': {
    slug: 'economics',
    name: 'Economics',
    category: 'Social Science',
    difficulty: 'moderate',
    prerequisites: ['Math Basics'],
    relatedTopics: ['Supply & Demand', 'Macroeconomics', 'Microeconomics', 'Behavioral Economics', 'Cryptocurrency'],
    keyTerms: ['supply and demand', 'GDP', 'inflation', 'fiscal policy', 'monetary policy', 'market equilibrium'],
    learningPath: ['What is Economics?', 'Supply & Demand', 'Market Structures', 'Macroeconomics', 'Monetary Policy', 'Global Trade'],
    funFact: 'The US national debt, if stacked in $1 bills, would reach from Earth to the Moon and back multiple times.',
  },
  'art & design': {
    slug: 'art-design',
    name: 'Art & Design',
    category: 'Creative Arts',
    difficulty: 'beginner-friendly',
    prerequisites: [],
    relatedTopics: ['Color Theory', 'Typography', 'UX Design', 'Art History', 'Photography'],
    keyTerms: ['composition', 'color theory', 'perspective', 'typography', 'gestalt principles', 'negative space'],
    learningPath: ['Elements of Design', 'Color Theory', 'Composition', 'Art Movements', 'Digital Design', 'Design Thinking'],
    funFact: 'The Mona Lisa has no eyebrows — it was common in Renaissance Florence for women to shave them off.',
  },
};

export function getTopicMeta(topic: string): TopicMeta | null {
  const key = topic.toLowerCase().trim();
  return TOPIC_DATABASE[key] || null;
}

export function findClosestTopic(query: string): TopicMeta | null {
  const q = query.toLowerCase();
  for (const [key, meta] of Object.entries(TOPIC_DATABASE)) {
    if (q.includes(key) || key.includes(q)) {
      return meta;
    }
    // Also check the name field
    if (q.includes(meta.name.toLowerCase()) || meta.name.toLowerCase().includes(q)) {
      return meta;
    }
  }
  return null;
}

export function getAllTopicSlugs(): string[] {
  return Object.keys(TOPIC_DATABASE);
}
