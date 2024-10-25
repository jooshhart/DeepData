import React from 'react';
import ReactDOM from 'react-dom/client';
// import './assets/styles/bootstrap.custom.css';
// import './assets/styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Queries from './pages/Queries';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Visuals from './pages/Visuals';
import store from './store';
import { Provider } from 'react-redux';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Homepage />} />
      <Route path='/search/:keyword' element={<Homepage />} />
      <Route path='/page/:pageNumber' element={<Homepage />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<Homepage />}
      />
      <Route path='/queries' element={<Queries />} />
      <Route path='/visuals' element={<Visuals />} />
      <Route path='/login' element={<SignIn />} />
      <Route path='/register' element={<SignUp />} />
      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </ Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();