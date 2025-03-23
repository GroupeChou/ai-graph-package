import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Graph, Node, Edge } from '../../types';

interface KnowledgeGraphProps {
  data: Graph;
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data, onNodeClick, onEdgeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 将D3绘图逻辑抽取为useCallback函数，避免在useEffect中直接操作DOM
  const renderGraph = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || !data.nodes.length) return;
    
    // 清除之前的图形
    d3.select(svg).selectAll('*').remove();
    
    // 设置svg容器的宽高
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    
    // 创建力导向图
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(data.edges)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));
    
    // 创建svg元素
    const svgSelection = d3.select(svg)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform.toString());
        }) as any);
    
    // 创建容器g元素
    const g = svgSelection.append('g');
    
    // 创建边
    const links = g.selectAll('.link')
      .data(data.edges)
      .enter()
      .append('g')
      .attr('class', 'link');
    
    const paths = links.append('path')
      .attr('id', (d, i) => `path-${i}`)
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onEdgeClick) onEdgeClick(d as Edge);
      });
    
    // 创建边的文本标签
    links.append('text')
      .attr('class', 'edge-label')
      .attr('dy', -5)
      .append('textPath')
      .attr('href', (d, i) => `#path-${i}`)
      .attr('startOffset', '50%')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.label)
      .attr('font-size', '10px')
      .attr('fill', '#666');
    
    // 创建节点
    const nodes = g.selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragStarted)
        .on('drag', dragging)
        .on('end', dragEnded) as any)
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d as Node);
      });
    
    // 节点圆形
    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => d.color || '#1890ff');
    
    // 节点文本
    nodes.append('text')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.label)
      .attr('font-size', '12px')
      .attr('fill', '#333');
    
    // 更新位置
    simulation.on('tick', () => {
      // 更新边位置
      paths.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      
      // 更新节点位置
      nodes.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // 拖拽相关函数
    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragging(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return () => {
      simulation.stop();
    };
  }, [data, onNodeClick, onEdgeClick]);
  
  // 使用useEffect调用渲染函数
  useEffect(() => {
    const cleanup = renderGraph();
    return cleanup;
  }, [renderGraph]);
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
    </div>
  );
};

export default KnowledgeGraph; 