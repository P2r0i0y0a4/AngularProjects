import { Highlight } from './highlight';

describe('Highlight', () => {
  it('should create an instance', () => {
    const directive = new Highlight({} as any);
    expect(directive).toBeTruthy();
  });
});
