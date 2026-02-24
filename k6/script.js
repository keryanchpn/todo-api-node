import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

const BASE_URL = 'https://todo-api-node.vercel.app';

export default function () {
  // Test GET /todos
  const res = http.get(`${BASE_URL}/todos`);
  check(res, { 'GET /todos status 200': (r) => r.status === 200 });

  // Test GET /health
  const health = http.get(`${BASE_URL}/health`);
  check(health, { 'GET /health status 200': (r) => r.status === 200 });

  sleep(1);
}
