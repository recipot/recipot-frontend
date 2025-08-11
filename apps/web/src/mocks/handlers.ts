import { http } from 'msw';

export const handlers = [
  http.get('/api/hello', ({ request }) => {
    return Response.json({ message: 'Hello from MSW' });
  }),
];