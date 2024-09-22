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

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Create providers for Google, GitHub, and Discord

export { auth, database, storage };