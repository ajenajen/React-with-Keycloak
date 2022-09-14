import axios from 'axios';
import * as Auth from './auth/utils';

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE'
};

const _axios = axios.create();

const configure = () => {
  _axios.interceptors.request.use((config) => {
    const iamToken = Auth.getIamToken();
    if (iamToken && config?.headers) {
      config.headers.Authorization = `Bearer ${iamToken}`;
      // const cb = () => {
      //   return Promise.resolve(config);
      // };
      // return AuthService.updateToken(cb);
      console.log('HttpService', config);
      return config;
    }
  });
};

const HttpService = {
  HttpMethods,
  configure
};

export default HttpService;
