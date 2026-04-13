export function parseLevel(data) {
  return {
    id: data.id,
    name: data.name,
    sandbox: !!data.sandbox,
    catQueue: [...data.catQueue],
    napSpot: { ...data.napSpot },
    slingshot: { ...data.slingshot },
    structures: data.structures.map(s => ({ ...s })),
    dogs: data.dogs.map(d => ({ ...d })),
    tables: (data.tables || []).map(t => ({ ...t })),
    starThresholds: [...data.starThresholds]
  };
}

export function validateLevel(data) {
  if (!data.catQueue || data.catQueue.length === 0) return false;
  if (!data.dogs) return false;
  if (!data.starThresholds || data.starThresholds.length !== 3) return false;
  if (!data.napSpot) return false;
  if (!data.slingshot) return false;
  if (!data.structures) return false;
  return true;
}
