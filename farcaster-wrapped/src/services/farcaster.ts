import type { UserStats, CastData, MonthlyActivity } from '../types/farcaster';

export async function fetchUserStats(fid: string): Promise<UserStats> {
  const response = await fetch('/api/neynar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: `/user/${fid}`,
    }),
  });

  const userData = await response.json();
  
  // Get user's casts
  const castsResponse = await fetch('/api/neynar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: `/casts/${fid}`,
    }),
  });

  const castsData = await castsResponse.json();

  // Process the data to create stats
  const stats: UserStats = {
    totalCasts: castsData.casts.length,
    totalLikes: castsData.casts.reduce((acc: number, cast: CastData) => acc + cast.reactions.likes, 0),
    totalRecasts: castsData.casts.reduce((acc: number, cast: CastData) => acc + cast.reactions.recasts, 0),
    totalFollowers: userData.followers_count,
    totalFollowing: userData.following_count,
    totalReplies: castsData.casts.filter((cast: CastData) => cast.parentHash !== null).length,
    mostEngagedCast: [...castsData.casts].sort((a: CastData, b: CastData) => 
      (b.reactions.likes + b.reactions.recasts + b.reactions.replies) - 
      (a.reactions.likes + a.reactions.recasts + a.reactions.replies)
    )[0] || null,
    topMentions: extractTopMentions(castsData.casts),
    monthlyActivity: calculateMonthlyActivity(castsData.casts),
  };

  return stats;
}

function extractTopMentions(casts: CastData[]): string[] {
  const mentions = casts
    .map(cast => {
      const matches = cast.text.match(/@[\w-]+/g) || [];
      return matches.map(m => m.substring(1));
    })
    .flat();

  const mentionCounts = mentions.reduce((acc: Record<string, number>, mention: string) => {
    acc[mention] = (acc[mention] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(mentionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([mention]) => mention);
}

function calculateMonthlyActivity(casts: CastData[]): MonthlyActivity[] {
  const monthlyData: Record<string, { casts: number; likes: number; recasts: number }> = {};

  casts.forEach(cast => {
    const month = new Date(cast.timestamp).toLocaleString('default', { month: 'long' });
    if (!monthlyData[month]) {
      monthlyData[month] = { casts: 0, likes: 0, recasts: 0 };
    }
    monthlyData[month].casts++;
    monthlyData[month].likes += cast.reactions.likes;
    monthlyData[month].recasts += cast.reactions.recasts;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }));
}
