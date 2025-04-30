import { GoogleGenAI } from "@google/genai";
import readline from 'readline';

const protocol = 'https'
const baseURL = 'api.openweathermap.org/geo/1.0/direct'
const API_KEY = '5001aa9dd6e2a2430d809ffcfc5cadcd';
const units = 'metric'
const lang = 'pt_br'
//chave de API 
const API_GEM = 'AIzaSyAWPvwdZ12YF9FGKKS4kn208QqcNvzvbrc';

//cria uma interface para ler a entrada do usuário (stdin) e exibir no terminal (stdout)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ai = new GoogleGenAI({ apiKey: "AIzaSyDbrRcxqIBtkTBxUd3mJX3Y4loCBw7-CI4" });

async function pesquisa() {
  try {
    const { lat, lon } = await perguntarCidade();
    const info = `Com base na localização de latitude: ${lat} e longitude ${lon}, me diga o nome da cidade e escreva um parágrafo com curiosidades, idioma, moeda e uma sugestão turística.`
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: info,
    });
    console.log(response.text);

   
  } catch (err) {
    console.error("Bugou:", err.message);
  } finally {
    rl.close();
  }
}

await pesquisa();

function perguntarCidade(){
  return new Promise((res, rej) => {
          
    
    rl.question('Digite o nome da cidade: ', (cidade) => {
      //monta a URL da api com base no nome da cidade e na chave da api
      
      if (cidade.toLowerCase() === 'sair') {
        console.log('Programa Encerrado.');
        rl.close();
        rej(new Error('Encerrado pelo usuário.'));
        return;
      }
      
      const url = `${protocol}://${baseURL}?appid=${API_KEY}&q=${cidade}&units=${units}&lang=${lang}`;
      
      // Faz a requisição http usando fetch
      fetch(url)
      .then(res => {
        // Se a resposta não for OK lança um erro
        if (!res.ok) {
          throw new Error('Erro ao buscar dados da API');
        }
        // Converte a resposta em json
        return res.json();
      })
      .then(data => {
        if (data.length === 0) {
          //avisa que não encontrou
          rej  (new Error('Cidade não encontrada.'));
          return;
        }
        //pega latitude e longitude
        const { lat, lon } = data[0];
      
      //exibe coordenadas 
      console.log(`Coordenadas de ${cidade}:`);
      console.log(`Latitude: ${lat}`);
      console.log(`Longitude: ${lon}`);
      res({lat,lon});
    })
    .catch(err =>{
      rej(err);

    
    });
   });
  });
}
