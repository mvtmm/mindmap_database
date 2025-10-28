import React, { useEffect, useMemo, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';
import { fetchCollections, fetchRelations, fetchFields } from '../api/schema';
import { buildGraph } from '../graph/buildGraph';

cytoscape.use(coseBilkent);
cytoscape.use(dagre);

interface Props {
  directus: ReturnType<typeof import('../auth/directus').createDirectusClient>;
}

export function GraphView({ directus }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [layout, setLayout] = useState<'cose-bilkent' | 'dagre'>('cose-bilkent');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const style = useMemo(
    () => [
      { selector: 'node', style: { label: 'data(label)', 'text-valign': 'center', 'text-halign': 'center', 'font-size': 10, 'background-color': '#148', color: '#fff' } },
      { selector: 'edge', style: { width: 2, 'line-color': '#999', 'target-arrow-color': '#999', 'target-arrow-shape': 'triangle' } },
      { selector: 'node[type="collection"]', style: { 'background-color': '#1f6feb' } },
      { selector: 'node[type="field"]', style: { 'background-color': '#6e7781', 'font-size': 8 } },
      { selector: '.highlight', style: { 'background-color': '#f59e0b' } },
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cols, rels] = await Promise.all([
        fetchCollections(directus as any),
        fetchRelations(directus as any),
      ]);
      if (cancelled) return;
      const elements = buildGraph(cols, rels) as any;

      if (!containerRef.current) return;
      const cy = (cyRef.current = cytoscape({
        container: containerRef.current,
        elements,
        style,
        wheelSensitivity: 0.2,
      }));

      cy.on('tap', 'node', (evt) => {
        const id = evt.target.id();
        setSelected(id);
      });

      cy.layout({ name: layout }).run();
    })();

    return () => {
      cancelled = true;
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, [directus, layout, style]);

  const handleSearch = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass('highlight');
    if (!search) return;
    const matches = cy.nodes().filter((n) => (n.data('label') as string)?.toLowerCase().includes(search.toLowerCase()));
    matches.addClass('highlight');
    if (matches.nonempty()) {
      cy.fit(matches, 50);
    }
  };

  const expandFields = async () => {
    const cy = cyRef.current;
    if (!cy || !selected) return;
    const fields = await fetchFields(directus as any, selected);
    const newElements: any[] = [];
    for (const f of fields) {
      const fid = `${selected}.${f.field}`;
      if (cy.getElementById(fid).nonempty()) continue;
      newElements.push({ data: { id: fid, label: f.field, type: 'field' } });
      newElements.push({ data: { id: `${fid}-->${selected}`, source: fid, target: selected, type: 'field-of' } });
    }
    cy.add(newElements);
    cy.layout({ name: layout }).run();
  };

  const collapseFields = () => {
    const cy = cyRef.current;
    if (!cy || !selected) return;
    const toRemove = cy.nodes().filter((n) => n.id().startsWith(`${selected}.`));
    cy.remove(toRemove.connectedEdges());
    cy.remove(toRemove);
    cy.layout({ name: layout }).run();
  };

  const fitAll = () => {
    cyRef.current?.fit(undefined, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 8, borderBottom: '1px solid #ddd', display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search collections" />
        <button onClick={handleSearch}>Find</button>
        <select value={layout} onChange={(e) => setLayout(e.target.value as any)}>
          <option value="cose-bilkent">CoSE Bilkent</option>
          <option value="dagre">Dagre</option>
        </select>
        <button onClick={fitAll}>Fit</button>
        <span style={{ marginLeft: 'auto' }}>Selected: {selected || '-'}</span>
        <button onClick={expandFields} disabled={!selected}>Expand Fields</button>
        <button onClick={collapseFields} disabled={!selected}>Collapse Fields</button>
      </div>
      <div ref={containerRef} style={{ flex: 1 }} />
    </div>
  );
}
