import { describe, it, expect } from 'vitest';
import { buildGraph } from './buildGraph';

describe('buildGraph', () => {
  it('creates nodes for collections', () => {
    const collections = [{ collection: 'a' }, { collection: 'b' }];
    const elements = buildGraph(collections as any, []);
    const ids = (elements as any[]).filter(e => !('source' in e.data)).map(e => e.data.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
  });

  it('creates edges for relations', () => {
    const collections = [{ collection: 'a' }, { collection: 'b' }];
    const relations = [{ many_collection: 'a', related_collection: 'b', field: 'b_id' }];
    const elements = buildGraph(collections as any, relations as any);
    const edges = (elements as any[]).filter(e => 'source' in e.data);
    expect(edges.length).toBe(1);
    expect(edges[0].data.source).toBe('a');
    expect(edges[0].data.target).toBe('b');
  });
});
