import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '5m',
  tresholds: {
    http_req_duration: ['p(95) < 300','max<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
    const url = 'http://localhost:3000/login';
  const payload = JSON.stringify({
    username: 'julio.lima',
    senha: '123456',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);
  check(res, 
    { 'status is 200': (r) => r.status === 200,
        'validar que o token é string': (r) => typeof r.json().token === 'string'    });
}