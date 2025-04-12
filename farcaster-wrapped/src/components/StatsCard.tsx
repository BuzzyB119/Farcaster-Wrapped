'use client'

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-black mt-2">{value}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </motion.div>
  );
};

export default StatsCard;