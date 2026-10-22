import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 max-w-sm w-full px-4 pointer-events-none"
    >
      <motion.div 
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md pointer-events-auto transition-all ${
          isSuccess 
            ? 'bg-slate-900/95 dark:bg-slate-900/95 border-emerald-500/40 text-white shadow-emerald-500/10' 
            : isWarning 
              ? 'bg-slate-900/95 dark:bg-slate-900/95 border-amber-500/40 text-white shadow-amber-500/10' 
              : 'bg-slate-900/95 dark:bg-slate-900/95 border-teal-500/40 text-white shadow-teal-500/10'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />}
          {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />}
          {!isSuccess && !isWarning && <Info className="w-5 h-5 text-teal-400" aria-hidden="true" />}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <p className="text-sm font-bold text-white mb-0.5 leading-snug">
            {toast.title}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {toast.message}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
