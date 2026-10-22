import React, { useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, CalendarCheck, CircleHelp, ExternalLink, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LegalEligibility } from '../types';

const legalOptions: { value: LegalEligibility; label: string }[] = [
  { value: 'pf', label: 'Pessoa física (PF)' },
  { value: 'mei', label: 'MEI' },
  { value: 'empresa', label: 'Empresa / pessoa jurídica' },
  { value: 'coletivo', label: 'Coletivo cultural' },
];

type Answer = 'sim' | 'nao' | 'naosei';

export const EligibilityPage: React.FC = () => {
  const { grants, selectedGrantId, setSelectedGrantId, setCurrentView, user } = useApp();
  const [city, setCity] = useState(user?.city || '');
  const [yearsResidence, setYearsResidence] = useState('');
  const [legal, setLegal] = useState<LegalEligibility>('pf');
  const [accounts, setAccounts] = useState<Answer>('naosei');
  const [quota, setQuota] = useState<Answer>('naosei');
  const [mapa, setMapa] = useState<Answer>('naosei');
  const [diagnosed, setDiagnosed] = useState(false);
  const grant = grants.find(item => item.id === selectedGrantId) || grants[0];

  const result = useMemo(() => {
    if (!grant) return { status: 'Conferir no edital oficial', reasons: ['Selecione uma oportunidade para iniciar.'], caution: true };
    const reasons: string[] = [];
    let blocker = false;
    let caution = false;

    if (!grant.eligibleLegal.includes(legal)) {
      blocker = true;
      reasons.push(`O cadastro deste edital não inclui ${legalOptions.find(item => item.value === legal)?.label || legal} entre os formatos aceitos.`);
    } else {
      reasons.push(`${legalOptions.find(item => item.value === legal)?.label || legal} consta entre os formatos aceitos no cadastro deste edital.`);
    }

    if (grant.city && city.trim()) {
      if (grant.city.toLocaleLowerCase('pt-BR') !== city.trim().toLocaleLowerCase('pt-BR')) {
        blocker = true;
        reasons.push(`O edital está cadastrado para ${grant.city}; a cidade informada foi ${city}.`);
      } else {
        reasons.push(`A cidade informada corresponde ao território cadastrado (${grant.city}).`);
      }
    } else {
      caution = true;
      reasons.push('A exigência territorial precisa ser conferida no regulamento; a cidade, sozinha, não comprova residência ou tempo mínimo de atuação.');
    }

    if (accounts === 'sim') {
      caution = true;
      reasons.push('Você informou uma pendência de prestação de contas. Confira se o edital ou a legislação aplicável impede a participação.');
    } else if (accounts === 'naosei') {
      caution = true;
      reasons.push('Confirme sua situação de prestação de contas antes de se inscrever.');
    }

    if (yearsResidence === '' || mapa === 'naosei' || quota === 'naosei') caution = true;
    if (yearsResidence !== '') reasons.push(`Tempo de residência informado: ${yearsResidence} ano(s). O mínimo exigido só pode ser confirmado no edital específico.`);
    if (mapa === 'nao') reasons.push('Você ainda não confirmou cadastro no Mapa Cultural ou na plataforma exigida pelo município. Verifique se o edital exige esse cadastro e conclua-o com antecedência.');
    if (quota === 'sim') reasons.push('Se pretende concorrer por cotas, confira os critérios, documentos e modelo de autodeclaração previstos no edital.');
    if (quota === 'nao') reasons.push('Você indicou que não pretende concorrer por cotas; confirme se há regras específicas aplicáveis ao seu caso.');
    if (grant.noticeType !== 'real' || grant.isFictitiousNotice.toLowerCase().includes('modelo educativo')) {
      caution = true;
      reasons.push('Este registro pode ser um modelo educativo. Não use o resultado como confirmação jurídica; confira a oportunidade oficial específica.');
    }

    return { status: blocker ? 'Possível incompatibilidade' : caution ? 'Conferir no edital oficial' : 'Compatibilidade preliminar', reasons, caution };
  }, [grant, legal, city, yearsResidence, accounts, quota, mapa]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-7">
      <button onClick={() => setCurrentView('catalog')} className="btn-secondary px-4 py-2 text-xs inline-flex items-center gap-2 min-h-[42px]"><ArrowLeft className="w-4 h-4" /> Voltar ao catálogo</button>
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"><BadgeCheck className="w-4 h-4" /> Diagnóstico preliminar</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Posso me inscrever?</h1>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">Responda às perguntas para organizar os pontos que precisam ser verificados. O resultado é uma triagem educativa, não uma decisão jurídica nem garantia de elegibilidade.</p>
      </header>

      <section className="bento-card space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200" htmlFor="eligibility-grant">Edital para avaliar</label>
          <select id="eligibility-grant" value={grant?.id || ''} onChange={event => { setSelectedGrantId(event.target.value); setDiagnosed(false); }} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus-ring">
            {grants.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label htmlFor="eligibility-city" className="block text-sm font-semibold mb-2">1. Em qual cidade você mora?</label><input id="eligibility-city" value={city} onChange={event => setCity(event.target.value)} placeholder="Ex.: Indaiatuba" className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus-ring" /></div>
          <div><label htmlFor="eligibility-years" className="block text-sm font-semibold mb-2">2. Há quantos anos mora nessa cidade?</label><input id="eligibility-years" type="number" min="0" max="100" value={yearsResidence} onChange={event => setYearsResidence(event.target.value)} placeholder="Informe o número de anos" className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus-ring" /></div>
          <div><label htmlFor="eligibility-legal" className="block text-sm font-semibold mb-2">3. Qual é o formato do proponente?</label><select id="eligibility-legal" value={legal} onChange={event => setLegal(event.target.value as LegalEligibility)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus-ring">{legalOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
          <div><span className="block text-sm font-semibold mb-2">4. Existe prestação de contas pendente?</span><div className="flex flex-wrap gap-2">{([{value:'sim',label:'Sim'},{value:'nao',label:'Não'},{value:'naosei',label:'Não sei'}] as const).map(option => <button key={option.value} type="button" onClick={() => setAccounts(option.value)} aria-pressed={accounts === option.value} className={`px-3 py-2 rounded-lg border text-xs ${accounts === option.value ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-white/10'}`}>{option.label}</button>)}</div></div>
          <div><span className="block text-sm font-semibold mb-2">5. Pretende concorrer por cotas?</span><div className="flex flex-wrap gap-2">{([{value:'sim',label:'Sim'},{value:'nao',label:'Não'},{value:'naosei',label:'Ainda não sei'}] as const).map(option => <button key={option.value} type="button" onClick={() => setQuota(option.value)} aria-pressed={quota === option.value} className={`px-3 py-2 rounded-lg border text-xs ${quota === option.value ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-white/10'}`}>{option.label}</button>)}</div></div>
          <div><span className="block text-sm font-semibold mb-2">6. Já tem cadastro no Mapa Cultural ou na plataforma exigida?</span><div className="flex flex-wrap gap-2">{([{value:'sim',label:'Sim'},{value:'nao',label:'Não'},{value:'naosei',label:'Não sei'}] as const).map(option => <button key={option.value} type="button" onClick={() => setMapa(option.value)} aria-pressed={mapa === option.value} className={`px-3 py-2 rounded-lg border text-xs ${mapa === option.value ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-white/10'}`}>{option.label}</button>)}</div></div>
        </div>
        <button onClick={() => setDiagnosed(true)} className="btn-primary px-5 py-3 text-sm min-h-[44px] inline-flex items-center gap-2"><CircleHelp className="w-4 h-4" /> Analisar minhas respostas</button>
      </section>

      {diagnosed && <section aria-live="polite" className="bento-card space-y-4">
        <div className="flex items-start gap-3"><div className={`p-2 rounded-xl ${result.status === 'Possível incompatibilidade' ? 'bg-amber-500/10 text-amber-600' : 'bg-teal-500/10 text-teal-600 dark:text-teal-300'}`}>{result.status === 'Possível incompatibilidade' ? <ShieldAlert className="w-5 h-5" /> : <CalendarCheck className="w-5 h-5" />}</div><div><h2 className="text-xl font-bold text-slate-900 dark:text-white">{result.status}</h2><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Resultado baseado nos dados cadastrados; não substitui a leitura do regulamento oficial.</p></div></div>
        <ul className="space-y-3">{result.reasons.map((reason, index) => <li key={index} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 flex gap-2"><span className="text-teal-600">•</span><span>{reason}</span></li>)}</ul>
        {grant?.officialUrl && <a href={grant.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300 hover:underline">Conferir fonte indicada <ExternalLink className="w-4 h-4" /></a>}
        <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">Importante: o cadastro pode conter dados de demonstração. Antes de tomar uma decisão, confira o edital específico, suas retificações e o canal oficial de inscrição.</p>
      </section>}
    </div>
  );
};
