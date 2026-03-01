import { GET } from '@/app/api/cities/route';
import models from '@/models/index';

// Mock the models
jest.mock('@/models/index', () => {
  return {
    User: {
      findAll: jest.fn(),
    },
  };
});

describe('GET /api/cities', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  it('should return a unique, sorted list of cities including DB cities and hardcoded districts', async () => {
    // Mock the DB response with some duplicates and some new cities
    const mockDbCities = [
      { city: 'Kathmandu' }, // already in hardcoded
      { city: 'Pokhara' },   // already in hardcoded
      { city: 'Lumbini' },   // new
      { city: 'Lumbini' },   // duplicate in DB
      { city: 'Namche' },    // new
      { city: null },        // null value should be filtered out
      { city: undefined },   // undefined value should be filtered out
      { city: '' },          // empty string should be filtered out
    ];

    models.User.findAll.mockResolvedValue(mockDbCities);

    const response = await GET();
    const data = await response.json();

    // Verify DB query
    expect(models.User.findAll).toHaveBeenCalledTimes(1);
    expect(models.User.findAll).toHaveBeenCalledWith({
      attributes: ['city'],
      where: { role: 'seller' },
      group: ['city'],
    });

    // Verify response format
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=3600, stale-while-revalidate=7200');

    // Verify data
    expect(Array.isArray(data)).toBe(true);

    // Check if new cities are included
    expect(data).toContain('Lumbini');
    expect(data).toContain('Namche');

    // Check if hardcoded cities are included
    expect(data).toContain('Kathmandu');
    expect(data).toContain('Pokhara');
    expect(data).toContain('Lalitpur');

    // Check for uniqueness (Lumbini should only appear once)
    const lumbiniCount = data.filter(c => c === 'Lumbini').length;
    expect(lumbiniCount).toBe(1);

    // Check for null/empty filtering
    expect(data).not.toContain(null);
    expect(data).not.toContain(undefined);
    expect(data).not.toContain('');

    // Check if sorted alphabetically
    const sortedData = [...data].sort();
    expect(data).toEqual(sortedData);
  });

  it('should handle database errors gracefully', async () => {
    // Mock DB error
    models.User.findAll.mockRejectedValue(new Error('Database connection failed'));

    // Spy on console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Internal server error' });

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
