import React, { useState, useEffect } from 'react';
import { Button, Space, message, Input } from 'antd';
import { Graph } from '../../types';

const { TextArea } = Input;

interface JsonEditorProps {
  graph: Graph;
  onGraphChange: (graph: Graph) => void;
  onReset: () => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ graph, onGraphChange, onReset }) => {
  const [jsonText, setJsonText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      setJsonText(JSON.stringify(graph, null, 2));
      setError(null);
    } catch (error) {
      console.error('序列化图谱数据失败:', error);
      setError('序列化图谱数据失败');
    }
  }, [graph]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setError(null);
  };
  
  const handleApply = () => {
    try {
      if (!jsonText.trim()) {
        throw new Error('JSON不能为空');
      }
      
      const parsedData = JSON.parse(jsonText) as Graph;
      
      if (!Array.isArray(parsedData.nodes) || !Array.isArray(parsedData.edges)) {
        throw new Error('JSON格式错误，缺少nodes或edges数组');
      }
      
      onGraphChange(parsedData);
      message.success('应用JSON数据成功');
      setError(null);
    } catch (error) {
      console.error('解析JSON失败:', error);
      setError(error instanceof Error ? error.message : '未知错误');
      message.error(`解析JSON失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };
  
  const handleExport = () => {
    try {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(graph, null, 2))}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'knowledge_graph.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };
  
  const handleImport = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'application/json';
    
    inputElement.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content) as Graph;
          
          if (!Array.isArray(parsedData.nodes) || !Array.isArray(parsedData.edges)) {
            throw new Error('JSON格式错误，缺少nodes或edges数组');
          }
          
          setJsonText(JSON.stringify(parsedData, null, 2));
          onGraphChange(parsedData);
          message.success('导入成功');
          setError(null);
        } catch (error) {
          console.error('导入失败:', error);
          setError(error instanceof Error ? error.message : '未知错误');
          message.error(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      };
      
      reader.readAsText(file);
    });
    
    inputElement.click();
  };
  
  return (
    <div style={{ padding: '16px' }}>
      <h3>JSON 编辑器</h3>
      <TextArea 
        value={jsonText}
        onChange={handleTextChange}
        placeholder="在此编辑知识图谱的JSON数据..."
        autoSize={{ minRows: 10, maxRows: 20 }}
        status={error ? 'error' : undefined}
        style={{ 
          marginBottom: '8px',
          fontFamily: 'monospace'
        }}
      />
      {error && (
        <div style={{ color: 'red', marginBottom: '8px' }}>
          {error}
        </div>
      )}
      <Space>
        <Button 
          type="primary" 
          onClick={handleApply}
        >
          应用
        </Button>
        <Button onClick={onReset}>重置</Button>
        <Button onClick={handleExport}>导出</Button>
        <Button onClick={handleImport}>导入</Button>
      </Space>
    </div>
  );
};

export default JsonEditor; 