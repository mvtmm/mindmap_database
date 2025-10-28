export interface GraphElement {
  data: Record<string, any>;
  classes?: string;
}

export function buildGraph(collections: any[], relations: any[]) {
  const elements: GraphElement[] = [];

  for (const c of collections) {
    elements.push({ data: { id: c.collection, label: c.collection, type: 'collection' } });
  }

  for (const r of relations) {
    const from = r.many_collection || r.one_collection || r.collection;
    const to = r.related_collection || r.one_collection || r.field;
    if (from && to) {
      const id = `${from}->${to}:${r.field || r.meta?.junction_field || ''}`;
      elements.push({ data: { id, source: from, target: to, type: 'relation' } });
    }
  }

  return elements;
}
