import React from 'react';
import { Provider } from "react-redux";
// import ReactDOM from 'react-dom/client'; <- This import is only for React version 18
import { render } from 'react-dom'; // <- This is the correct import statement for React version 17
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import store from './reduxsingle';


// const root = ReactDOM.createRoot(document.getElementById('root'));
const root = document.getElementById('root'); // <- This is the correct method call for React version 17
render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  root
);

