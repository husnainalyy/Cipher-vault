import { NextResponse } from 'next/server';
import { getCohereResponse } from './getCohereResponse';

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const prompt = "Create a list of three open-ended and engaging questions. Each question should be intriguing, foster curiosity, and contribute to a positive conversational environment. Avoid personal or sensitive topics. Format the questions as a single string with each question separated by '||'. Example: What are your favorite leisure activities ?|| What is something you're looking forward to in the next year?||If you could have any superpower, what would it be?";

        if (!prompt) {
            return NextResponse.json({ error: 'Please provide a prompt.' }, { status: 400 });
        }

        const apiKey = process.env.COHERE_API_KEY;

        if (!apiKey) {
            console.error('API key not found.');
            return NextResponse.json({ error: 'API key not found.' }, { status: 500 });
        }

        const response = await getCohereResponse(prompt, apiKey);

        if (!response.ok) {
            console.error('Error generating questions:', response.error);
            return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 });
        }

        const { generated_text } = response;

        return NextResponse.json({ questions: generated_text }, { status: 200 });

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
