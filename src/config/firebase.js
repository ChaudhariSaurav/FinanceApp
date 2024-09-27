import { initializeApp } from 'firebase/app';
import { getAuth, } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
	apiKey: "AIzaSyAwyWL3OiyEAsi6Q5gZqowEqAv-cw5wOgE",
	authDomain: "ad-finance-89c05.firebaseapp.com",
	databaseURL: "https://ad-finance-89c05-default-rtdb.firebaseio.com",
	projectId: "ad-finance-89c05",
	storageBucket: "ad-finance-89c05.appspot.com",
	messagingSenderId: "615426489562",
	appId: "1:615426489562:web:0da308db127223ed6a39e3",
	measurementId: "G-ZX89L4HQL2"
// 	apiKey: "AIzaSyDuAtS9V4eiP49Gq8n3-CM9TJSZdfqRNtk",

//   authDomain: "train-site.firebaseapp.com",

//   databaseURL: "https://train-site-default-rtdb.firebaseio.com",

//   projectId: "train-site",

//   storageBucket: "train-site.appspot.com",

//   messagingSenderId: "79077593679",

//   appId: "1:79077593679:web:b4db26802f729fd24d903a",

//   measurementId: "G-11B18P78Z0"


};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Create providers for Google, GitHub, and Discord

export { auth, database, storage };