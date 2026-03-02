import { POST } from './route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

jest.mock('next-auth');

describe('POST /api/feedback', () => {
    it('returns 400 if rating or comment are missing', async () => {
        getServerSession.mockResolvedValue({
            user: { id: 1, name: 'Test User' }
        });

        // Test with missing comment
        const req1 = {
            json: jest.fn().mockResolvedValue({ rating: 5 })
        };
        const res1 = await POST(req1);
        expect(res1.status).toBe(400);
        const data1 = await res1.json();
        expect(data1.error).toBe('Rating and comment are required');

        // Test with missing rating
        const req2 = {
            json: jest.fn().mockResolvedValue({ comment: 'Great site!' })
        };
        const res2 = await POST(req2);
        expect(res2.status).toBe(400);
        const data2 = await res2.json();
        expect(data2.error).toBe('Rating and comment are required');

        // Test with missing both
        const req3 = {
            json: jest.fn().mockResolvedValue({})
        };
        const res3 = await POST(req3);
        expect(res3.status).toBe(400);
        const data3 = await res3.json();
        expect(data3.error).toBe('Rating and comment are required');
    });
});
