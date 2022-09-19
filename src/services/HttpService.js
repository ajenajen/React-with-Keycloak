import axios from 'axios';
import * as Auth from './auth/utils';

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE'
};

// const _axios = axios.create();

const configure = () => {
  const iamToken = Auth.getIamToken();
  axios.interceptors.request.use(
    (config) => {
      if (iamToken && config?.headers) {
        config.headers.Authorization = `Bearer ${iamToken}`;
        // const cb = () => {
        //   return Promise.resolve(config);
        // };
        // return AuthService.updateToken(cb);
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};

const HttpService = {
  HttpMethods,
  configure
};

export default HttpService;
