import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'investor_pitch.html');
        const fileContents = fs.readFileSync(filePath, 'utf8');

        return new NextResponse(fileContents, {
            headers: {
                'Content-Type': 'text/html',
            },
        });
    } catch (error) {
        return new NextResponse('Pitch deck not found', { status: 404 });
    }
}
