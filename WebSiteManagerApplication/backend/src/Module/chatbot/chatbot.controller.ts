import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post(':entrepriseId')
  async askChatbot(
    @Param('entrepriseId') entrepriseId: string,
    @Body('question') question: string
  ) {
    const answer = await this.chatbotService.askEntrepriseChatbot(entrepriseId, question);
    return { answer };
  }

  @Get('typographies/:entrepriseId')
  async getAllTypographies(@Param('entrepriseId') entrepriseId: string) {
    const fonts = await this.chatbotService.extractAllEntrepriseTypographies(entrepriseId);
    return { fonts };
  }

  @Post('fonts/:entrepriseId')
  async askFontsAI(@Param('entrepriseId') entrepriseId: string) {
    const answer = await this.chatbotService.askEntrepriseFontsAI(entrepriseId);
    return { answer };
  }
} 