import { useEffect, useRef } from 'react';

/**
 * Hook para gerenciar acessibilidade completa de diálogos modais:
 * - Foco inicial no primeiro elemento interativo relevante
 * - Focus Trap (Tab e Shift+Tab confinados no modal)
 * - Fechamento via tecla Escape
 * - Retorno automático do foco ao elemento que acionou a abertura
 */
export function useModalAccessibility(
  isOpen: boolean,
  onClose: () => void,
  initialFocusSelector: string = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not([aria-label*="Fechar"])'
) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Salva o elemento que disparou a abertura para devolver o foco
    triggerRef.current = document.activeElement as HTMLElement;

    // Define foco inicial após montagem
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const primary = modalRef.current.querySelector<HTMLElement>(initialFocusSelector);
        if (primary && typeof primary.focus === 'function') {
          primary.focus();
        } else {
          const anyFocusable = modalRef.current.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          anyFocusable?.focus();
        }
      }
    }, 60);

    // Manipulador de Teclado (Escape e Focus Trap)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableNodes = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const focusables = Array.from(focusableNodes).filter(el => el.offsetParent !== null);
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      // Retorna foco ao elemento original
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, onClose, initialFocusSelector]);

  return modalRef;
}
