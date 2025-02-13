// openai.ts
import Taro from '@tarojs/taro'

interface Message {
  role: string;
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    }
  }>;
}

export function createOpenAI(apiKey: string) {
  return {
    async chatCompletion(messages: Message[]): Promise<ChatResponse> {
      const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
      console.log('apiKey : ', apiKey);
      
      try {
        const res = await Taro.request({
          url: 'https://chatapi.littlewheat.com/v1/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          data: {
            model: 'deepseek-chat',
            messages: messages,
          }
        });

        if (res.statusCode === 200) {
          return res.data;
        } else {
          throw new Error('请求失败');
        }
      } catch (error) {
        throw error;
      }
    }
  };
}