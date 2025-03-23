import React, { useState, useEffect } from 'react';
import { Layout, Tabs, message } from 'antd';
import { NodeIndexOutlined, FileTextOutlined, SettingOutlined, CodeOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './App.css';
import KnowledgeGraph from './components/graph/KnowledgeGraph';
import TextEditor from './components/text-editor/TextEditor';
import ModelConfig from './components/model-config/ModelConfig';
import JsonEditor from './components/json-editor/JsonEditor';
import { Graph, ModelConfig as ModelConfigType, Node, Edge } from './types';

const { Header, Sider, Content } = Layout;

// 默认图谱数据
const defaultGraph: Graph = {
  nodes: [],
  edges: []
};

// 示例图谱数据
const exampleGraph: Graph = {
  nodes: [
    { id: '1', label: '苹果', type: 'fruit', color: '#ff7875' },
    { id: '2', label: '香蕉', type: 'fruit', color: '#ffc53d' },
    { id: '3', label: '水果', type: 'category', color: '#73d13d' },
    { id: '4', label: '食物', type: 'category', color: '#40a9ff' },
  ],
  edges: [
    { id: 'e1', source: '1', target: '3', label: '属于' },
    { id: 'e2', source: '2', target: '3', label: '属于' },
    { id: 'e3', source: '3', target: '4', label: '是一种' },
  ]
};

const App: React.FC = () => {
  const [graph, setGraph] = useState<Graph>(defaultGraph);
  const [modelConfig, setModelConfig] = useState<ModelConfigType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  
  // 尝试从本地存储加载模型配置
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('modelConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig) as ModelConfigType;
        setModelConfig(config);
      }
    } catch (error) {
      console.error('从本地存储加载配置失败:', error);
    }
  }, []);
  
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    message.info(`选中节点: ${node.label}`);
  };
  
  const handleEdgeClick = (edge: Edge) => {
    setSelectedEdge(edge);
    message.info(`选中关系: ${edge.label}`);
  };
  
  const handleParseResult = (result: Graph) => {
    setGraph(result);
  };
  
  const handleGraphChange = (newGraph: Graph) => {
    setGraph(newGraph);
  };
  
  const resetGraph = () => {
    setGraph(defaultGraph);
    setSelectedNode(null);
    setSelectedEdge(null);
  };
  
  const loadExampleGraph = () => {
    setGraph(exampleGraph);
    setSelectedNode(null);
    setSelectedEdge(null);
    message.success('已加载示例图谱');
  };
  
  // 定义标签页内容
  const tabItems = [
    {
      key: '1',
      label: <span><FileTextOutlined />AI解析</span>,
      children: (
        <TextEditor
          modelConfig={modelConfig}
          onParseResult={handleParseResult}
          loading={loading}
          setLoading={setLoading}
        />
      )
    },
    {
      key: '2',
      label: <span><CodeOutlined />JSON编辑</span>,
      children: (
        <JsonEditor
          graph={graph}
          onGraphChange={handleGraphChange}
          onReset={resetGraph}
        />
      )
    },
    {
      key: '3',
      label: <span><SettingOutlined />模型配置</span>,
      children: (
        <ModelConfig
          onConfigChange={setModelConfig}
          initialConfig={modelConfig}
        />
      )
    },
    {
      key: '4',
      label: <span><NodeIndexOutlined />图谱信息</span>,
      children: (
        <div style={{ padding: '16px' }}>
          <h3>图谱信息</h3>
          <p>节点数量: {graph.nodes.length}</p>
          <p>关系数量: {graph.edges.length}</p>
          
          {selectedNode && (
            <div>
              <h4>选中节点</h4>
              <p>ID: {selectedNode.id}</p>
              <p>标签: {selectedNode.label}</p>
              <p>类型: {selectedNode.type || '未指定'}</p>
              {selectedNode.properties && (
                <div>
                  <p>属性:</p>
                  <pre>{JSON.stringify(selectedNode.properties, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          
          {selectedEdge && (
            <div>
              <h4>选中关系</h4>
              <p>ID: {selectedEdge.id}</p>
              <p>标签: {selectedEdge.label}</p>
              <p>源节点: {graph.nodes.find(n => n.id === selectedEdge.source)?.label || selectedEdge.source}</p>
              <p>目标节点: {graph.nodes.find(n => n.id === selectedEdge.target)?.label || selectedEdge.target}</p>
              {selectedEdge.properties && (
                <div>
                  <p>属性:</p>
                  <pre>{JSON.stringify(selectedEdge.properties, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          
          <div style={{ marginTop: '16px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); loadExampleGraph(); }}>加载示例图谱</a>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <div className="logo">知识图谱可视化编辑器</div>
      </Header>
      
      <Layout>
        <Sider 
          width={400} 
          theme="light"
          style={{ 
            height: 'calc(100vh - 64px)',
            overflow: 'auto' 
          }}
        >
          <Tabs defaultActiveKey="1" style={{ padding: '8px' }} items={tabItems} />
        </Sider>
        
        <Content style={{ position: 'relative' }}>
          <div className="graph-container">
            {graph.nodes.length > 0 ? (
              <KnowledgeGraph 
                data={graph} 
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
              />
            ) : (
              <div className="empty-graph">
                <p>暂无图谱数据</p>
                <p>请通过左侧面板输入文本或JSON数据生成图谱</p>
                <a href="#" onClick={(e) => { e.preventDefault(); loadExampleGraph(); }}>加载示例图谱</a>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
