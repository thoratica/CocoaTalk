import { AuthApiClient, DefaultConfiguration, OAuthCredential, ServiceApiClient } from 'node-kakao';
import { SessionWebClient } from 'node-kakao/src/api';
import { AxiosWebClient } from 'node-kakao/src/api/axios-web-client';

export default class Api {
  constructor(authApiClient: AuthApiClient) {
    this.authApiClient = authApiClient;
  }

  init(credential: OAuthCredential) {
    this.oAuthCredential = credential;
    this.serviceApiClient = new ServiceApiClient(
      new SessionWebClient(new AxiosWebClient('https', 'katalk.kakao.com'), credential, DefaultConfiguration)
    );
  }

  // @ts-ignore
  oAuthCredential: OAuthCredential;
  authApiClient: AuthApiClient;
  // @ts-ignore
  serviceApiClient: ServiceApiClient;
}
