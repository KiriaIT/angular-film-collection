import { posterDisplayUrl } from './poster-display';

describe('posterDisplayUrl', () => {
  it('adds .png to placehold.co size path when missing', () => {
    expect(posterDisplayUrl('https://placehold.co/300x450?text=Test')).toBe(
      'https://placehold.co/300x450.png?text=Test',
    );
  });

  it('leaves non-placehold URLs unchanged', () => {
    expect(posterDisplayUrl('https://example.com/poster.jpg')).toBe('https://example.com/poster.jpg');
  });

  it('does not double-append extension', () => {
    expect(posterDisplayUrl('https://placehold.co/300x450.png?text=Test')).toBe(
      'https://placehold.co/300x450.png?text=Test',
    );
  });
});
