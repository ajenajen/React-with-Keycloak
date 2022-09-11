import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import StoreService from './services/StoreService';
import AuthService from './services/AuthService';
import HttpService from './services/HttpService';

const store = StoreService.setup();

const renderApp = () =>
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );

AuthService.initKeycloak(renderApp);
HttpService.configure();
