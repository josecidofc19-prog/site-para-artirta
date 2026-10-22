import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Info, HelpCircle } from 'lucide-react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  title?: string;
  position?: TooltipPosition;
  delay?: number;
  children?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

/**
 * Componente de Tooltip Flutuante Editorial com animações suaves e acessibilidade WCAG.
 * Suporta wrap de elementos filhos ou uso direto como ícone informativo.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  position = 'top',
  delay = 180,
  children,
  className = '',
  triggerClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const shouldReduceMotion = useReducedMotion();

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const toggleTooltip = () => {
    setIsVisible((prev) => !prev);
  };

  // Fecha com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        hideTooltip();
      }
    };
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // Limpa timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Fecha ao clicar fora em telas de toque
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        hideTooltip();
      }
    };
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isVisible]);

  // Variações de posicionamento
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Variações de setas
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#1c1917] dark:border-t-[#26262a] border-l-transparent border-r-transparent border-b-transparent border-4',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1c1917] dark:border-b-[#26262a] border-l-transparent border-r-transparent border-t-transparent border-4',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#1c1917] dark:border-l-[#26262a] border-t-transparent border-b-transparent border-r-transparent border-4',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#1c1917] dark:border-r-[#26262a] border-t-transparent border-b-transparent border-l-transparent border-4',
  };

  // Variações de animação suave
  const animationVariants = {
    top: {
      initial: { opacity: 0, y: 5, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 3, scale: 0.97 },
    },
    bottom: {
      initial: { opacity: 0, y: -5, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -3, scale: 0.97 },
    },
    left: {
      initial: { opacity: 0, x: 5, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 3, scale: 0.97 },
    },
    right: {
      initial: { opacity: 0, x: -5, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -3, scale: 0.97 },
    },
  };

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {/* Gatilho (Trigger) */}
      {children ? (
        <span
          aria-describedby={isVisible ? tooltipId : undefined}
          onClick={toggleTooltip}
          className={`inline-flex items-center ${triggerClassName}`}
        >
          {children}
        </span>
      ) : (
        <span
          role="button"
          tabIndex={0}
          aria-describedby={isVisible ? tooltipId : undefined}
          aria-label={title || 'Informações explicativas'}
          onClick={(e) => {
            e.stopPropagation();
            toggleTooltip();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              toggleTooltip();
            }
          }}
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[#78716c] hover:text-[#991b1b] dark:text-[#a8a29e] dark:hover:text-red-400 hover:bg-[#991b1b]/10 dark:hover:bg-red-400/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 cursor-help ${triggerClassName}`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </span>
      )}

      {/* Painel Flutuante do Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={shouldReduceMotion ? { opacity: 0 } : animationVariants[position].initial}
            animate={shouldReduceMotion ? { opacity: 1 } : animationVariants[position].animate}
            exit={shouldReduceMotion ? { opacity: 0 } : animationVariants[position].exit}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute z-50 pointer-events-none w-max max-w-xs px-3.5 py-2.5 rounded-xl bg-[#1c1917] dark:bg-[#26262a] text-[#faf7f2] dark:text-[#f5f3ef] shadow-xl shadow-black/25 border border-white/10 text-xs font-sans text-left leading-relaxed ${positionClasses[position]}`}
          >
            {/* Título opcional */}
            {title && (
              <div className="font-semibold text-stone-100 dark:text-white flex items-center gap-1.5 mb-1 pb-1 border-b border-white/10">
                <Info className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="font-editorial tracking-wide">{title}</span>
              </div>
            )}

            {/* Conteúdo textual ou elementos */}
            <div className="text-stone-300 dark:text-stone-300 text-[11px] font-normal leading-normal">
              {content}
            </div>

            {/* Seta indicativa */}
            <div
              className={`absolute w-0 h-0 border-solid ${arrowClasses[position]}`}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

/**
 * Atalho conveniente para adicionar um ícone sutil de ajuda ao lado de títulos ou labels
 */
export const InfoTooltip: React.FC<{
  content: React.ReactNode;
  title?: string;
  position?: TooltipPosition;
  className?: string;
}> = ({ content, title, position = 'top', className = '' }) => (
  <Tooltip content={content} title={title} position={position} className={className} />
);
