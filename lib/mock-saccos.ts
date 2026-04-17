import type { ExistingSacco } from './types';
import pdfSaccos from '@/data/saccos.from-pdf.json';

const fallbackSaccos: ExistingSacco[] = [
    { id: 'sacco-1', name: 'Stima SACCO', location: 'Nairobi', memberCount: 45 },
    { id: 'sacco-2', name: 'Teachers SACCO', location: 'Nairobi', memberCount: 120 },
    { id: 'sacco-3', name: 'Equity SACCO', location: 'Mombasa', memberCount: 200 },
    { id: 'sacco-4', name: 'Kenya Power SACCO', location: 'Nairobi', memberCount: 180 },
    { id: 'sacco-5', name: 'Vision SACCO', location: 'Kisumu', memberCount: 95 },
    { id: 'sacco-6', name: 'Ushindi SACCO', location: 'Nakuru', memberCount: 67 },
    { id: 'sacco-7', name: 'Jiamii SACCO', location: 'Eldoret', memberCount: 52 },
    { id: 'sacco-8', name: 'Rafiki SACCO', location: 'Dar es Salaam', memberCount: 78 },
];

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function parseLine(line: string): { name: string; location: string; memberCount?: number } | null {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
        return null;
    }

    // Supports: "Name | Location | 120", "Name, Location", "Name - Location"
    const splitters = ['|', ',', '\t', ' - '];
    for (const splitter of splitters) {
        const parts = trimmed.split(splitter).map((part) => part.trim()).filter(Boolean);
        if (parts.length >= 2) {
            const countCandidate = parts[2] ? Number.parseInt(parts[2], 10) : undefined;
            return {
                name: parts[0],
                location: parts[1],
                memberCount: Number.isFinite(countCandidate) ? countCandidate : undefined,
            };
        }
    }

    return null;
}

export function parseSaccoList(raw: string): ExistingSacco[] {
    const rows = raw.split(/\r?\n/).map(parseLine).filter(Boolean) as Array<{
        name: string;
        location: string;
        memberCount?: number;
    }>;

    return rows.map((row, index) => ({
        id: `sacco-${index + 1}-${slugify(row.name)}`,
        name: row.name,
        location: row.location,
        memberCount: row.memberCount ?? (25 + ((index * 17) % 180)),
    }));
}

export function getMockSaccos(): ExistingSacco[] {
    const rawFromEnv = process.env.MOCK_SACCO_LIST ?? '';
    const parsed = parseSaccoList(rawFromEnv);

    if (parsed.length > 0) {
        return parsed;
    }

    const fromPdf = pdfSaccos as ExistingSacco[];
    return fromPdf.length > 0 ? fromPdf : fallbackSaccos;
}
