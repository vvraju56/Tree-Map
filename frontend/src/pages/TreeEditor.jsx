import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState, MarkerType, Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Link2, Download, Upload,
  GitBranch, Save, ArrowLeft, Share2, Copy, Eye, Pencil, X, Trash2,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

import useTreeStore from '../store/treeStore';
import api from '../services/api';
import PersonNode from '../components/PersonNode';
import UnionNode from '../components/UnionNode';
import PersonModal from '../components/PersonModal';
import RelationshipModal from '../components/RelationshipModal';
import PathFinder from '../components/PathFinder';
import BackgroundBlobs from '../components/BackgroundBlobs';
import Sidebar from '../components/Sidebar';
import { exportAsPNG, exportAsPDF, exportAsJSON } from '../utils/exportUtils';

const nodeTypes = { 
  personNode: PersonNode,
  unionNode: UnionNode
};

const edgeDefaults = {
  type: 'straight',
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  style: { stroke: '#3b82f6', strokeWidth: 2 },
};

const handlePositionMap = {
  top: Position.Top,
  'top-source': Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};

const buildEdgeConfig = (rel) => {
  const sourcePosition = handlePositionMap[rel.sourceHandle];
  const targetPosition = handlePositionMap[rel.targetHandle];
  const sameSideConnection = sourcePosition && targetPosition && sourcePosition === targetPosition;

  return {
    id: rel.id,
    source: rel.source,
    target: rel.target,
    sourceHandle: rel.sourceHandle,
    targetHandle: rel.targetHandle,
    sourcePosition,
    targetPosition,
    type: sameSideConnection ? 'smoothstep' : 'straight',
    label: rel.displayLabel || rel.relationType,
    labelStyle: { fill: '#3b82f6', fontSize: 10 },
    labelBgStyle: { fill: 'rgba(10,10,18,0.8)' },
    ...edgeDefaults,
  };
};

const getNodeDimensions = (node) => {
  if (node.type === 'unionNode') {
    return { width: 10, height: 10 };
  }

  return { width: 180, height: 80 };
};

const getNodeCenter = (node) => {
  const { width, height } = getNodeDimensions(node);
  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
};

