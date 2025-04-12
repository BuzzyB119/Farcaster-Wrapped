'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import { fetchUserStats } from '../services/farcaster';
import type { UserStats } from '../types/farcaster';

export default function Home() {
  const [fid, setFid] = useState<string>('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userStats = await fetchUserStats(fid);
      setStats(userStats);
    } catch (err) {
      setError('Failed to fetch user stats. Please check the FID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-black mb-4">Farcaster Wrapped</h1>
          <p className="text-lg text-gray-600">Your year on Farcaster, wrapped up nicely.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex gap-4 justify-center">
            <input
              type="text"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
              placeholder="Enter your Farcaster ID"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1 max-w-sm text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
            >
              {loading ? 'Loading...' : 'Get Stats'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}
        </form>

        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Casts"
                value={stats.totalCasts}
                delay={0.1}
              />
              <StatsCard
                title="Total Likes"
                value={stats.totalLikes}
                delay={0.2}
              />
              <StatsCard
                title="Total Recasts"
                value={stats.totalRecasts}
                delay={0.3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard
                title="Followers"
                value={stats.totalFollowers}
                delay={0.4}
              />
              <StatsCard
                title="Following"
                value={stats.totalFollowing}
                delay={0.5}
              />
            </div>

            {stats.mostEngagedCast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Engaged Cast</h3>
                <div className="space-y-2">
                  <p className="text-black">{stats.mostEngagedCast.text}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>❤️ {stats.mostEngagedCast.reactions.likes}</span>
                    <span>🔄 {stats.mostEngagedCast.reactions.recasts}</span>
                    <span>💬 {stats.mostEngagedCast.reactions.replies}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {stats.topMentions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Mentions</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.topMentions.map((mention, index) => (
                    <span
                      key={mention}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      @{mention}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}