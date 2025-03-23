# 知识图谱可视化编辑器

一个基于React和D3.js的知识图谱可视化编辑工具，支持通过配置DeepSeek或千问大模型API，智能解析文本内容，或直接编辑JSON数据生成动态交互的知识图谱。

## 功能特点

- **双向动态交互编辑**：支持文本和可视化图的双向动态交互编辑
- **大模型API集成**：支持配置DeepSeek或千问大模型API，智能解析文本内容
- **文本文件上传解析**：支持上传文本文件并通过AI解析生成知识图谱
- **JSON数据导入/导出**：支持直接导入/编辑/导出JSON数据
- **专业级可视化**：基于D3.js实现的专业知识图谱可视化
- **左右两栏式布局**：右侧为知识图谱可视化界面，左侧为文本及功能配置界面

## 安装与运行

```bash
# 安装依赖
npm install

# 启动Web开发服务器
npm start

# 启动Electron开发环境
npm run electron:dev
```

## 打包为可执行文件

本项目支持打包为Windows、macOS和Linux平台的可执行文件：

```bash
# 根据当前系统环境打包
npm run electron:build

# 打包为Windows可执行文件
npm run electron:build:win

# 打包为macOS可执行文件
npm run electron:build:mac

# 打包为Linux可执行文件
npm run electron:build:linux
```

打包后的文件将位于`dist`目录中。

## 使用方法

1. **配置大模型API**：
   - 在"模型配置"标签页中设置DeepSeek或千问API密钥和相关配置
   - 支持将配置保存到本地，方便下次使用

2. **通过AI解析生成知识图谱**：
   - 在"AI解析"标签页中输入文本或上传文本文件（支持.txt、.md、.json、.csv等格式）
   - 点击"使用AI解析"按钮，系统将调用配置的大模型API解析文本内容

3. **通过JSON数据生成知识图谱**：
   - 在"JSON编辑"标签页中直接编辑JSON数据
   - 支持导入/导出JSON文件
   - 点击"应用"按钮应用更改

4. **查看和交互知识图谱**：
   - 右侧界面实时显示知识图谱
   - 支持拖拽、缩放等交互操作
   - 点击节点或关系可查看详细信息

5. **图谱信息查看**：
   - 在"图谱信息"标签页中查看节点和关系的详细信息
   - 支持加载示例图谱快速开始使用

## 示例图谱数据格式

```json
{
  "nodes": [
    { "id": "1", "label": "苹果", "type": "fruit", "color": "#ff7875" },
    { "id": "2", "label": "香蕉", "type": "fruit", "color": "#ffc53d" },
    { "id": "3", "label": "水果", "type": "category", "color": "#73d13d" }
  ],
  "edges": [
    { "id": "e1", "source": "1", "target": "3", "label": "属于" },
    { "id": "e2", "source": "2", "target": "3", "label": "属于" }
  ]
}
```

## 技术栈

- React
- TypeScript
- D3.js (知识图谱可视化)
- Ant Design (UI组件库)
- Axios (API请求)
- Electron (桌面应用封装)
