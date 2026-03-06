import { GET } from './route';

// Mock Next.js and next-auth
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({ data, init })),
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock the database models
const mockFindAll = jest.fn();
jest.mock('@/models/index', () => ({
  __esModule: true,
  Book: {
    findAll: (...args) => mockFindAll(...args),
  },
  User: {},
}));

// Mock Sequelize instance and Op
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    where: jest.fn(),
    literal: jest.fn(),
  },
}));

const mockOpOr = Symbol.for('or');
const mockOpLike = Symbol.for('like');

jest.mock('sequelize', () => ({
  Op: {
    or: Symbol.for('or'),
    like: Symbol.for('like'),
  },
}));

// Mock authOptions to prevent circular dependency issues
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

describe('GET /api/books Search Algorithm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindAll.mockResolvedValue([{ id: 1, title: 'Test Book' }]);
  });

  it('should call Book.findAll with empty where clause if no query is provided', async () => {
    const req = { url: 'http://localhost/api/books' };
    await GET(req);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    const callArgs = mockFindAll.mock.calls[0][0];
    expect(callArgs.where).toEqual({});
  });

  it('should build a correct where clause with a single word query', async () => {
    const req = { url: 'http://localhost/api/books?q=javascript' };
    await GET(req);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    const callArgs = mockFindAll.mock.calls[0][0];

    expect(callArgs.where[mockOpOr]).toBeDefined();
    expect(callArgs.where[mockOpOr]).toEqual([
      { title: { [mockOpLike]: '%javascript%' } },
      { keywords: { [mockOpLike]: '%javascript%' } }
    ]);
  });

  it('should build a correct where clause with a multi-word query', async () => {
    const req = { url: 'http://localhost/api/books?q=react+native+guide' };
    await GET(req);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    const callArgs = mockFindAll.mock.calls[0][0];

    expect(callArgs.where[mockOpOr]).toBeDefined();
    expect(callArgs.where[mockOpOr]).toEqual([
      { title: { [mockOpLike]: '%react native guide%' } },
      { keywords: { [mockOpLike]: '%react%native%guide%' } }
    ]);
  });

  it('should handle extra spaces in the query', async () => {
    // query is URI decoded by searchParams automatically, so simulate extra spaces:
    const req = { url: 'http://localhost/api/books?q=  hello   world  ' };
    await GET(req);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    const callArgs = mockFindAll.mock.calls[0][0];

    expect(callArgs.where[mockOpOr]).toEqual([
      { title: { [mockOpLike]: '%  hello   world%' } },
      { keywords: { [mockOpLike]: '%hello%world%' } }
    ]);
  });

  it('should combine category and search query in where clause', async () => {
    const req = { url: 'http://localhost/api/books?q=test&category=programming' };
    await GET(req);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    const callArgs = mockFindAll.mock.calls[0][0];

    expect(callArgs.where.category).toBe('programming');
    expect(callArgs.where[mockOpOr]).toEqual([
      { title: { [mockOpLike]: '%test%' } },
      { keywords: { [mockOpLike]: '%test%' } }
    ]);
  });
});
