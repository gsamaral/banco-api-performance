import http from 'k6/http';
import { check, sleep } from 'k6';
const postLogin = JSON.parse(open('./fixtures/postLogin.json'));
export const options = {
  //vus: 10,
  //duration: '5m',
  tresholds: {
    http_req_duration: ['p(95) < 300','max<500'],
    http_req_failed: ['rate<0.01'],
  }, 
  //Definindo os estágios do teste de carga que simula o aumento e diminuição de usuários virtuais ao longo do tempo
  stages: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 10 },
    { duration: '1m', target: 0 },
  ],
  
};

export default function () {
  const url = 'http://localhost:3000/login';
  const payload = JSON.stringify({
    username: __ENV.LOGIN_USERNAME || 'julio.lima',
    senha: __ENV.LOGIN_PASSWORD || '123456',
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