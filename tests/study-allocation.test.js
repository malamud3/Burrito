import { ActivityPath } from '../src/core/types/enums';
import { ALLOCATION_STORAGE_KEY } from '../src/core/constants/study';
import { recordStudyPathChoice } from '../src/services/StudyAllocationService';

beforeEach(() => {
  localStorage.clear();
});

test('records the path selected by the participant', () => {
  const result = recordStudyPathChoice('P01', ActivityPath.RENATO);
  const stored = JSON.parse(localStorage.getItem(ALLOCATION_STORAGE_KEY));

  expect(result.assignment).toMatchObject({
    activityPath: ActivityPath.RENATO,
    method: 'student_choice',
  });
  expect(stored.participants.P01).toEqual(result.assignment);
});

test('a participant code cannot be reused with a different path', () => {
  const first = recordStudyPathChoice('s01', ActivityPath.CLASSIC);
  const duplicate = recordStudyPathChoice(' S01 ', ActivityPath.RENATO);
  const stored = JSON.parse(localStorage.getItem(ALLOCATION_STORAGE_KEY));

  expect(duplicate.duplicate).toBe(true);
  expect(duplicate.assignment).toEqual(first.assignment);
  expect(stored.participants.S01).toEqual(first.assignment);
});

test('rejects invalid path selections without writing participant data', () => {
  expect(() => recordStudyPathChoice('P01', 'unknown')).toThrow('המסלול שנבחר אינו תקין');
  expect(localStorage.getItem(ALLOCATION_STORAGE_KEY)).toBeNull();
});
