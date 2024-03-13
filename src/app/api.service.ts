import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { firstValueFrom }from 'rxjs'
import ApiResponse from 'src/interface/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiEnv: string = 'hospedada';
  constructor(private _httpClient: HttpClient){}

  async getDataRegression(type: string, params: number[], results: number[], aprox?: number, expr?: string):
  Promise <{success: boolean, response: ApiResponse, message?: string}>{
    const BASE_URL = environment.baseUrl
    const LOCAL_URL = environment.localUrl

    let api_url = this.apiEnv == 'hospedada' ? `${BASE_URL}` : `${LOCAL_URL}`

    try {
      const response = await firstValueFrom(
        this._httpClient.post<{success: boolean, response: ApiResponse}>(
          api_url,
          {
            type, params, results, aprox, expr
          }
        )
      )
      return response
    } catch(error){
      console.log(error);
      throw new Error('Falha de conexão com a API');
    }
  }

  setEnv(option: string): void {
    this.apiEnv = option
  }
}
