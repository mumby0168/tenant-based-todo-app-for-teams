import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../lib/api-client';

export const handlers = [
  // Health check
  http.get(`${API_BASE_URL}/health`, () => {
    return HttpResponse.json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'TodoApp.Api',
    });
  }),

  // Authentication endpoints
  http.post(`${API_BASE_URL}/auth/request-code`, async ({ request }) => {
    const { email } = await request.json() as { email: string };
    
    console.log('Mock: Verification code requested for', email);
    
    return HttpResponse.json({
      message: 'Verification code sent',
      expiresIn: 900, // 15 minutes
    });
  }),

  http.post(`${API_BASE_URL}/auth/verify`, async ({ request }) => {
    const { email, code } = await request.json() as { email: string; code: string };
    
    // Mock verification - accept code "123456"
    if (code === '123456') {
      const isNewUser = !email.includes('existing');
      
      return HttpResponse.json({
        isNewUser,
        token: 'mock-jwt-token',
        user: isNewUser ? null : {
          id: '1',
          email,
          name: 'Test User',
          isEmailVerified: true,
        },
        team: isNewUser ? null : {
          id: '1',
          name: 'Test Team',
          role: 'Owner',
        },
        teams: isNewUser ? [] : [{
          id: '1',
          name: 'Test Team',
          role: 'Owner',
        }],
      });
    }
    
    return HttpResponse.json(
      { message: 'Invalid verification code' },
      { status: 400 }
    );
  }),

  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const { name, teamName } = await request.json() as { name: string; teamName: string };
    
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name,
        isEmailVerified: true,
      },
      team: {
        id: '1',
        name: teamName,
        role: 'Owner',
      },
      teams: [{
        id: '1',
        name: teamName,
        role: 'Owner',
      }],
    });
  }),

  // Todo lists endpoints
  http.get(`${API_BASE_URL}/lists`, () => {
    return HttpResponse.json({
      lists: [
        {
          id: '1',
          name: 'Personal Tasks',
          description: 'My personal todo list',
          todoCount: 5,
          completedCount: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Work Projects',
          description: 'Current work items',
          todoCount: 10,
          completedCount: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  }),

  // Team endpoints
  http.get(`${API_BASE_URL}/team/members`, () => {
    return HttpResponse.json({
      members: [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'Owner',
          joinedAt: new Date().toISOString(),
        },
      ],
    });
  }),
];