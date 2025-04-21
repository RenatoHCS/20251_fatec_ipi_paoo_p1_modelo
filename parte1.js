//le entrada do usuário pelo terminal
const readline = require('readline');

//chave de API 
const API_KEY = '5001aa9dd6e2a2430d809ffcfc5cadcd';

//cria uma interface para ler a entrada do usuário (stdin) e exibir no terminal (stdout)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('Digite o nome da cidade: ', (cidade) => {
//monta a URL da api com base no nome da cidade e na chave da api
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cidade}&limit=1&appid=${API_KEY}`;

  // Faz a requisição http usando fetch
  fetch(url)
    .then(res => {
      // Se a resposta não for OK lança um erro
      if (!res.ok) {
        throw new Error('Erro ao buscar dados da API');
      }
      //converte a resposta em json
      return res.json();
    })
    .then(data => {
      //avisa que não encontrou
      if (data.length === 0) {
        console.log('Cidade não encontrada.');
        return;
      }

      //pega latitude e longitude
      const { lat, lon } = data[0];

      //exibe coordenadas 
      console.log(`Coordenadas de ${cidade}:`);
      console.log(`Latitude: ${lat}`);
      console.log(`Longitude: ${lon}`);
    })
    .catch(err => {
      //trata qualquer erro ocorrido durante a requisição ou parsing da resposta
      console.error('Erro:', err.message);
    })
    .finally(() => {
      //encerra a interface de leitura após a operação
      rl.close();
    });
});
