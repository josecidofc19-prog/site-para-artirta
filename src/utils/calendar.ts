/** Gera um arquivo iCalendar (.ics) localmente, sem conta ou serviço externo. */
const escapeIcs = (value: string) => value
  .replace(/\\/g, '\\\\')
  .replace(/\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;');

const toIcsDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export function downloadCalendarReminder(title: string, dateValue: string, description: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return;

  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}T${String(now.getUTCHours()).padStart(2, '0')}${String(now.getUTCMinutes()).padStart(2, '0')}${String(now.getUTCSeconds()).padStart(2, '0')}Z`;
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@cultura-em-cena`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cultura em Cena//Lembretes//PT-BR',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${uid}`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${toIcsDate(start)}`,
    `DTEND;VALUE=DATE:${toIcsDate(end)}`, `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(`${description}\nLembrete configurado para 30 dias antes. Confira a fonte oficial.`)}`,
    'BEGIN:VALARM', 'TRIGGER:-P30D', 'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs(`Em 30 dias: ${title}`)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', ''
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 64) || 'lembrete'}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
