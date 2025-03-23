import React, { useState } from 'react';
import { Input, Button, Space, message, Upload, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ModelConfig } from '../../types';
import { parseTextWithAI } from '../../utils/api';
import type { RcFile, UploadProps } from 'antd/es/upload';

const { TextArea } = Input;

interface TextEditorProps {
  modelConfig: ModelConfig | null;
  onParseResult: (result: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  modelConfig, 
  onParseResult,
  loading,
  setLoading
}) => {
  const [text, setText] = useState<string>('');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleParse = async () => {
    if (!text.trim()) {
      message.warning('请输入需要解析的文本');
      return;
    }
    
    if (!modelConfig) {
      message.warning('请先配置大模型API');
      return;
    }
    
    try {
      setLoading(true);
      const result = await parseTextWithAI(text, modelConfig);
      
      if (result.success && result.graph) {
        onParseResult(result.graph);
        message.success('文本解析成功');
      } else {
        message.error(`解析失败: ${result.error || '未知错误'}`);
      }
    } catch (error) {
      message.error('解析过程中发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload: UploadProps['beforeUpload'] = (file: RcFile) => {
    const reader = new FileReader();
    
    reader.onload = e => {
      if (e.target?.result) {
        const content = e.target.result as string;
        setText(content);
        message.success(`文件 ${file.name} 已成功加载`);
      }
    };
    
    reader.onerror = () => {
      message.error('文件读取失败');
    };
    
    reader.readAsText(file);
    
    // 返回false阻止自动上传
    return false;
  };
  
  return (
    <div style={{ padding: '16px' }}>
      <h3>AI解析</h3>
      
      <Space style={{ marginBottom: '16px' }}>
        <Upload 
          accept=".txt,.md,.json,.csv"
          showUploadList={false}
          beforeUpload={handleFileUpload}
        >
          <Button icon={<UploadOutlined />}>上传文本文件</Button>
        </Upload>
        <Button onClick={() => setText('')}>清空</Button>
      </Space>
      
      <TextArea 
        value={text}
        onChange={handleTextChange}
        placeholder="请输入或上传需要解析为知识图谱的文本..."
        autoSize={{ minRows: 10, maxRows: 20 }}
        style={{ marginBottom: '16px' }}
      />
      
      <Divider style={{ margin: '8px 0' }} />
      
      <Button 
        type="primary" 
        onClick={handleParse}
        loading={loading}
        disabled={!modelConfig || !text.trim()}
        block
      >
        使用AI解析
      </Button>
    </div>
  );
};

export default TextEditor; 