# Plano de Implementação — Design Fase 2 (Utopia, Open Props & Motion) — [CONCLUÍDO]

Modernização da experiência visual e interativa da plataforma **Cultura em Cena** através da incorporação de tipografia fluida orientada pelo método Utopia, curvas de aceleração física e sombras do Open Props, e animações de alta performance com Motion (`motion/react`) no catálogo de editais e no checklist de inscrição.

---

### Status da Execução: CONCLUÍDO COM SUCESSO

- [x] **`src/index.css`**: Configurado com os tokens tipográficos fluidos do Utopia (`--step-sm` até `--step-2xl`), as curvas de física do Open Props (`--ease-spring`), sombras (`--shadow-hover`), botões estilizados (`.btn-primary`), anéis de foco (`.focus-ring`) e suporte à acessibilidade com `@media (prefers-reduced-motion: reduce)`.
- [x] **`src/components/CatalogPage.tsx`**: Tipografia fluida nos títulos e filtros, grid interativo com `motion.div` aplicando física de mola suave ao passar o cursor (`whileHover`), metadados limpos seguindo a disciplina "Zero-Pill" com separadores tipográficos e valores numéricos tabulares.
- [x] **`src/components/ChecklistPage.tsx`**: Barra de progresso animada com física de mola (`type: "spring", stiffness: 80, damping: 15, mass: 1`), cards de etapas integrados com `motion.div` em cascata suave, alvos de toque $\ge 44\text{px}$, preservação total das regras de auditoria e acionamento direto do `DocUpdateModal` para documentos com pendência de renovação.
