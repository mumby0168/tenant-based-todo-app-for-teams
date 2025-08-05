import { http, HttpResponse } from 'msw';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

export const handlers = [
  // Health check
  http.get('/api/v1/health', () => {
    return HttpResponse.json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'TodoApp.Api',
    });
  }),

  // Authentication endpoints
  http.post('/api/v1/auth/request-code', async ({ request }) => {
    const { email } = await request.json() as { email: string };
    
    console.log('Mock: Verification code requested for', email);
    
    return HttpResponse.json({
      message: AUTH_CONSTANTS.VERIFICATION_CODE_SENT,
    });
  }),

  http.post('/api/v1/auth/verify-code', async ({ request }) => {
    const { email, code } = await request.json() as { email: string; code: string };
    
    // Mock verification - accept code "123456"
    if (code === '123456') {
      const isNewUser = !email.includes('existing');
      
      if (isNewUser) {
        return HttpResponse.json({
          token: '',
          isNewUser: true,
        });
      }
      
      return HttpResponse.json({
        token: 'mock-jwt-token',
        isNewUser: false,
        user: {
          id: '1',
          email,
          displayName: 'Test User',
        },
      });
    }
    
    return HttpResponse.json(
      { 
        title: AUTH_CONSTANTS.INVALID_CODE,
        detail: AUTH_CONSTANTS.INVALID_CODE,
        status: 400
      },
      { status: 400 }
    );
  }),

  http.post('/api/v1/auth/complete-registration', async ({ request }) => {
    const { displayName, teamName } = await request.json() as { displayName: string; teamName: string };
    
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: 'test@example.com',
        displayName,
      },
      team: {
        id: '1',
        name: teamName,
        role: AUTH_CONSTANTS.ADMIN_ROLE,
      },
    });
  }),

  // Todo lists endpoints - Match backend DTO structure
  http.get('/api/v1/lists', () => {
    return HttpResponse.json({
      todoLists: [ // Changed from 'lists' to 'todoLists' to match GetTodoListsResponse
        {
          id: '1',
          name: 'Personal Tasks',
          description: 'My personal todo list',
          color: '#1976d2',
          todoCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Work Projects',
          description: 'Current work items',
          color: '#d32f2f',
          todoCount: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  }),

  // Team endpoints
  http.get('/api/v1/team/members', () => {
    return HttpResponse.json({
      members: [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: AUTH_CONSTANTS.ADMIN_ROLE,
          joinedAt: new Date().toISOString(),
        },
      ],
    });
  }),
];