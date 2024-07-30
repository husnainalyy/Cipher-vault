import fetch from 'node-fetch';

export async function getCohereResponse(prompt: string, apiKey: string) {
    try {
        const endpoint = 'https://api.cohere.com/v1/generate';

        const data = {
            model: 'command-xlarge-nightly',
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.7,
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cohere API error response:', errorText);
            throw new Error('Failed to generate questions.');
        }

        const jsonResponse = await response.json();
        console.log('Cohere API response:', jsonResponse);

        return {
            ok: true,
            generated_text: jsonResponse.generations[0].text,
        };
    } catch (error: any) {
        console.error('Error in getCohereResponse:', error.message);
        return {
            ok: false,
            error: error.message,
        };
    }
}
