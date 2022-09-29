import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import StoreService from './services/StoreService';
import ThemeProvider from './styles/ThemeProvider';

const store = StoreService.setup();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
