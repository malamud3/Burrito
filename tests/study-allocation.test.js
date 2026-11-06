import { ActivityPath } from '../src/core/types/enums';
import { ALLOCATION_STORAGE_KEY } from '../src/core/constants/study';
import { assignDemoStudyPath } from '../src/services/StudyAllocationService';

beforeEach(() => {
  localStorage.clear();
});

test('assigns the first path in a locally randomized balanced pair', () => {
  const result = assignDemoStudyPath('P01', localStorage, () => 0.1);
  const stored = JSON.parse(localStorage.getItem(ALLOCATION_STORAGE_KEY));

  expect(result.assignment).toMatchObject({
    activityPath: ActivityPath.CLASSIC,
    method: 'demo_local_permuted_blocks',
    allocationIndex: 1,
    blockNumber: 1,
    positionInBlock: 1,
  });
  expect(stored.participants.P01).toEqual(result.assignment);

  const second = assignDemoStudyPath('P02', localStorage, () => 0.1);
  expect(second.assignment).toMatchObject({
    activityPath: ActivityPath.RENATO,
    allocationIndex: 2,
    blockNumber: 1,
    positionInBlock: 2,
  });
});

test('a participant code cannot be assigned twice in the same browser', () => {
  const first = assignDemoStudyPath('s01', localStorage, () => 0.1);
  const duplicate = assignDemoStudyPath(' S01 ', localStorage, () => 0.9);
  const stored = JSON.parse(localStorage.getItem(ALLOCATION_STORAGE_KEY));

  expect(duplicate.duplicate).toBe(true);
  expect(duplicate.assignment).toEqual(first.assignment);
  expect(stored.participants.S01).toEqual(first.assignment);
});

test('rejects an empty participant code without writing assignment data', () => {
  expect(() => assignDemoStudyPath('  ')).toThrow('נדרש קוד משתתף/ת להקצאה');
  expect(localStorage.getItem(ALLOCATION_STORAGE_KEY)).toBeNull();
});

test('retains existing participant records when upgrading the allocation schema', () => {
  localStorage.setItem(ALLOCATION_STORAGE_KEY, JSON.stringify({
    schemaVersion: 1,
    nextIndex: 0,
    sequence: [],
    participants: { OLD01: { activityPath: ActivityPath.CLASSIC, method: 'student_choice' } },
  }));

  expect(assignDemoStudyPath('old01', localStorage).duplicate).toBe(true);
});
