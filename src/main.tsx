

/* global chrome */
import { render } from 'preact'
import 'preact/jsx-runtime'
import App from './App';


const appEl = document.getElementById('app');

if (!appEl) {
	throw new Error('no app container found');
}

render(<App />, appEl)
