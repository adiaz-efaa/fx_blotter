import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import update from './redux/reducer'
import './index.css';
import './index2.css';
import FXBlotter from './containers/FXBlotter'
import * as serviceWorker from './serviceWorker';

const store = createStore(update)

const ToRender = () => {
  return (
    <Provider store={store}>
      <FXBlotter headerStyle='header' blotterStyle='blotter' flexH='flex-h' />
    </Provider>
  )
}

ReactDOM.render(<ToRender />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
