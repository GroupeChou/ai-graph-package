import axios from 'axios';
import { ModelConfig, Graph, ParseResult } from '../types';

// 调用Deepseek API解析文本
export const parseTextWithDeepseek = async (
  text: string, 
  config: ModelConfig
): Promise<ParseResult> => {
  try {
    const response = await axios.post(
      config.apiEndpoint || 'https://api.deepseek.com/v1/chat/completions',
      {
        model: config.modelVersion || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的知识图谱构建助手。请将用户输入的文本解析为知识图谱数据，返回JSON格式的节点和边的数据。'
          },
          {
            role: 'user',
            content: `请将以下文本解析为知识图谱数据，返回JSON格式，包含nodes和edges两个数组：${text}`
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 解析返回的JSON数据
    const content = response.data.choices[0].message.content;
    const graph = JSON.parse(content) as Graph;
    
    return {
      success: true,
      graph
    };
  } catch (error) {
    console.error('Deepseek API调用失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

// 调用千问API解析文本
export const parseTextWithQianwen = async (
  text: string, 
  config: ModelConfig
): Promise<ParseResult> => {
  try {
    const response = await axios.post(
      config.apiEndpoint || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: config.modelVersion || 'qwen-max',
        input: {
          messages: [
            {
              role: 'system',
              content: '你是一个专业的知识图谱构建助手。请将用户输入的文本解析为知识图谱数据，返回JSON格式的节点和边的数据。'
            },
            {
              role: 'user',
              content: `请将以下文本解析为知识图谱数据，返回JSON格式，包含nodes和edges两个数组：${text}`
            }
          ]
        },
        parameters: {
          result_format: 'json'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 解析返回的JSON数据
    const content = response.data.output.text;
    const graph = JSON.parse(content) as Graph;
    
    return {
      success: true,
      graph
    };
  } catch (error) {
    console.error('千问API调用失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

// 根据配置选择并调用相应的API
export const parseTextWithAI = async (
  text: string, 
  config: ModelConfig
): Promise<ParseResult> => {
  if (config.type === 'deepseek') {
    return parseTextWithDeepseek(text, config);
  } else if (config.type === 'qianwen') {
    return parseTextWithQianwen(text, config);
  } else {
    return {
      success: false,
      error: '不支持的模型类型'
    };
  }
}; 