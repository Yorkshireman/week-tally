import { buildWeekOffsetsArray } from '@/utils';

describe('buildWeekOffsetsArray()', () => {
  it('should return an array of week offsets for the given number of weeks', () => {
    const numWeeks = 4;
    const expectedOffsets = [-3, -2, -1, 0];
    expect(buildWeekOffsetsArray(numWeeks)).toEqual(expectedOffsets);
  });
});
