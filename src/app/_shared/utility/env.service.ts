import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
const PATH_TO_SERVER_CONSTANTS_FILE = '../../../assets/data/server.constants.json';
const PATH_TO_BUILD_CONSTANTS_FILE = '../../../assets/data/build.constants.json';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  constructor(private http: HttpClient, handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  public static serverConstants: any;
  public static buildConstants: any;
  public server;
  httpClient: HttpClient;

  loadConstants() {
    this.httpClient.get(PATH_TO_BUILD_CONSTANTS_FILE)
      .toPromise()
      .then(data => {
        EnvService.buildConstants = data;
      });
    return this.httpClient.get(PATH_TO_SERVER_CONSTANTS_FILE)
      .toPromise()
      .then(data => {
        EnvService.serverConstants = data;
      });
  }

  apiUrl() {
    return EnvService.serverConstants;
  }

  getBuildInformation() {
    return EnvService.buildConstants;
  }
}
