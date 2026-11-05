import { detectDifficulty, inferWeakestSkill } from '../src/services/DifficultyDetectionService';
import { selectAnalogTask } from '../src/services/AnalogTaskSelector';
import { computePhaseDurations } from '../src/services/LogAnalyticsService';
import { logsToCSV } from '../src/services/ExportService';
import { CTSkill, LogActionType, Group } from '../src/core/types/enums';

const toolState = (o = {}) => ({
  decomposition: { steps: [{ id: 1, value: '' }] },
  abstraction: { rows: [] },
  algorithmic: { nodes: [{ id: 1, value: '' }] },
  ...o,
});
const log = (actionType, skill, t) => ({ id: Math.random(), timestamp: t, actionType, skill, data: {} });

test('no logs → nothing detected', () => {
  expect(detectDifficulty([], toolState()).detected).toBe(false);
});
test('decomposition churning detected', () => {
  const logs = Array.from({ length: 5 }, (_, i) => log(LogActionType.STEP_ADD, CTSkill.DECOMPOSITION, i * 1000));
  const r = detectDifficulty(logs, toolState());
  expect(r).toMatchObject({ detected: true, skill: CTSkill.DECOMPOSITION });
});
test('abstraction: 3 wrong markings detected', () => {
  const rows = [0, 1, 2].map((i) => ({ id: i, actualRelevant: true, userRelevant: false }));
  const r = detectDifficulty([], toolState({ abstraction: { rows } }));
  expect(r.skill).toBe(CTSkill.ABSTRACTION);
});
test('algorithmic stalled-empty detected (121s)', () => {
  const logs = [log(LogActionType.EDIT, CTSkill.ALGORITHMIC, 0), log(LogActionType.EDIT, CTSkill.ALGORITHMIC, 121000)];
  expect(detectDifficulty(logs, toolState()).skill).toBe(CTSkill.ALGORITHMIC);
});
test('weakest skill inference', () => {
  const ts = toolState({
    decomposition: { steps: [{ id: 1, value: 'a' }, { id: 2, value: 'b' }] },
    abstraction: { rows: [{ userRelevant: true }] },
    algorithmic: { nodes: [{ id: 1, value: '' }] },
  });
  expect(inferWeakestSkill(ts)).toBe(CTSkill.ALGORITHMIC);
});
test('adaptive selects matching task; fixed ignores detection', () => {
  expect(selectAnalogTask(Group.ADAPTIVE, CTSkill.ABSTRACTION).id).toBe('analog-abstract-gym');
  const f = selectAnalogTask(Group.FIXED, CTSkill.ABSTRACTION, 0);
  expect(f.id).toBe('analog-decomp-factory');
  expect(f.matchesDetectedSkill).toBe(false);
  expect(() => selectAnalogTask('x', 'y')).toThrow();
});
test('phase durations', () => {
  const logs = [
    { ...log(LogActionType.PHASE_CHANGE, null, 0), data: { to: 'problem' } },
    { ...log(LogActionType.PHASE_CHANGE, null, 5000), data: { to: 'solving' } },
    log(LogActionType.EDIT, null, 12000),
  ];
  expect(computePhaseDurations(logs)).toEqual([{ phase: 'problem', seconds: 5 }, { phase: 'solving', seconds: 7 }]);
});
test('csv escapes quotes + BOM', () => {
  const csv = logsToCSV([{ id: 'a', isoTime: 'x', timestamp: 1, actionType: 'edit', skill: null, data: { v: 'he said "hi"' } }]);
  expect(csv.startsWith('\uFEFF')).toBe(true);
  const dataCell = csv.split('\n')[1].match(/^"a","x","1","edit","","(.*)"$/)[1].replace(/""/g, '"');
  expect(JSON.parse(dataCell)).toEqual({ v: 'he said "hi"' });
});
