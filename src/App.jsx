import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import AllRoutes from './routes/routes';
import { DarkModeProvider } from './context/DarkModeContext';

function App() {
  return (
    <Provider store={store}>
      <DarkModeProvider>
        <Router>
          <AllRoutes />
        </Router>
      </DarkModeProvider>
    </Provider>
  );
}

export default App;

