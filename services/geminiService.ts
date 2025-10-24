
import { GoogleGenAI, Type } from "@google/genai";
import { FormData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLayoutAndImagePrompt = async (formData: FormData): Promise<{ layoutDescription: string; imagePrompt: string }> => {
  const prompt = `
    Based on the following user requirements for a web application UI, generate a concise layout description and a detailed prompt for an image generation model to create a visual mockup.

    User Requirements:
    - App Description: ${formData.description}
    - Color Theme: ${formData.theme}
    - Responsiveness: ${formData.responsiveness}
    ${formData.extraDetails ? `- Extra Details: ${formData.extraDetails}` : ''}

    Return a JSON object with two keys: "layoutDescription" and "imagePrompt".
    - "layoutDescription": A brief, clear description of the proposed UI layout.
    - "imagePrompt": A highly detailed and descriptive prompt for a text-to-image AI. Include details about components (charts, tables, cards), color scheme, layout structure (header, sidebar, main content), and overall aesthetic. Style it like a professional UI mockup.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          layoutDescription: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
        },
        required: ["layoutDescription", "imagePrompt"],
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

export const generateImagePreview = async (prompt: string): Promise<{ base64s: string[] }> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 2,
      aspectRatio: '16:9',
      outputMimeType: 'image/png',
    },
  });

  if (!response.generatedImages || response.generatedImages.length < 2) {
    throw new Error("Image generation failed or did not return enough images.");
  }

  const base64s: string[] = response.generatedImages.map(img => img.image.imageBytes);
  return { base64s };
};

export const generateFinalCode = async (formData: FormData, layoutDescription: string, imageBase64: string): Promise<string> => {
  const prompt = `
    You are a world-class senior frontend engineer. Your task is to generate a single, complete, and **fully functional** HTML file based on the provided requirements and visual reference.

    **Instructions:**
    1.  Create a single HTML file. This file must be self-contained.
    2.  Use the Tailwind CSS CDN for styling. Do not use any other CSS or styling methods.
    3.  The HTML must be well-structured and semantic.
    4.  **Implement functional JavaScript within a <script> tag at the end of the body.** The UI must be interactive and feel like a live application.
        -   Interactive elements like buttons, dropdowns, and tabs must be fully functional.
        -   If there are charts, use a library like Chart.js (from a CDN) and populate them with realistic sample data.
        -   Data tables should be sortable or filterable if applicable.
        -   Make the UI feel alive and responsive to user actions.
    5.  The final output must be **only the HTML code**, enclosed in \`\`\`html ... \`\`\`. Do not add any explanation before or after the code block.

    **Project Requirements:**
    - **App Description:** ${formData.description}
    - **Color Theme:** ${formData.theme}
    - **Responsiveness:** ${formData.responsiveness}
    - **Layout Concept:** ${layoutDescription}
    ${formData.extraDetails ? `- **Extra Details:** ${formData.extraDetails}` : ''}

    Use the attached image as a strong visual reference for the layout, components, and overall aesthetic. Ensure the generated code accurately reflects the visual style and structure of the image.
  `;
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: imageBase64,
    },
  };

  const textPart = {
    text: prompt
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [textPart, imagePart] },
  });

  const responseText = response.text.trim();
  const codeBlockRegex = /```html\n([\s\S]*?)\n```/;
  const match = responseText.match(codeBlockRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  const htmlStartIndex = responseText.indexOf('<!DOCTYPE html>');
  if (htmlStartIndex !== -1) {
    return responseText.substring(htmlStartIndex);
  }

  return responseText;
};

export const refineFinalCode = async (existingCode: string, refinementInstruction: string): Promise<string> => {
  const prompt = `
    You are a world-class senior frontend engineer. Your task is to modify an existing HTML file based on a user's instruction.

    **Instructions:**
    1.  You will be given the complete current HTML code and a natural language instruction for how to change it.
    2.  Apply the requested change directly to the code.
    3.  Ensure the resulting code is still a single, self-contained HTML file using Tailwind CSS via CDN.
    4.  All JavaScript functionality (including charts, buttons, etc.) must remain fully functional. If the instruction involves JS, update the script tag accordingly.
    5.  The final output must be **only the updated HTML code**, enclosed in \`\`\`html ... \`\`\`. Do not add any explanation, apology, or preamble.

    **User's Refinement Instruction:**
    "${refinementInstruction}"

    **Existing HTML Code to Modify:**
    \`\`\`html
    ${existingCode}
    \`\`\`
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
  });

  const responseText = response.text.trim();
  const codeBlockRegex = /```html\n([\s\S]*?)\n```/;
  const match = responseText.match(codeBlockRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  const htmlStartIndex = responseText.indexOf('<!DOCTYPE html>');
  if (htmlStartIndex !== -1) {
    return responseText.substring(htmlStartIndex);
  }

  return responseText;
};
