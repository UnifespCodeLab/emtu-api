#!/usr/bin/env node

const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('Testando conexão com EMTU API...');
  console.log(`EMTU_API: ${process.env.EMTU_API}`);
  
  const config = {
    timeout: 10000,
    proxy: false,
    headers: {
      'User-Agent': 'emtu-api-test/1.0.0',
    },
  };

  try {
    // Teste básico de conectividade
    const testUrl = `${process.env.EMTU_API}/lineDetails?linha=001`;
    console.log(`Testando URL: ${testUrl}`);
    
    const response = await axios.get(testUrl, config);
    
    console.log('Conexão bem-sucedida!');
    console.log(`Status: ${response.status}`);
    console.log(`Headers: ${JSON.stringify(response.headers, null, 2)}`);
    console.log(`Data preview: ${JSON.stringify(response.data).substring(0, 200)}...`);
    
  } catch (error) {
    console.error('Erro na conexão:');
    console.error(`Mensagem: ${error.message}`);
    console.error(`Código: ${error.code}`);
    
    if (error.response) {
      console.error(`Status HTTP: ${error.response.status}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    }
    
    if (error.config) {
      console.error(`URL configurada: ${error.config.url}`);
      console.error(`Proxy: ${JSON.stringify(error.config.proxy)}`);
      console.error(`Timeout: ${error.config.timeout}`);
    }
    
    // Diagnósticos específicos
    if (error.code === 'ECONNREFUSED') {
      console.error('DIAGNÓSTICO: Conexão recusada');
      console.error('   - Verifique se não há proxy configurado');
      console.error('   - Verifique variáveis de ambiente HTTP_PROXY/HTTPS_PROXY');
      console.error('   - Teste a URL manualmente: curl ' + testUrl);
    }
    
    process.exit(1);
  }
}

// Executar teste
testConnection();