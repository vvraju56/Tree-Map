/**
 * BFS-based relationship path finder
 * Finds the shortest path between two people in the family graph
 */

export function findRelationshipPath(members, relationships, sourceId, targetId) {
  if (sourceId === targetId) return { path: [], label: 'Same person' };

  // Build adjacency list (bidirectional)
  const graph = {};
  members.forEach((m) => { graph[m.id] = []; });

  relationships.forEach((rel) => {
    if (!graph[rel.source]) graph[rel.source] = [];
    if (!graph[rel.target]) graph[rel.target] = [];
    graph[rel.source].push({ id: rel.target, type: rel.relationType, direction: 'forward' });
    graph[rel.target].push({ id: rel.source, type: inverseRelation(rel.relationType), direction: 'backward' });
  });

  // BFS
  const queue = [[sourceId, []]];
  const visited = new Set([sourceId]);

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    const neighbors = graph[current] || [];

    for (const neighbor of neighbors) {
      if (visited.has(neighbor.id)) continue;
      const newPath = [...path, { from: current, to: neighbor.id, type: neighbor.type }];

      if (neighbor.id === targetId) {
        const label = pathToLabel(newPath, members);
        return { path: newPath, label };
      }

      visited.add(neighbor.id);
      queue.push([neighbor.id, newPath]);
    }
  }

  return { path: null, label: 'No relationship found' };
}

function inverseRelation(type) {
  const inverses = {
    father: 'son/daughter',
    mother: 'son/daughter',
    son: 'father/mother',
    daughter: 'father/mother',
    brother: 'sibling',
    sister: 'sibling',
    husband: 'wife',
    wife: 'husband',
    grandfather: 'grandchild',
    grandmother: 'grandchild',
    grandson: 'grandfather/grandmother',
    granddaughter: 'grandfather/grandmother',
    uncle: 'nephew/niece',
    aunt: 'nephew/niece',
    nephew: 'uncle/aunt',
    niece: 'uncle/aunt',
    cousin: 'cousin',
  };
  return inverses[type] || type;
}

function pathToLabel(path, members) {
  if (!path || path.length === 0) return 'Self';

  const getMember = (id) => members.find((m) => m.id === id);
  const steps = path.map((step) => {
    const target = getMember(step.to);
    return `${target?.name || 'Unknown'} (${step.type})`;
  });

  // Try to infer compound relationship
  const types = path.map((s) => s.type);
  const compound = inferCompoundRelationship(types);

  return compound || steps.join(' → ');
}

function inferCompoundRelationship(types) {
  const key = types.join('→');
  const map = {
    'father→father': 'Paternal Grandfather',
    'father→mother': 'Paternal Grandmother',
    'mother→father': 'Maternal Grandfather',
    'mother→mother': 'Maternal Grandmother',
    'father→brother': 'Paternal Uncle',
    'father→sister': 'Paternal Aunt',
    'mother→brother': 'Maternal Uncle',
    'mother→sister': 'Maternal Aunt',
    'father→brother→son': 'First Cousin',
    'father→brother→daughter': 'First Cousin',
    'father→father→father': 'Great-Grandfather',
    'father→father→mother': 'Great-Grandmother',
    'son→son': 'Grandson',
    'son→daughter': 'Granddaughter',
    'daughter→son': 'Grandson',
    'daughter→daughter': 'Granddaughter',
  };
  return map[key] || null;
}

export function getPersonRelationships(personId, relationships, members) {
  const related = [];
  relationships.forEach((rel) => {
    if (rel.source === personId) {
      const target = members.find((m) => m.id === rel.target);
      if (target) related.push({ person: target, type: rel.relationType, relId: rel.id });
    } else if (rel.target === personId) {
      const source = members.find((m) => m.id === rel.source);
      if (source) related.push({ person: source, type: inverseRelation(rel.relationType), relId: rel.id });
    }
  });
  return related;
}
