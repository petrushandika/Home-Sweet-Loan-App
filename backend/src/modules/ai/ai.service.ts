import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { PrismaService } from '@/config/prisma.service';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async chat(userId: string, message: string) {
    try {
      // Get user context (budget, spending, assets)
      const budget = await this.prisma.budget.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const recentSpending = await this.prisma.spending.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10,
      });

      const assets = await this.prisma.asset.findMany({
        where: { userId },
      });

      // Get user setup configuration
      const setup = await this.prisma.setupConfig.findUnique({
        where: { userId },
      });

      // Build context for AI
      const context = this.buildContext(budget, recentSpending, assets, setup);

      // Call Groq API
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful financial advisor assistant for Home Sweet Loan app. 
            
User's Financial Context:
${context}

Your role:
- Provide personalized financial advice based on user's data
- Help with budgeting, saving, and spending analysis
- Be friendly, concise, and actionable
- Use Indonesian Rupiah (Rp) for currency
- Keep responses under 200 words unless detailed analysis is requested

Always be supportive and encouraging about their financial journey.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'llama-3.3-70b-versatile', // Fast and smart
        temperature: 0.7,
        max_tokens: 1024,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

      return {
        message: aiResponse,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  private buildContext(budget: any, spending: any[], assets: any[], setup: any): string {
    let context = '';

    // Budget info
    if (budget) {
      const totalIncome = Object.values(budget.income || {}).reduce((a: number, b: number) => a + b, 0);
      const totalExpenses = Object.values(budget.expenses || {}).reduce((a: number, b: number) => a + b, 0);
      context += `\nBudget (${budget.yearMonth}):
- Total Income: Rp ${totalIncome.toLocaleString()}
- Total Expenses Allocated: Rp ${totalExpenses.toLocaleString()}
- Remaining: Rp ${budget.summary?.nonAllocated || 0}`;
    }

    // Recent spending
    if (spending.length > 0) {
      const totalSpent = spending.reduce((sum, s) => sum + Math.abs(s.amount), 0);
      context += `\n\nRecent Spending (last 10 transactions):
- Total: Rp ${totalSpent.toLocaleString()}
- Categories: ${[...new Set(spending.map(s => s.category))].join(', ')}`;
    }

    // Assets
    if (assets.length > 0) {
      const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
      const liquidAssets = assets.filter(a => a.type === 'LIQUID').reduce((sum, a) => sum + a.value, 0);
      context += `\n\nAssets:
- Total Assets: Rp ${totalAssets.toLocaleString()}
- Liquid Assets: Rp ${liquidAssets.toLocaleString()}`;
    }

    // Setup info
    if (setup) {
      context += `\n\nUser Setup:
- Income Sources: ${setup.incomeSources?.join(', ') || 'Not set'}
- Needs: ${setup.needs?.join(', ') || 'Not set'}
- Wants: ${setup.wants?.join(', ') || 'Not set'}
- Savings Goals: ${setup.savings?.join(', ') || 'Not set'}`;
    }

    return context || 'No financial data available yet.';
  }

  async streamChat(userId: string, message: string) {
    try {
      // Get context
      const budget = await this.prisma.budget.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const recentSpending = await this.prisma.spending.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10,
      });

      const assets = await this.prisma.asset.findMany({
        where: { userId },
      });

      // Get user setup configuration
      const setup = await this.prisma.setupConfig.findUnique({
        where: { userId },
      });

      const context = this.buildContext(budget, recentSpending, assets, setup);

      // Stream response
      const stream = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful financial advisor assistant for Home Sweet Loan app. 
            
User's Financial Context:
${context}

Your role:
- Provide personalized financial advice based on user's data
- Help with budgeting, saving, and spending analysis
- Be friendly, concise, and actionable
- Use Indonesian Rupiah (Rp) for currency
- Keep responses under 200 words unless detailed analysis is requested

Always be supportive and encouraging about their financial journey.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      });

      return stream;
    } catch (error) {
      console.error('Groq Stream Error:', error);
      throw new Error('Failed to stream AI response');
    }
  }
}
