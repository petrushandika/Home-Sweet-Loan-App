import { Controller, Post, Body, Req, UseGuards, Sse } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Observable } from 'rxjs';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Req() req: any, @Body() body: { message: string }) {
    const userId = req.user.id;
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return {
        success: false,
        message: 'Message cannot be empty',
      };
    }

    try {
      const response = await this.aiService.chat(userId, message);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get AI response',
      };
    }
  }

  @Sse('chat/stream')
  async streamChat(
    @Req() req: any,
    @Body() body: { message: string },
  ): Promise<Observable<MessageEvent>> {
    const userId = req.user.id;
    const { message } = body;

    return new Observable((subscriber) => {
      (async () => {
        try {
          const stream = await this.aiService.streamChat(userId, message);

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              subscriber.next({
                data: { content },
              } as MessageEvent);
            }
          }

          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }
}
