import { ActivityPath } from '../src/core/types/enums';
import {
  ALLOCATION_BLOCK_SIZE,
  ALLOCATION_STORAGE_KEY,
} from '../src/core/constants/study';
import { assignStudyPath } from '../src/services/StudyAllocationService';

beforeEach(() => {
  localStorage.clear();
});

test('each complete randomized block assigns two participants to each path', () => {
  const assignments = Array.from({ length: ALLOCATION_BLOCK_SIZE }, (_, index) =>
    assignStudyPath(`P${index + 1}`).assignment,
  );
  expect(assignments.filter(({ activityPath }) => activityPath === ActivityPath.CLASSIC)).toHaveLength(2);
  expect(assignments.filter(({ activityPath }) => activityPath === ActivityPath.RENATO)).toHaveLength(2);
  expect(new Set(assignments.map(({ positionInBlock }) => positionInBlock))).toEqual(new Set([1, 2, 3, 4]));
});

test('a participant code is not assigned twice and does not advance the sequence', () => {
  const first = assignStudyPath('s01');
  const duplicate = assignStudyPath(' S01 ');
  const stored = JSON.parse(localStorage.getItem(ALLOCATION_STORAGE_KEY));

  expect(duplicate.duplicate).toBe(true);
  expect(duplicate.assignment).toEqual(first.assignment);
  expect(stored.nextIndex).toBe(1);
});
