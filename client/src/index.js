// Importer la bibliothèque React pour creer des composants react
import React from 'react';

// Importer la bibliothèque ReactDOM pour rendre les composants React dans le DOM
import ReactDOM from 'react-dom';

// Importer le composant App depuis le fichier App.js
import App from './App'; 

// Rendre le composant App dans l'élément ayant l'ID 'root' dans le DOM
ReactDOM.render(<App />, document.getElementById('root'));
