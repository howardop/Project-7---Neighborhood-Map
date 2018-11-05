import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

window.gm_authFailure = () => { 
    //console.map('gm_authFailure called');
    alert('Google Maps authtentication failed.\n\nPlease check your Google Maps API key and try again.');
}; 
