import json

with open('/tmp/imported_minutes_2026.json', 'r') as f:
    data = json.load(f)

months_order = [
    ('October 2026', 'oct-2026', 'October 21, 2026'),
    ('September 2026', 'sep-2026', 'September 16, 2026'),
    ('August 2026', 'aug-2026', 'August 19, 2026'),
    ('July 2026', 'jul-2026', 'July 15, 2026'),
    ('June 2026', 'jun-2026', 'June 17, 2026'),
    ('May 2026', 'may-2026', 'May 20, 2026'),
    ('April 2026', 'apr-2026', 'April 15, 2026'),
    ('March 2026', 'mar-2026', 'March 18, 2026'),
    ('February 2026', 'feb-2026', 'February 18, 2026'),
    ('January 2026', 'jan-2026', 'January 21, 2026'),
]

data_by_month = {item['month']: item for item in data}

lines = [
    'export interface SimpleMeetingNote {',
    '  id: string;',
    '  month: string;',
    '  date: string;',
    '  notes: string;',
    '}',
    '',
    'export const DEFAULT_MINUTES: SimpleMeetingNote[] = ['
]

for m_name, m_id, m_date in months_order:
    item = data_by_month[m_name]
    text = item['text'].strip()
    # Format notes as a multi-line string using template literals or standard JSON string
    # Using JSON.dumps(text) makes it 100% syntactically valid and immune to escaping problems!
    json_notes = json.dumps(text)
    lines.append('  {')
    lines.append(f'    id: {json.dumps(m_id)},')
    lines.append(f'    month: {json.dumps(m_name)},')
    lines.append(f'    date: {json.dumps(m_date)},')
    lines.append(f'    notes: {json_notes}')
    lines.append('  },')

lines.append('];\n')

with open('src/data/defaultMinutes.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('defaultMinutes.ts successfully written with', len(months_order), 'entries!')
