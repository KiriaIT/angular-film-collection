import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('converts 90 minutes to 1h 30min', () => {
    expect(pipe.transform(90)).toBe('1h 30min');
  });

  it('converts 60 minutes to 1h', () => {
    expect(pipe.transform(60)).toBe('1h');
  });

  it('converts 45 minutes to 45min', () => {
    expect(pipe.transform(45)).toBe('45min');
  });

  it('returns em dash for zero or negative minutes', () => {
    expect(pipe.transform(0)).toBe('—');
    expect(pipe.transform(-5)).toBe('—');
  });

  it('converts 61 minutes to 1h 1min', () => {
    expect(pipe.transform(61)).toBe('1h 1min');
  });

  it('converts 105 minutes to 1h 45min', () => {
    expect(pipe.transform(105)).toBe('1h 45min');
  });
});
