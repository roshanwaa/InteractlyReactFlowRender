import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  addNode,
  deleteNode, 
  updateNode,
  addEdge as addEdgeAction,
  deleteEdge,
} from '../redux/slices/graphSlice';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.graph.nodes);
  const edges = useSelector((state) => state.graph.edges);
  const [nodeName, setNodeName] = useState('');
  const [currentNodeId, setCurrentNodeId] = useState(null);

  const [nodesState, setNodesState, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(edges);

  const handleAddNode = () => {
    const newNode = {
      id: uuidv4(),
      data: { label: 'New Node' },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    dispatch(addNode(newNode));
    setNodesState((nds) => nds.concat(newNode));
  };

  const handleDeleteNode = (nodeId) => {
    dispatch(deleteNode(nodeId));
    setNodesState((nds) => nds.filter((node) => node.id !== nodeId));
    setNodeName('');
    setCurrentNodeId(null);
  };

  const handleDeleteEdge = (edgeId) => {
    dispatch(deleteEdge(edgeId));
    setEdgesState((eds) => eds.filter((edge) => edge.id !== edgeId));
  };

  const handleConnect = (params) => {
    const newEdge = { ...params, id: uuidv4() };
    dispatch(addEdgeAction(newEdge));
    setEdgesState((eds) => eds.concat(newEdge));
  };

  const handleNodeClick = (event, node) => {
    setCurrentNodeId(node.id);
    setNodeName(node.data.label);
  };

  const handleNodeTitleChange = () => {
    dispatch(updateNode({ id: currentNodeId, data: { label: nodeName } }));
    setNodesState((nds) =>
      nds.map((node) =>
        node.id === currentNodeId
          ? { ...node, data: { label: nodeName } }
          : node
      )
    );
    setCurrentNodeId(null);
    setNodeName('');
  };

  const handleCancelEdit = () => {
    setCurrentNodeId(null);
    setNodeName('');
  };

  const handleNodeMouseOver = (node) => {
    const nodeElement = document.getElementById(`node-${node.id}`);
    if (nodeElement) {
      nodeElement.style.display = 'block';
    }
  };

  const handleNodeMouseOut = (node) => {
    const nodeElement = document.getElementById(`node-${node.id}`);
    if (nodeElement) {
      nodeElement.style.display = 'none';
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-200">
        <button
          onClick={handleAddNode}
          className="bg-blue-300 text-black py-2 px-4 rounded-3xl">
          Create Node
        </button>
        {currentNodeId && (
          <div className="mt-4 relative">
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="border p-2 w-auto bg-slate-100 rounded-xl"
            />
            <button
              className="absolute py-2 text-red-500 text-xl px-1"
              onClick={() => handleDeleteNode(currentNodeId)}>
              <i className="fa-solid fa-trash " />
            </button>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleNodeTitleChange}
                className="bg-green-500 text-white py-2 px-4 rounded-3xl">
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-red-500 text-white py-2 px-4 rounded-3xl">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          onConnect={handleConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={(nodes) =>
            nodes.forEach((node) => handleDeleteNode(node.id))
          }
          onEdgesDelete={(edges) =>
            edges.forEach((edge) => handleDeleteEdge(edge.id))
          }
          onNodeClick={handleNodeClick}
          onNodeMouseEnter={(_, node) => handleNodeMouseOver(node)}
          onNodeMouseLeave={(_, node) => handleNodeMouseOut(node)}
          fitView
          attributionPosition="bottom-left">
          {nodesState.map((node) => (
            <div
              key={node.id}
              id={`node-${node.id}`}
              className="absolute -top-8 right-0 hidden">
              <button
                onClick={() => handleDeleteNode(node.id)}
                className="bg-red-500 text-white p-1 rounded">
                X
              </button>
            </div>
          ))}
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Home;
