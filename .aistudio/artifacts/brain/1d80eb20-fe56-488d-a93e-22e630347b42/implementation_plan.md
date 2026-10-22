# Cultura em Cena v2.0: Identidade Visual Editorial, Ferramentas do Artista & Dossiê de Inscrição

Este plano estabelece a evolução técnica e de design para a versão **v2.0** do Cultura em Cena, integrando tipografia e paleta editorial contemporânea, ribbon de fomento cultural e filtros de 1 clique na Home, emissão direta de certidões (CNDs) no cofre, exportação limpa de dossiê para impressão/PDF, gestão granular de filtros no catálogo e conformidade com acessibilidade mobile (WCAG 2.1 AA).

---

## Decisões Confirmadas & Diretrizes de Design

> [!IMPORTANT]
> **Consistência Editorial e Zero Clutter**: Todas as alterações preservam o rigor da legislação cultural brasileira (Rouanet, ProAC, PNAB, editais municipais de Indaiatuba), a separação estrita de níveis de verificação (`verified`, `pending_verification`, `forecast`, `demo`) e a experiência focada na preparação técnica do artista independente.

* **Paleta & Tema**: Marfim/pedra quente (`#faf7f2`), carvão profundo (`#121214`), vermelho-queimado editorial (`#991b1b` / `--brand-burnt-red`) e verde-floresta (`#1e3a2f`).
* **Tipografia**: Serifas expressivas com *Newsreader* / *Playfair Display* para títulos editoriais e corpo ultra-legível com *Plus Jakarta Sans*.
* **Impressão Nativa**: Utilização do modificador nativo `print:hidden` do Tailwind CSS em `src/App.tsx` para isolar completamente o dossiê na impressão (`window.print()`).
* **Estabilidade & Zero Alertas**: Substituição de qualquer chamada a `window.alert` pelo sistema de feedback acessível de toasts (`showToast`).

---

## 1. Visão Geral e Conceito Central

O **Cultura em Cena** é o assistente definitivo de preparação e conformidade para artistas independentes, coletivos e produtores. O lançamento v2.0 transforma a plataforma em uma publicação digital de alto nível com ferramentas operacionais diretas:

* **Para o Artista**: Oportunidades com métricas reais, emissão de CNDs oficiais a um clique, checklist com impressão técnica de dossiê e filtros ágeis no catálogo.
* **Para a Apresentação & Banca**: Capacidade de gerar relatórios e dossiês limpos em PDF sem artefatos visuais ou menus da web.
* **Para o Ecossistema**: Transparência com números consolidados de fomento regional (RMC/Indaiatuba, Estado de SP e Governo Federal).

---

## 2. Experiência do Usuário e Design Editorial

### 2.1. Home Page (`HomePage.tsx`)
* **Ribbon Editorial de Impacto**: Barra superior ou intermediária de métricas consolidadas (R$ 4.2M+ em fomento mapeado, 100% de fontes oficiais verificadas, foco regional Indaiatuba & RMC, -78% de risco de desclassificação documental).
* **Atalhos Rápidos de Busca**: Segmentos interativos de 1 clique (*Música*, *Indaiatuba*, *ProAC*, *PNAB*, *Audiovisual*, *Rouanet*) que filtram instantaneamente o catálogo sem necessidade de digitação.
* **Contador Dinâmico nos Perfis**: Cartões de seleção de perfil (Artista Solo, Banda ou Grupo, Coletivo, Produtor PJ) exibem em tempo real o total de editais oficiais verificados com inscrições vigentes compatíveis.

### 2.2. Ferramentas, Cofre & Dossiê
* **Emissão Direta de Certidões (`DocUpdateModal.tsx`)**:
  * Identificação automática do tipo de certidão (Federal/INSS, Estadual PGE-SP, Municipal Indaiatuba, Trabalhista CNDT/TST, FGTS/Caixa).
  * Botão com link oficial e seguro abrindo em nova aba o portal emissor correto para desatar o nó burocrático do artista.
* **Impressão e Exportação de Dossiê (`ChecklistPage.tsx`)**:
  * Botão "Imprimir Dossiê" (`window.print()`) no topo do checklist.
  * Ocultação de Navbar, Banner, Rodapé e Assistente Flutuante via `print:hidden`.
  * Estilização de alta legibilidade em papel (`@media print` em `src/index.css`) com quebra de página automática entre seções.
* **Gestão Granular de Filtros no Catálogo (`CatalogPage.tsx`)**:
  * Exibição de chips de filtros ativos com botão "×" individual para remoção rápida de cada critério (linguagem, esfera, prazo, faixa de valor, nível de verificação).
  * Botão geral "Limpar todos os filtros".

