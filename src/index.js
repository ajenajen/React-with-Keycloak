import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setAuthHeaders, axios } from 'modules/api/AxiosInstance';

import App from 'components/App';
import { configureStore } from 'stores/store';
import ThemeProvider from 'styles/ThemeProvider';

setAuthHeaders(axios);
const store = configureStore();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
