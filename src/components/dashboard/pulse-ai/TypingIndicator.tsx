"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-jade/20 to-sapphire/20 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-jade" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold text-ink dark:text-white mb-1.5">
          Pulse AI
        </span>
        <div className="bg-white dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-jade/60"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
          <span className="text-[11px] text-ghost ml-1.5">
            Analisando seus dados...
          </span>
        </div>
      </div>
    </motion.div>
  );
}
