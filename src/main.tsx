import React from 'react';
import { Zeroact } from './lib';

let nextUnitOfWork: any | undefined = undefined;

/** @jsx Zeroact.createElement */
const element = (
	<div style={{ marginLeft: '100px' }}>
		{/*BUG: currently, not all props are getting added to the dom. */}
		<button id="foo" onClick={() => alert('what')}>
			whats up
			<b />
		</button>
		<div>
			<h1>hello</h1>
		</div>
	</div>
);

const container = document.getElementById('root');
if (container) Zeroact.render(element, container);