### 2.3. Acessibilidade Mobile & Responsividade (WCAG 2.1 AA)
* Todos os alvos interativos (botões, links, abas e seletores) padronizados com altura e área de clique mínimas de 44px.
* Drawer mobile simplificado, com espaçamento adequado e navegação fluida em telas a partir de 375px.

---

## 3. Decisões de Arquitetura e Trade-Offs

1. **Modificador Nativo `print:hidden` vs. Classes Customizadas**:
   * *Abordagem*: Agrupar elementos não-impressos em contêineres com `print:hidden` no `src/App.tsx` e regras mínimas de `@media print` no `src/index.css`.
   * *Motivo*: Mantém o DOM sem poluição de atributos e garante compatibilidade com qualquer navegador ou exportador PDF nativo.
2. **Integração de Links Oficiais de Emissão de CNDs**:
   * *Abordagem*: Mapeamento estático e seguro dos portais oficiais brasileiros mantido em utilitário de certidões, com ícone de link externo e aviso de nova aba.
   * *Motivo*: Evita navegação cega do artista e previne perda de prazo de certidões sem dependência de APIs governamentais que sofrem instabilidade.
3. **Favicon e Ícones Vetoriais no Express**:
   * *Abordagem*: Criação de `public/favicon.svg` e rota explícita `/favicon.ico` no `server.ts` que responde com o SVG ou 204.
   * *Motivo*: Elimina ruídos de 404 no console e garante renderização nítida em telas Retina e navegadores modernos.

---

## 4. Arquitetura Técnica do Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CULTURA EM CENA v2.0                            │
└────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   VISTA & HOME   │      │ COFRE & CHECKLIST│      │  PORTAL EMPRESAS │
│  (Editorial UI)  │      │  (Dossiê / CNDs) │      │  (Simulador SP)  │
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│• Ribbon Fomento  │      │• DocUpdateModal  │      │• Rouanet Art. 18 │
│• Filtros 1-clique│      │  (Links Oficiais)│      │• ProAC ICMS SP   │
│• Contadores PJ/PF│      │• Checklist Print │      │• Diagnóstico R$0 │
│• Hero Aceternity │      │  (print:hidden)  │      │• Dossiê Executivo│
└──────────────────┘      └──────────────────┘      └──────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      NÚCLEO DE ESTADO & SERVIÇOS                       │
├────────────────────────────────────────────────────────────────────────┤
│• AppContext (LocalStorage: Usuário, Cofre, Checklist, Tema Dark/Light) │
│• MockGrants (12 Editais com Datas Fixas & 4 Status de Verificação)     │
│• Server.ts (Express Proxy, Gemini AI Grounded, Favicon SVG Handler)    │
│• Tailwind v4 + Utopia Fluid Scale + Newsreader / Plus Jakarta Sans     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Roteiro de Execução de Código (Concluído)

1. [x] **Fundação e Head**:
   * Atualizado `index.html` com metadados, links das famílias tipográficas Google Fonts (*Newsreader*, *Playfair Display*, *Plus Jakarta Sans*, *Space Grotesk*) e classes base no `body`.
   * Criado `public/favicon.svg` com insígnia editorial gradiente vermelha e dourada.
   * Adicionada rota dedicada `/favicon.ico` no `server.ts` servindo o SVG sem erros 404.
2. [x] **Estilização Global & Módulo de Impressão**:
   * Atualizado `src/index.css` com paleta editorial, tokens Utopia e bloco `@media print` otimizado.
   * Atualizado `src/App.tsx` agrupando elementos não imprimíveis em contêineres `print:hidden`.
3. [x] **Componentes do Artista & Dossiê**:
   * `DocUpdateModal.tsx`: Adicionados links seguros diretos aos portais oficiais de emissão de CNDs (Federal/PGFN, Estadual/PGE-SP, Municipal/Indaiatuba, Trabalhista/TST, FGTS/Caixa).
   * `ChecklistPage.tsx`: Adicionado botão "Imprimir Dossiê" (`window.print()`) pronto para gerar PDF técnico limpo.
   * `CatalogPage.tsx`: Implementados chips de filtros ativos com remoção individual e botão "Limpar todos os filtros".
   * `HomePage.tsx`: Implementado o ribbon editorial de métricas de fomento, botões de busca rápida por área/edital de 1 clique e contadores dinâmicos nos perfis de artista.
   * `EmpresasPage.tsx`: Substituído `window.alert` pelo sistema de notificações Toast.
4. [x] **Verificação & Testes**:
   * Executado `tsc --noEmit` com 0 erros de tipagem TypeScript.
   * Executado `npm run build` com sucesso gerando o pacote de produção otimizado via Vite.
   * Servidor dev reiniciado e operacional.
