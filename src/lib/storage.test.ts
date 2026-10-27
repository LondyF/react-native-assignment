import { mmkvStateStorage } from '@/lib/storage';

describe('mmkvStateStorage', () => {
  it('returns null for a missing key', () => {
    expect(mmkvStateStorage.getItem('missing')).toBeNull();
  });

  it('round-trips a stored value', () => {
    mmkvStateStorage.setItem('key', 'value');

    expect(mmkvStateStorage.getItem('key')).toBe('value');
  });

  it('removes a stored value', () => {
    mmkvStateStorage.setItem('key', 'value');
    mmkvStateStorage.removeItem('key');

    expect(mmkvStateStorage.getItem('key')).toBeNull();
  });
});
