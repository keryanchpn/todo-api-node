import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  const BASE_URL = 'https://todo-api-node.vercel.app';

  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
  });

  const todosRes = http.get(`${BASE_URL}/todos`);
  check(todosRes, {
    'todos status is 200': (r) => r.status === 200,
  });
}
