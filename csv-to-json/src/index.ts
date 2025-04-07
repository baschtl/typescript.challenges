import { readFileSync } from 'fs';
import { join } from 'path';

const csvToJson = (fileName: string): Record<string, string | number>[] => {
    const file = readFileSync(join(__dirname, fileName), 'utf-8');
    const lines = file
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0);

    const header = lines[0]
        .split(',')
        .map((h) => h.trim());

    return lines.slice(1).map((l) => {
        const lineData = l.split(',');
        const entry: Record<string, string | number> = {}

        header.forEach((h, i) => {
            entry[h] = numberOrString(lineData[i].trim());
        });

        return entry;
    });
}

const numberOrString = (value: string): string | number => {
    if (isNaN(Number(value))) {
        return value;
    } else {
        return Number(value);
    }
}


console.log(csvToJson('data.csv'));