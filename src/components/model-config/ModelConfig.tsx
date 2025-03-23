import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { ModelConfig as ModelConfigType } from '../../types';

const { Option } = Select;

interface ModelConfigProps {
  onConfigChange: (config: ModelConfigType) => void;
  initialConfig?: ModelConfigType | null;
}

const ModelConfig: React.FC<ModelConfigProps> = ({ onConfigChange, initialConfig }) => {
  const [form] = Form.useForm();
  const [modelType, setModelType] = useState<'deepseek' | 'qianwen'>('deepseek');
  
  useEffect(() => {
    if (initialConfig) {
      form.setFieldsValue(initialConfig);
      setModelType(initialConfig.type);
    }
  }, [initialConfig, form]);
  
  const handleTypeChange = (value: 'deepseek' | 'qianwen') => {
    setModelType(value);
  };
  
  const handleSaveConfig = (values: any) => {
    const config: ModelConfigType = {
      type: values.type,
      apiKey: values.apiKey,
      apiEndpoint: values.apiEndpoint,
      modelVersion: values.modelVersion || (values.type === 'deepseek' ? 'deepseek-chat' : 'qwen-max')
    };
    
    onConfigChange(config);
    message.success('配置已保存');
    
    // 尝试将配置保存到本地存储
    try {
      localStorage.setItem('modelConfig', JSON.stringify(config));
    } catch (error) {
      console.error('保存配置到本地存储失败:', error);
    }
  };
  
  const loadFromLocalStorage = () => {
    try {
      const savedConfig = localStorage.getItem('modelConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig) as ModelConfigType;
        form.setFieldsValue(config);
        setModelType(config.type);
        onConfigChange(config);
        message.success('已从本地加载配置');
      } else {
        message.info('没有找到已保存的配置');
      }
    } catch (error) {
      console.error('从本地存储加载配置失败:', error);
      message.error('加载配置失败');
    }
  };
  
  return (
    <div style={{ padding: '16px' }}>
      <h3>大模型配置</h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSaveConfig}
        initialValues={{ type: 'deepseek' }}
      >
        <Form.Item
          name="type"
          label="模型类型"
          rules={[{ required: true, message: '请选择模型类型' }]}
        >
          <Select onChange={handleTypeChange}>
            <Option value="deepseek">DeepSeek</Option>
            <Option value="qianwen">千问</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="apiKey"
          label="API密钥"
          rules={[{ required: true, message: '请输入API密钥' }]}
        >
          <Input.Password placeholder="请输入API密钥" />
        </Form.Item>
        
        <Form.Item
          name="apiEndpoint"
          label="API端点 (可选)"
        >
          <Input 
            placeholder={
              modelType === 'deepseek' 
                ? 'https://api.deepseek.com/v1/chat/completions' 
                : 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
            } 
          />
        </Form.Item>
        
        <Form.Item
          name="modelVersion"
          label="模型版本 (可选)"
        >
          <Input 
            placeholder={
              modelType === 'deepseek' 
                ? 'deepseek-chat' 
                : 'qwen-max'
            } 
          />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存配置
          </Button>
          <Button 
            style={{ marginLeft: '8px' }} 
            onClick={loadFromLocalStorage}
          >
            加载已保存配置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ModelConfig; 