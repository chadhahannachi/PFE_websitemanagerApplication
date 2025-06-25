import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { GenerateContenuDto } from '../dto/generate-contenu.dto';
import { PredefinedComponent, predefinedComponents } from '../interfaces/predefined-component.interface';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: string = 'gemini-2.0-flash';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.logger.log('Gemini API initialized');
  }

  async generateContent(dto: GenerateContenuDto): Promise<any> {
    try {
      this.logger.log('Generating content with prompt...');
      const prompt = this.buildPrompt(dto);
      this.logger.debug('Generated prompt:', prompt);

      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const response = await result.response;
      this.logger.debug('Raw response from Gemini:', response.text());

      const content = this.parseGeminiResponse(response.text());
      this.logger.debug('Parsed content:', content);

      return content;
    } catch (error) {
      this.logger.error('Error generating content:', error);
      throw error;
    }
  }

  private buildPrompt(dto: GenerateContenuDto): string {
    const selectedComponent = predefinedComponents.find(c => c.id === dto.selectedComponentId);

    if (!selectedComponent) {
      throw new Error(`Predefined component with ID ${dto.selectedComponentId} not found.`);
    }

    let prompt = `
      You are an expert web developer. Your task is to generate a website section's HTML and CSS based on provided raw content, a base component, and user style preferences.

      Raw Content to Structure:
      ${dto.rawContent}

      Section Title: ${dto.title}
      Section Description: ${dto.description}
      Base HTML Component:
      \`\`\`html
      ${selectedComponent.baseHtml}
      \`\`\`

      Base CSS Style:
      \`\`\`css
      ${selectedComponent.baseCss}
      \`\`\`

      ${dto.stylePreferences ? `User Style Preferences: ${dto.stylePreferences}` : ''}

      Instructions:
      1. Integrate the "Raw Content to Structure" into the "Base HTML Component". Replace placeholders like \${title}, \${description}. For lists of items, parse the raw content and generate appropriate HTML (e.g., list items, cards, table rows) to replace the ITEMS_PLACEHOLDER. Create suitable HTML elements for each item (e.g., <h3> for title, <p> for description) based on the context of the base component.
      2. Adapt the "Base CSS Style" to incorporate the "User Style Preferences". Focus on colors, fonts, spacing, and overall ambiance. Maintain the structural integrity of the base CSS.
      3. Ensure the generated HTML is semantic and accessible.
      4. Ensure the generated CSS is clean, well-organized, and only includes styles relevant to the generated HTML.
      5. Do NOT include <style> or <script> tags in the HTML. Apply styles through classes or inline styles as appropriate, but prefer classes. Provide all CSS in the css_style field.
      6. Provide the output in a single JSON object with two fields: "html_component" (string) and "css_style" (string).

      JSON Format:
      {
        "html_component": "<!-- Generated HTML here -->",
        "css_style": "/* Generated CSS here */"
      }
    `;

    return prompt;
  }

  private parseGeminiResponse(response: string): any {
    try {
      this.logger.debug('Parsing Gemini response...');
      // Find the first and last curly braces to extract the JSON content reliably
      const startIndex = response.indexOf('{');
      const endIndex = response.lastIndexOf('}');

      if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        throw new Error('No JSON found in response or invalid format (missing curly braces).');
      }

      // Extract the JSON string based on curly brace boundaries
      const jsonStr = response.substring(startIndex, endIndex + 1).trim();
      this.logger.debug('Extracted JSON string:', jsonStr);

      const content = JSON.parse(jsonStr);

      // Map 'type' from Gemini response to 'layoutType' BEFORE any further processing or logging
      if (content.type) {
        content.layoutType = content.type;
        delete content.type; 
      }

      this.logger.debug('Parsed content:', content);

      // Ensure the content has the required structure
      if (!content.html_component || !content.css_style) {
        throw new Error('Invalid content structure: missing html_component or css_style');
      }

      return content;
    } catch (error) {
      this.logger.error('Error parsing Gemini response:', error);
      throw error;
    }
  }
} 