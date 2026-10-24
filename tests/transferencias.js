import http from 'k6/http';
import { check, sleep } from 'k6';
import { pegarBaseUrl } from '../utils/variaveis';

const postLogin = JSON.parse(open('./fixtures/postLogin.json'));
export const options = {
  iterations: 10
};

export default function () {

  const token = obterToken();
  //teste no endpoint de transferencias
  const url = `${pegarBaseUrl()}/transferencias`;

  const payload = JSON.stringify({
    contaOrigem: '1',
    contaDestino: '2',
    valor: 100,
    token: ""
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.post(url, payload, params);
  check(res, 
    { 'status is 201': (r) => r.status === 201   });

    sleep(1);
}
