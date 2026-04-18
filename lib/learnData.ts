export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
}

export interface InteractiveMission {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const learningPaths: LearningPath[] = [
  {
    id: "path-1",
    title: "Stock Market 101",
    description: "The essential foundation for your investment journey.",
    icon: "TrendingUp",
    difficulty: "Beginner",
    progress: 100,
  },
  {
    id: "path-2",
    title: "Technical Analysis",
    description: "Learn to read charts and identify market trends.",
    icon: "BarChart2",
    difficulty: "Intermediate",
    progress: 40,
  },
  {
    id: "path-3",
    title: "Group Investing Dynamics",
    description: "Master consensus voting and club management.",
    icon: "Users",
    difficulty: "Beginner",
    progress: 10,
  },
];

export const interactiveMissions: InteractiveMission[] = [
  {
    id: "mission-1",
    title: "Find an undervalued stock",
    description: "Apply your P/E ratio knowledge to real market data.",
    icon: "Search",
  },
  {
    id: "mission-2",
    title: "Analyze HDFC's news",
    description: "Evaluate sentiment from recent quarterly reports.",
    icon: "Newspaper",
  },
  {
    id: "mission-4",
    title: "Propose a club trade",
    description: "Draft a buy proposal for consensus voting.",
    icon: "FileText",
  },
];
