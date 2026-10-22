import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'O que é o Cultura em Cena?',
    answer:
      'Uma plataforma editorial independente e prática desenvolvida para desmistificar o fomento cultural no Brasil. O portal reúne editais abertos (como PNAB, ProAC e Rouanet), guias de conformidade técnica, cofre seguro para certidões e um simulador de preparação para proponentes de Indaiatuba e região metropolitana.',
  },
  {
    question: 'Os editais listados são oficiais?',
    answer:
      'O Cultura em Cena mapeia e indexa chamamentos públicos divulgados em Diários Oficiais e portais governamentais, fornecendo links diretos para cada publicação de origem. Editais de treino são identificados como modelos didáticos para estudos e simulações sem efeito jurídico.',
  },
  {
    question: 'Como funciona o cofre de documentos?',
    answer:
      'O cofre é a sua central pessoal de documentos de habilitação. Ele calcula a data de vigência de certidões negativas (CNDs), comprovantes de domicílio e procurações, alertando você sobre prazos críticos para que nenhum projeto seja indeferido por vícios formais de documentação.',
  },
  {
    question: 'Sou uma empresa ou órgão público: como posso participar?',
    answer:
      'Empresas enquadradas no Lucro Real ou contribuintes de ICMS em São Paulo podem simular a destinação de seus tributos com custo líquido zero através do nosso Portal de Patrocinadores. Secretarias e órgãos públicos encontram diretrizes técnicas de transparência e apoio à execução da PNAB.',
  },
];

export const FaqSection: React.FC = () => {
  return (
    <section aria-labelledby="faq-title" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#991B1B] dark:text-red-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Dúvidas Frequentes</span>
        </div>
        <h2 id="faq-title" className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
          Perguntas sobre a plataforma e editais
        </h2>
        <p className="text-sm text-[#78716C] dark:text-[#A8A29E] max-w-xl mx-auto">
          Tire suas dúvidas sobre o funcionamento do cofre, os tipos de editais e as ferramentas para proponentes e patrocinadores.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <details
            key={index}
            className="group rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 p-4 transition-all duration-200 open:shadow-xs"
          >
            <summary className="flex items-center justify-between gap-4 font-medium text-sm sm:text-base text-[#1C1917] dark:text-[#F5F3EF] cursor-pointer list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] rounded-md py-1">
              <span>{item.question}</span>
              <ChevronDown className="w-4 h-4 text-[#78716C] dark:text-[#A8A29E] shrink-0 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-3 pt-3 border-t border-[#E6E0D5]/60 dark:border-white/5 text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1] leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};
