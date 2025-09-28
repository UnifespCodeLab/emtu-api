
import axios, { AxiosRequestConfig } from 'axios';
import { IBusExternal } from '../interfaces/busExternal';
import BusRoute from './../../models/busRoute';
import dotenv from "dotenv";

dotenv.config();

export default class AxiosBusExternal implements IBusExternal {
  private axiosConfig: AxiosRequestConfig;

  constructor() {
    // Validate EMTU_API environment variable
    if (!process.env.EMTU_API) {
      throw new Error('EMTU_API environment variable is not set');
    }
    
    console.log(`EMTU_API configurado para: ${process.env.EMTU_API}`);
    
    this.axiosConfig = {
      timeout: 30000, // 30 seconds timeout
      // Prevent proxy usage that might redirect to localhost
      proxy: false,
      headers: {
        'User-Agent': 'emtu-api/1.0.0',
      },
      // Disable any environment proxy settings
      httpAgent: false,
      httpsAgent: false,
    };
  }

  async getLinesDetails(busRoutes : BusRoute[]) {
    return await Promise.all(busRoutes.map((route)=> this.getFromEmtuApi(route.routeShortName)));
  }

  async getFromEmtuApi(lineId: string){
    const url = `${process.env.EMTU_API}/lineDetails?linha=${lineId}`;
    
    try {
      console.log(`Fazendo requisição para: ${url}`);
      const response = await axios.get(url, this.axiosConfig);
      console.log(`Requisição bem-sucedida para linha ${lineId}`);
      return response;
    } catch (error: any) {
      console.error(`Erro na requisição para linha ${lineId}:`);
      console.error(`URL: ${url}`);
      console.error(`Erro: ${error.message}`);
      if (error.config) {
        console.error(`Config URL: ${error.config.url}`);
        console.error(`Proxy: ${JSON.stringify(error.config.proxy)}`);
      }
      if (error.code === 'ECONNREFUSED') {
        console.error('Conexão recusada. Verificar se não há proxy redirecionando para localhost');
      }
      throw error;
    }
  }
};