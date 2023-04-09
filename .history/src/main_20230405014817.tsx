import React from 'react';
import { Zeroact } from './lib';

/** @jsx Zeroact.createElement */
function App(props: any) {
	const { name } = props;
	const temp = (
		<button id="foo" onClick={() => alert('what')}>
			temp {name}
			<b />
		</button>
	);
	console.log('🚀 ~ file: main.tsx:13 ~ App ~ temp:', temp);
	return (
		<div style={{ marginLeft: '100px' }}>
			{/*BUG: currently, not all props are getting added to the dom. */}
			<button id="foo" onClick={() => alert('what')}>
				whats up {name}
				<b />
			</button>
			{temp}
			<div>
				<h1>hello</h1>
			</div>
		</div>
	);
}

const container = document.getElementById('root');
if (container) Zeroact.render(App({ name: 'jihoon' }), container);
