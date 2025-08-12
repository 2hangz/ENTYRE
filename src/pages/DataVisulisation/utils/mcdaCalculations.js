// MCDA Calculation Utilities (robust version)

/**
 * Calculate weighted sum score for a project
 * @param {Object} projectValues - Project values for each criterion
 * @param {Object} weights - Weights for each criterion (0~1)
 * @returns {number} Weighted sum score (normalized by total weight)
 */
export const calculateWeightedScore = (projectValues = {}, weights = {}) => {
  let totalScore = 0;
  let totalWeight = 0;

  for (const [criterion, rawVal] of Object.entries(projectValues)) {
    const w = Number(weights[criterion]) || 0;
    const v = Number(rawVal);
    if (w > 0 && !Number.isNaN(v)) {
      totalScore += v * w;
      totalWeight += w;
    }
  }
  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

/**
 * Calculate Pareto dominance relationships
 * data item shape: { name: string, values: Record<string, number> }
 * @param {Array} data - Array of project data
 * @returns {{ paretoOptimal: Array, dominated: Array }}
 */
export const calculateParetoDominance = (data = []) => {
  const safe = Array.isArray(data) ? data : [];
  const paretoOptimal = [];
  const dominated = [];

  for (let i = 0; i < safe.length; i++) {
    const A = safe[i];
    const Avals = A?.values || {};
    let isDominated = false;
    const dominates = [];

    for (let j = 0; j < safe.length; j++) {
      if (i === j) continue;
      const B = safe[j];
      const Bvals = B?.values || {};

      // A dominates B: A >= B on all, and > on at least one
      let dominatesB = true;
      let strictlyBetter = false;

      for (const k of Object.keys(Avals)) {
        const a = Number(Avals[k]);
        const b = Number(Bvals[k]);
        if (Number.isNaN(a) || Number.isNaN(b)) continue;
        if (a < b) { dominatesB = false; break; }
        if (a > b) strictlyBetter = true;
      }
      if (dominatesB && strictlyBetter) dominates.push(B.name);

      // A is dominated by B: B >= A on all, and > on at least one
      let dominatedByB = true;
      let strictlyWorse = false;

      for (const k of Object.keys(Avals)) {
        const a = Number(Avals[k]);
        const b = Number(Bvals[k]);
        if (Number.isNaN(a) || Number.isNaN(b)) continue;
        if (a > b) { dominatedByB = false; break; }
        if (a < b) strictlyWorse = true;
      }
      if (dominatedByB && strictlyWorse) isDominated = true;
    }

    if (!isDominated) {
      paretoOptimal.push({ className: A.name, dominates });
    } else {
      const dominatedBy = safe
        .filter((_, idx) => idx !== i)
        .filter(B => {
          const Bvals = B?.values || {};
          let dominatedByB = true;
          let strictlyWorse = false;
          for (const k of Object.keys(Avals)) {
            const a = Number(Avals[k]);
            const b = Number(Bvals[k]);
            if (Number.isNaN(a) || Number.isNaN(b)) continue;
            if (a > b) { dominatedByB = false; break; }
            if (a < b) strictlyWorse = true;
          }
          return dominatedByB && strictlyWorse;
        })
        .map(p => p.name);

      dominated.push({ className: A.name, dominatedBy });
    }
  }
  return { paretoOptimal, dominated };
};

/**
 * Calculate CP (Compromise Programming) score
 * @param {Object} projectValues
 * @param {Object} weights
 * @param {Array} data - All project data for normalization
 * @param {number} p - CP parameter (default: 2)
 * @returns {number} 0~1, lower is better
 */
export const calculateCPScore = (projectValues = {}, weights = {}, data = [], p = 2) => {
  const criteria = Object.keys(projectValues);
  const safeData = Array.isArray(data) ? data : [];

  const ideal = {};
  const negativeIdeal = {};

  criteria.forEach(c => {
    const vals = safeData
      .map(pr => Number(pr?.values?.[c]))
      .filter(v => !Number.isNaN(v));
    if (!vals.length) { ideal[c] = 1; negativeIdeal[c] = 0; }
    else { ideal[c] = Math.max(...vals); negativeIdeal[c] = Math.min(...vals); }
  });

  let distanceToIdeal = 0;
  let distanceToNegativeIdeal = 0;

  criteria.forEach(c => {
    const w = Number(weights[c]) || 0;
    const v = Number(projectValues[c]);
    if (w <= 0 || Number.isNaN(v)) return;

    const range = ideal[c] - negativeIdeal[c];
    const normalized = range === 0 ? 0.5 : (v - negativeIdeal[c]) / range;

    distanceToIdeal += Math.pow(w * (1 - normalized), p);
    distanceToNegativeIdeal += Math.pow(w * normalized, p);
  });

  distanceToIdeal = Math.pow(distanceToIdeal, 1 / p);
  distanceToNegativeIdeal = Math.pow(distanceToNegativeIdeal, 1 / p);

  const denom = distanceToIdeal + distanceToNegativeIdeal;
  return denom > 0 ? distanceToIdeal / denom : 0.5;
};

/**
 * Calculate TOPSIS score
 * @param {Object} projectValues
 * @param {Object} weights
 * @param {Array} data
 * @param {'benefit'|'cost'} idealType
 * @returns {number} 0~1, higher is better
 */
export const calculateTopsScore = (projectValues = {}, weights = {}, data = [], idealType = 'benefit') => {
  const criteria = Object.keys(projectValues);
  const safeData = Array.isArray(data) ? data : [];

  // Normalize current row with vector normalization
  const normalized = {};
  criteria.forEach(c => {
    const vals = safeData
      .map(pr => Number(pr?.values?.[c]))
      .filter(v => !Number.isNaN(v));
    const denom = Math.sqrt(vals.reduce((s, v) => s + v * v, 0));
    const v = Number(projectValues[c]);
    normalized[c] = denom > 0 && !Number.isNaN(v) ? v / denom : 0;
  });

  // Weighted normalized
  const weighted = {};
  criteria.forEach(c => {
    weighted[c] = normalized[c] * (Number(weights[c]) || 0);
  });

  // Ideal and negative ideal points on weighted normalized space
  const ideal = {};
  const negativeIdeal = {};
  criteria.forEach(c => {
    const weightedVals = safeData.map(pr => {
      const arr = safeData
        .map(p => Number(p?.values?.[c]))
        .filter(v => !Number.isNaN(v));
      const denom = Math.sqrt(arr.reduce((s, v) => s + v * v, 0));
      const n = denom > 0 ? (Number(pr?.values?.[c]) || 0) / denom : 0;
      return n * (Number(weights[c]) || 0);
    });

    if (!weightedVals.length) { ideal[c] = 0; negativeIdeal[c] = 0; return; }

    if (idealType === 'cost') {
      // cost: lower is better
      ideal[c] = Math.min(...weightedVals);
      negativeIdeal[c] = Math.max(...weightedVals);
    } else {
      // benefit: higher is better
      ideal[c] = Math.max(...weightedVals);
      negativeIdeal[c] = Math.min(...weightedVals);
    }
  });

  // Distances
  let dPlus = 0, dMinus = 0;
  criteria.forEach(c => {
    const diffI = weighted[c] - ideal[c];
    const diffN = weighted[c] - negativeIdeal[c];
    dPlus += diffI * diffI;
    dMinus += diffN * diffN;
  });
  dPlus = Math.sqrt(dPlus);
  dMinus = Math.sqrt(dMinus);

  const denom = dPlus + dMinus;
  return denom > 0 ? dMinus / denom : 0.5;
};

/**
 * Recalculate ranks based on MCDA method
 * @param {Array} data - [{ name, values: {criterion: number} }]
 * @param {Object} weights
 * @param {'weighted_sum'|'cp'|'topsis'} method
 * @param {{cpP?: number, topsisIdealType?: 'benefit'|'cost'}} parameters
 * @returns {Array} [{...project, score, rank}]
 */
export const recalculateRanks = (data, weights, method = 'weighted_sum', parameters = {}) => {
  const safeData = Array.isArray(data) ? data : [];
  const hasWeights = weights && Object.keys(weights).length > 0;

  // nothing to do
  if (!safeData.length || !hasWeights) return safeData;

  const projectsWithScores = safeData.map(project => {
    const values = project?.values || {};
    let score;

    switch (method) {
      case 'weighted_sum':
        score = calculateWeightedScore(values, weights);
        break;
      case 'cp':
        score = calculateCPScore(values, weights, safeData, parameters.cpP ?? 2);
        break;
      case 'topsis':
        score = calculateTopsScore(values, weights, safeData, parameters.topsisIdealType ?? 'benefit');
        break;
      default:
        score = calculateWeightedScore(values, weights);
    }
    return { ...project, score };
  });

  // Sort (CP: lower is better; others: higher is better)
  const sortOrder = method === 'cp' ? 1 : -1;
  projectsWithScores.sort((a, b) => sortOrder * (a.score - b.score));

  // Assign ranks (1-based)
  return projectsWithScores.map((project, index) => ({
    ...project,
    rank: index + 1,
  }));
};
