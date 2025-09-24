
import { GoogleGenAI, Type } from "@google/genai";
import { AIFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        betterIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggestions for improving the content and structure of the answer. Provide 1-2 simple ideas."
        },
        vocabularyBoost: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    original: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ["original", "suggestion", "explanation"],
                propertyOrdering: ["original", "suggestion", "explanation"]
            },
            description: "Suggest 2-3 simple, professional vocabulary words with explanations."
        },
        grammarFixes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    original: { type: Type.STRING, description: "The original sentence with the error." },
                    corrected: { type: Type.STRING, description: "The corrected sentence." }
                },
                required: ["original", "corrected"],
                propertyOrdering: ["original", "corrected"]
            },
            description: "Correct any grammatical errors in the student's answer."
        }
    },
    required: ["betterIdeas", "vocabularyBoost", "grammarFixes"],
    propertyOrdering: ["betterIdeas", "vocabularyBoost", "grammarFixes"]
};


export const getAIFeedback = async (question: string, answer: string): Promise<AIFeedback> => {
    if (!answer.trim()) {
        throw new Error("Answer cannot be empty.");
    }
    
    try {
        const prompt = `
        You are an AI assistant for an A2+ to B1 level English learner practicing for a job interview.
        Your tone should be encouraging, clear, and simple.
        The interview question is: "${question}"
        The student's answer is: "${answer}"

        Please provide constructive feedback based on their answer. Your feedback must be in three sections:
        1. Better Ideas: Gently suggest one or two alternative ideas or ways to structure the answer to make it more compelling. Keep the language simple.
        2. Vocabulary Boost: Suggest 2-3 simple, more professional words to replace words in their answer. Provide the original word, the suggested replacement, and a very simple explanation.
        3. Grammar Fixes: Correct any grammatical errors in the student's answer.
        
        Generate the response according to the provided JSON schema. IMPORTANT: For any of the feedback categories (betterIdeas, vocabularyBoost, grammarFixes) where you have no suggestions, you MUST provide an empty array for that key in the JSON. For example, if there are no grammar mistakes, the value for "grammarFixes" must be []. Do not write a text message like "no mistakes found".
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: feedbackSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const feedback = JSON.parse(jsonText) as AIFeedback;
        return feedback;

    } catch (error) {
        console.error("Error getting AI feedback:", error);
        throw new Error("Failed to get feedback from AI. Please check your API key and try again.");
    }
};