export default function TreeEditor() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { fetchTree, saveTree, shareTree, setCurrentTree, currentTree } = useTreeStore();
  const isSharedTree = Boolean(token);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [members, setMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showRelModal, setShowRelModal] = useState(false);
  const [connectParams, setConnectParams] = useState(null);
  const [showPathFinder, setShowPathFinder] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editPerson, setEditPerson] = useState(null);
  const [saving, setSaving] = useState(false);
  const [connectionMode] = useState(false);
  const [shareAccess, setShareAccess] = useState('read');
  const [resolvedShareAccess, setResolvedShareAccess] = useState('private');
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);
  const reactFlowRef = useRef(null);
  const importInputRef = useRef(null);
  const trashRef = useRef(null);
  const membersRef = useRef([]);
  const relationshipsRef = useRef([]);
  const nodesRef = useRef([]);
  const sharedReadOnly = isSharedTree && resolvedShareAccess !== 'read-edit';

  useEffect(() => {
    membersRef.current = members;
    relationshipsRef.current = relationships;
    nodesRef.current = nodes;
  }, [members, relationships, nodes]);

  const handleDeletePerson = useCallback((personId) => {
    setMembers(prev => prev.filter(m => m.id !== personId));
    setRelationships(prev => prev.filter(r => r.source !== personId && r.target !== personId));
    setNodes(prev => prev.filter(n => n.id !== personId));
    setEdges(prev => prev.filter(e => e.source !== personId && e.target !== personId));
  }, [setNodes, setEdges]);

  const getPointerPosition = (event) => {
    if ('clientX' in event && 'clientY' in event) {
      return { x: event.clientX, y: event.clientY };
    }

    const touch = event.changedTouches?.[0] || event.touches?.[0];
    if (touch) {
      return { x: touch.clientX, y: touch.clientY };
    }

    return null;
  };

  const isPointerOverTrash = useCallback((event) => {
    const pointer = getPointerPosition(event);
    const trashRect = trashRef.current?.getBoundingClientRect();

    if (!pointer || !trashRect) return false;

    return (
      pointer.x >= trashRect.left &&
      pointer.x <= trashRect.right &&
      pointer.y >= trashRect.top &&
      pointer.y <= trashRect.bottom
    );
  }, []);

  const buildFlowNodes = useCallback((m, r) => {
    const flowNodes = m.map((person, idx) => ({
      id: person.id,
      type: person.type === 'union' ? 'unionNode' : 'personNode',
      position: person.position || { x: (idx % 4) * 220 + 40, y: Math.floor(idx / 4) * 180 + 40 },
      data: {
        person,
        onEdit: (p) => { 
          if (p.type === 'union') return;
          setEditPerson(p); 
          setShowPersonModal(true); 
        },
        onDelete: handleDeletePerson,
      },
    }));

    const flowEdges = r.map((rel) => buildEdgeConfig(rel));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [setNodes, setEdges, handleDeletePerson]);

  // Load tree
  useEffect(() => {
    const load = async () => {
      const tree = isSharedTree
        ? await (async () => {
        try {
          const { data } = await api.get(`/trees/shared/${token}`);
          setResolvedShareAccess(data.tree.shareAccess || 'read');
          return data.tree;
        } catch {
          toast.error('Shared tree not found');
          navigate('/');
          return null;
        }
      })()
        : await fetchTree(id);

      if (!tree) {
        if (!isSharedTree) {
          toast.error('Tree not found');
          navigate('/dashboard');
        }
        return;
      }

      if (!isSharedTree) {
        setResolvedShareAccess(tree.shareAccess || 'private');
      }

      const m = tree.members || [];
      const r = tree.relationships || [];
      setCurrentTree(tree);
      setMembers(m);
      setRelationships(r);
      buildFlowNodes(m, r);
    };
    load();
  }, [id, token, isSharedTree, fetchTree, navigate, buildFlowNodes, setCurrentTree]);

  const handleAddPerson = (formData) => {
    if (sharedReadOnly) return;
    const newPerson = {
      id: uuidv4(),
      type: 'person',
      ...formData,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    };
    const updated = [...members, newPerson];
    setMembers(updated);
    setNodes(prev => [...prev, {
      id: newPerson.id,
      type: 'personNode',
      position: newPerson.position,
      data: {
        person: newPerson,
        onEdit: (p) => { setEditPerson(p); setShowPersonModal(true); },
        onDelete: handleDeletePerson,
      },
    }]);
  };

  const handleAddUnion = () => {
    if (sharedReadOnly) return;
    const newUnion = {
      id: uuidv4(),
      type: 'union',
      name: 'Union',
      position: { x: 400, y: 300 },
    };
    const updated = [...members, newUnion];
    setMembers(updated);
    setNodes(prev => [...prev, {
      id: newUnion.id,
      type: 'unionNode',
      position: newUnion.position,
      data: {
        person: newUnion,
        onDelete: handleDeletePerson,
      },
    }]);
    toast.success('Union point added');
  };

  const handleEditPerson = (formData) => {
    if (sharedReadOnly) return;
    const updated = members.map(m => m.id === editPerson.id ? { ...m, ...formData } : m);
    setMembers(updated);
    setNodes(prev => prev.map(n => n.id === editPerson.id
      ? { ...n, data: { ...n.data, person: { ...n.data.person, ...formData } } }
      : n
    ));
    setEditPerson(null);
  };

  const handleAddRelationship = ({ source, target, relationType, sourceHandle, targetHandle }) => {
    if (sharedReadOnly) return;
    const exists = relationships.find(r =>
      (r.source === source && r.target === target && r.sourceHandle === sourceHandle && r.targetHandle === targetHandle)
    );
    if (exists) { toast.error('Relationship already exists'); return; }
    const rel = { id: uuidv4(), source, target, relationType, sourceHandle, targetHandle };
    setRelationships(prev => [...prev, rel]);
    setEdges(prev => addEdge(buildEdgeConfig(rel), prev));
  };

  const handleSplitEdge = (edge) => {
    if (sharedReadOnly) return;
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;
    const originalLabel = edge.label || edge.data?.displayLabel || '';
    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);
    const unionSize = 10;
    const midX = (sourceCenter.x + targetCenter.x) / 2 - unionSize / 2;
    const midY = (sourceCenter.y + targetCenter.y) / 2 - unionSize / 2;

    const unionId = uuidv4();
    const unionPerson = {
      id: unionId,
      type: 'union',
      name: 'Junction',
      position: { x: midX, y: midY },
    };
    const unionNode = {
      id: unionId,
      type: 'unionNode',
      position: { x: midX, y: midY },
      data: {
        person: unionPerson,
        onDelete: handleDeletePerson,
      },
    };

    const rel1 = { 
      id: uuidv4(), 
      source: edge.source, 
      target: unionId, 
      relationType: 'split', 
      displayLabel: originalLabel,
      sourceHandle: edge.sourceHandle, 
      targetHandle: 'top' 
    };
    const rel2 = { 
      id: uuidv4(), 
      source: unionId, 
      target: edge.target, 
      relationType: 'split', 
      displayLabel: originalLabel,
      sourceHandle: 'bottom', 
      targetHandle: edge.targetHandle 
    };

    setMembers(prev => [...prev, unionPerson]);
    setRelationships(prev => {
      const filtered = prev.filter(r => r.id !== edge.id);
      return [...filtered, rel1, rel2];
    });
    setNodes(prev => [...prev, unionNode]);
    setEdges(prev => {
      const filtered = prev.filter(e => e.id !== edge.id);
      return [
        ...filtered,
        buildEdgeConfig(rel1),
        buildEdgeConfig(rel2)
      ];
    });

    toast.success('Line split with junction point');
  };

  const onConnect = useCallback((params) => {
    if (sharedReadOnly) return;
    // Show modal to select relationship type
    setConnectParams(params);
    setShowRelModal(true);
  }, [sharedReadOnly]);

  const deleteEdgesAndCleanup = useCallback((edgeIds) => {
    const nextRelationships = relationshipsRef.current.filter((rel) => !edgeIds.includes(rel.id));
    const connectedIds = new Set();
    nextRelationships.forEach((rel) => {
      connectedIds.add(rel.source);
      connectedIds.add(rel.target);
    });

    const orphanUnionIds = membersRef.current
      .filter((member) => member.type === 'union' && !connectedIds.has(member.id))
      .map((member) => member.id);

    setEdges((prevEdges) => prevEdges.filter((edge) => !edgeIds.includes(edge.id)));
    setRelationships(nextRelationships);

    if (orphanUnionIds.length > 0) {
      setMembers((prevMembers) => prevMembers.filter((member) => !orphanUnionIds.includes(member.id)));
      setNodes((prevNodes) => prevNodes.filter((node) => !orphanUnionIds.includes(node.id)));
    }
  }, [setEdges, setNodes]);

  const onEdgesDelete = useCallback((edgesToDelete) => {
    deleteEdgesAndCleanup(edgesToDelete.map((edge) => edge.id));
  }, [deleteEdgesAndCleanup]);

  const onNodesChangeWithPos = useCallback((changes) => {
    if (sharedReadOnly) return;
    onNodesChange(changes);
    const removedNodeIds = changes
      .filter((change) => change.type === 'remove')
      .map((change) => change.id);

    if (removedNodeIds.length > 0) {
      removedNodeIds.forEach((nodeId) => handleDeletePerson(nodeId));
      return;
    }

    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        setMembers(prev => prev.map(m =>
          m.id === change.id ? { ...m, position: change.position } : m
        ));
      }
    });
  }, [handleDeletePerson, onNodesChange, sharedReadOnly]);

  const handleNodeDrag = useCallback((event, node) => {
    if (sharedReadOnly) return;
    setDraggingNodeId(node.id);
    setDragOverTrash(isPointerOverTrash(event));
  }, [isPointerOverTrash, sharedReadOnly]);

  const handleNodeDragStop = useCallback((event, node) => {
    if (sharedReadOnly) return;

    const droppedOnTrash = isPointerOverTrash(event);
    setDraggingNodeId(null);
    setDragOverTrash(false);

    if (!droppedOnTrash) return;

    const label = node.data?.person?.type === 'union'
      ? 'this junction point'
      : node.data?.person?.name || 'this person';

    if (window.confirm(`Do you want to delete ${label}?`)) {
      handleDeletePerson(node.id);
      toast.success('Deleted successfully');
    }
  }, [handleDeletePerson, isPointerOverTrash, sharedReadOnly]);

  const handleSave = async () => {
    setSaving(true);
    const res = isSharedTree
      ? await (async () => {
        try {
          const { data } = await api.put(`/trees/shared/${token}`, { members, relationships });
          setCurrentTree(data.tree);
          return { success: true };
        } catch (err) {
          return { success: false, message: err.response?.data?.message || 'Save failed' };
        }
      })()
      : await saveTree(id, { members, relationships });
    setSaving(false);
    if (res.success) toast.success('Tree saved!');
    else toast.error(res.message || 'Save failed');
  };

  const handleShare = async () => {
    const res = await shareTree(id, shareAccess);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    const shareUrl = `${window.location.origin}/shared/${res.shareToken}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied');
    } catch {
      toast.success('Share link created');
    }
    setResolvedShareAccess(res.shareAccess);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportTree = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

      if (!file || sharedReadOnly) return;

    try {
      const raw = await file.text();
      const imported = JSON.parse(raw);

      if (!Array.isArray(imported.members) || !Array.isArray(imported.relationships)) {
        toast.error('Invalid tree file');
        return;
      }

      const importedMembers = imported.members;
      const importedRelationships = imported.relationships;

      setMembers(importedMembers);
      setRelationships(importedRelationships);
      buildFlowNodes(importedMembers, importedRelationships);

      setSaving(true);
      const res = isSharedTree
        ? await (async () => {
          try {
            const { data } = await api.put(`/trees/shared/${token}`, {
              title: imported.title ?? currentTree?.title,
              description: imported.description ?? currentTree?.description ?? '',
              members: importedMembers,
              relationships: importedRelationships,
            });
            setCurrentTree(data.tree);
            return { success: true };
          } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Upload failed' };
          }
        })()
        : await saveTree(id, {
          title: imported.title ?? currentTree?.title,
          description: imported.description ?? currentTree?.description ?? '',
          members: importedMembers,
          relationships: importedRelationships,
        });
      setSaving(false);

      if (res.success) {
        toast.success('Tree uploaded');
      } else {
        toast.error(res.message || 'Upload failed');
      }
    } catch {
      setSaving(false);
      toast.error('Could not read that JSON file');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      <BackgroundBlobs />
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col relative z-50">
        {/* Toolbar */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-wrap"
          style={{ background: 'rgba(10,10,18,0.9)', borderBottom: '1px solid rgba(59,130,246,0.1)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 60 }}
        >
          <button onClick={() => navigate('/dashboard')} className="ml-12 lg:ml-0 p-2 rounded-xl hover:bg-white/10 transition-colors flex items-center" style={{ color: '#e8e8f0', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <ArrowLeft size={18} />
            <span className="text-xs ml-1">Back</span>
          </button>
          <div className="flex-1 min-w-0 text-center">
            <h1 className="text-sm font-semibold truncate" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>
              {currentTree?.title || 'Loading...'}
            </h1>
            <p className="text-xs" style={{ color: '#8888aa' }}>{members.length} members · {relationships.length} relationships</p>
            {isSharedTree && (
              <p className="text-xs" style={{ color: sharedReadOnly ? '#fbbf24' : '#34d399' }}>
                {sharedReadOnly ? 'Shared: Read only' : 'Shared: Read + Edit'}
              </p>
            )}
            {connectionMode && (
              <p className="text-xs" style={{ color: '#10b981', fontWeight: 'bold' }}>
                🔗 Connection Mode - Click another node or press Esc
              </p>
            )}
            
          </div>

          
        </div>

        {/* Canvas */}
        <div className="flex-1 relative" ref={reactFlowRef}>
          {!sharedReadOnly && (
            <div
              ref={trashRef}
              className="absolute top-4 left-4 z-40 transition-all"
              style={{
                transform: dragOverTrash ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: dragOverTrash ? 'rgba(239,68,68,0.18)' : 'rgba(10,10,18,0.92)',
                  border: dragOverTrash ? '1px solid rgba(239,68,68,0.55)' : '1px solid rgba(239,68,68,0.25)',
                  boxShadow: dragOverTrash ? '0 0 24px rgba(239,68,68,0.25)' : '0 4px 24px rgba(0,0,0,0.35)',
                  color: dragOverTrash ? '#fca5a5' : '#f87171',
                }}
              >
                <Trash2 size={18} />
                <div>
                  <p className="text-xs font-semibold">Trash</p>
                  <p className="text-xs" style={{ color: dragOverTrash ? '#fecaca' : '#fca5a5' }}>
                    {draggingNodeId ? 'Drop here to delete' : 'Drag a node here'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeWithPos}
            onEdgesChange={onEdgesChange}
            onNodeDrag={handleNodeDrag}
            onNodeDragStop={handleNodeDragStop}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            style={{ 
              background: 'transparent',
              cursor: connectionMode ? 'crosshair' : 'default'
            }}
            connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 3 }}
            connectionLineType="straight"
            defaultEdgeOptions={edgeDefaults}
            deleteKeyCode={sharedReadOnly ? [] : ['Backspace', 'Delete', 'Escape']}
            multiSelectionKeyCode="Shift"
            connectionMode="loose"
            proOptions={{ hideAttribution: true }}
            onEdgeClick={(event, edge) => {
              if (sharedReadOnly) return;
              const confirmSplit = window.confirm('Split this line with a junction point? (Cancel to delete the connection)');
              if (confirmSplit) {
                handleSplitEdge(edge);
              } else {
                if (window.confirm('Are you sure you want to delete this connection?')) {
                  deleteEdgesAndCleanup([edge.id]);
                }
              }
            }}
          >
            <Background color="#3b82f6" gap={40} size={1} style={{ opacity: 0.06 }} />
            <Controls style={{ bottom: 24, left: 24 }} />
            <MiniMap
              nodeColor={(node) => node.data?.person?.gender === 'female' ? '#3b82f6' : node.data?.person?.gender === 'male' ? '#4fa3ff' : '#a78bfa'}
              style={{ background: 'rgba(10,10,18,0.6)' }}
              maskColor="rgba(10,10,18,0.8)"
            />
          </ReactFlow>

          {/* Floating Action Toolbar */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-2xl z-30"
            style={{ 
              background: 'rgba(10,10,18,0.95)', 
              border: '1px solid rgba(59,130,246,0.3)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.15)'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditPerson(null); setShowPersonModal(true); }}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
            >
              <UserPlus size={22} />
              <span className="text-xs font-medium">Add Person</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddUnion}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
            >
              <Link2 size={22} />
              <span className="text-xs font-medium">Add Union</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRelModal(true)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
            >
              <Link2 size={22} />
              <span className="text-xs font-medium">Connect</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPathFinder(p => !p)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
              style={{ 
                background: showPathFinder ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.15)', 
                color: '#3b82f6' 
              }}
            >
              <GitBranch size={22} />
              <span className="text-xs font-medium">Path Finder</span>
            </motion.button>

            {!sharedReadOnly && (
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleImportTree}
              />
            )}

            {!sharedReadOnly && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImportClick}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
              >
                <Upload size={22} />
                <span className="text-xs font-medium">Upload</span>
              </motion.button>
            )}

            {!isSharedTree && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareModal(true)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
              >
                <Share2 size={22} />
                <span className="text-xs font-medium">Share</span>
              </motion.button>
            )}

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportMenu(p => !p)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
              >
                <Download size={22} />
                <span className="text-xs font-medium">Export</span>
              </motion.button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(14,14,24,0.98)', border: '1px solid rgba(59,130,246,0.3)', minWidth: 140 }}
                  >
                    {[
                      { label: 'Export PNG', fn: exportAsPNG },
                      { label: 'Export PDF', fn: exportAsPDF },
                      { label: 'Export JSON', fn: () => exportAsJSON({ ...currentTree, members, relationships }) },
                    ].map(({ label, fn }) => (
                      <button key={label} onClick={() => { fn(); setShowExportMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors"
                        style={{ color: '#e8e8f0' }}>
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!sharedReadOnly && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
                style={{ 
                  background: saving ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  color: '#fff' 
                }}
              >
                <Save size={22} />
                <span className="text-xs font-medium">{saving ? 'Saving...' : 'Save'}</span>
              </motion.button>
            )}
          </div>
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-lg mb-2" style={{ color: '#e8e8f0' }}>Canvas is empty</p>
                <p className="text-sm" style={{ color: '#8888aa' }}>Click "Add Person" to start building your family tree</p>
              </motion.div>
            </div>
          )}

          {/* Path Finder panel */}
          <AnimatePresence>
            {showPathFinder && (
              <div className="absolute top-4 right-4 z-40">
                <PathFinder
                  members={members}
                  relationships={relationships}
                  onClose={() => setShowPathFinder(false)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      {showPersonModal && (
        <PersonModal
          key={editPerson?.id || 'new-person'}
          isOpen={showPersonModal}
          onClose={() => { setShowPersonModal(false); setEditPerson(null); }}
          onSave={editPerson ? handleEditPerson : handleAddPerson}
          editPerson={editPerson}
        />
      )}
      {showRelModal && (
        <RelationshipModal
          key={`${connectParams?.source || 'manual'}-${connectParams?.target || 'manual'}-${connectParams?.sourceHandle || 'none'}-${connectParams?.targetHandle || 'none'}`}
          isOpen={showRelModal}
          onClose={() => { setShowRelModal(false); setConnectParams(null); }}
          onSave={handleAddRelationship}
          members={members}
          connectParams={connectParams}
        />
      )}
      {!isSharedTree && showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowShareModal(false)}
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-md rounded-2xl p-6 z-10"
            style={{ background: 'rgba(14,14,24,0.98)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: 'Cinzel', fontSize: 18, color: '#3b82f6' }}>Share Tree</h2>
              <button onClick={() => setShowShareModal(false)} style={{ color: '#8888aa' }}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShareAccess('read')}
                className="w-full text-left rounded-xl p-4 transition-all"
                style={{
                  background: shareAccess === 'read' ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${shareAccess === 'read' ? '#3b82f6' : 'rgba(59,130,246,0.12)'}`,
                  color: '#e8e8f0',
                }}
              >
                <div className="flex items-center gap-3">
                  <Eye size={18} color="#3b82f6" />
                  <div>
                    <div className="text-sm font-medium">Read</div>
                    <div className="text-xs" style={{ color: '#8888aa' }}>Anyone with the link can view only.</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShareAccess('read-edit')}
                className="w-full text-left rounded-xl p-4 transition-all"
                style={{
                  background: shareAccess === 'read-edit' ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${shareAccess === 'read-edit' ? '#3b82f6' : 'rgba(59,130,246,0.12)'}`,
                  color: '#e8e8f0',
                }}
              >
                <div className="flex items-center gap-3">
                  <Pencil size={18} color="#3b82f6" />
                  <div>
                    <div className="text-sm font-medium">Read + Edit</div>
                    <div className="text-xs" style={{ color: '#8888aa' }}>Anyone with the link can view and edit.</div>
                  </div>
                </div>
              </button>
            </div>

            {currentTree?.shareToken && (
              <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}>
                <p className="text-xs mb-2" style={{ color: '#8888aa' }}>Current share link</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${window.location.origin}/shared/${currentTree.shareToken}`}
                    className="flex-1 px-3 py-2 rounded-lg text-xs"
                    style={{ background: 'rgba(10,10,18,0.8)', color: '#e8e8f0', border: '1px solid rgba(59,130,246,0.12)' }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(`${window.location.origin}/shared/${currentTree.shareToken}`);
                      toast.success('Link copied');
                    }}
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(59,130,246,0.14)', color: '#3b82f6' }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-5">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#8888aa', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}
              >
                Create Link
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
