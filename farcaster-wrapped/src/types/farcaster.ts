export interface UserStats {
  totalCasts: number;
  totalLikes: number;
  totalRecasts: number;
  totalFollowers: number;
  totalFollowing: number;
  totalReplies: number;
  mostEngagedCast: CastData | null;
  topMentions: string[];
  monthlyActivity: MonthlyActivity[];
}

export interface CastData {
  hash: string;
  threadHash: string;
  parentHash: string | null;
  author: {
    fid: number;
    username: string;
    displayName: string;
    pfp: string;
  };
  text: string;
  timestamp: string;
  reactions: {
    likes: number;
    recasts: number;
    replies: number;
  };
}

export interface MonthlyActivity {
  month: string;
  casts: number;
  likes: number;
  recasts: number;
}