/**
 * @jest-environment node
 */
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Create a custom Request class to mock formData
class MockNextRequest {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || 'GET';
    this._formData = init?.formData;
  }

  async formData() {
    if (this._formData) return this._formData;
    throw new TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded"');
  }
}

// Mock Next.js NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      },
    },
    NextRequest: jest.fn().mockImplementation((input, init) => new MockNextRequest(input, init)),
  };
});

// Mock next-auth getServerSession
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock the file system
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

// Mock the database models
jest.mock('@/models/index', () => {
  return {
    Book: {
      create: jest.fn(),
      findAll: jest.fn(),
    },
    User: {},
  };
});

// Mock database connection
jest.mock('@/lib/db', () => ({
  where: jest.fn(),
  literal: jest.fn(),
}));

// Mock authOptions
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

describe('POST /api/books', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when no coverImage is provided', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: {
        id: 1,
        role: 'seller',
      },
    });

    // Create a mock FormData with get method
    const mockFormData = {
      get: (key) => {
        if (key === 'title') return 'Test Book';
        if (key === 'author') return 'Test Author';
        if (key === 'coverImage') return null; // Important: Return null for missing image
        return null;
      },
    };

    const req = new MockNextRequest('http://localhost/api/books', {
      method: 'POST',
      formData: mockFormData,
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No image file provided');
  });

  it('should return 401 when user is not authorized', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue(null);

    const req = new MockNextRequest('http://localhost/api/books', {
      method: 'POST',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 401 when user is not a seller or admin', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: {
        id: 1,
        role: 'buyer',
      },
    });

    const req = new MockNextRequest('http://localhost/api/books', {
      method: 'POST',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 201 when book is successfully created', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: {
        id: 1,
        role: 'seller',
      },
    });

    // Create a mock FormData with get method and a coverImage
    const mockFormData = {
      get: (key) => {
        if (key === 'title') return 'Test Book';
        if (key === 'author') return 'Test Author';
        if (key === 'coverImage') {
          return {
            name: 'test-image.jpg',
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
          };
        }
        return null;
      },
    };

    const req = new MockNextRequest('http://localhost/api/books', {
      method: 'POST',
      formData: mockFormData,
    });

    // Mock Book.create to return the created book
    const { Book } = require('@/models/index');
    Book.create.mockResolvedValue({ id: 1, title: 'Test Book', author: 'Test Author' });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('title', 'Test Book');
  });
});