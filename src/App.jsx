import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Store from './redux/Store';
import AllRoutes from './routes/routes';

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <AllRoutes />
      </Router>
    </Provider>
  );
}

export default App;
