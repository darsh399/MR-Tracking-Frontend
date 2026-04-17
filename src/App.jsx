import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import AllRoutes from './routes/routes';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AllRoutes />
      </Router>
    </Provider>
  );
}

export default App;

