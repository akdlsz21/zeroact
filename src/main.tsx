import React from 'react';
import { Zeroact } from './lib';

let nextUnitOfWork: any | undefined = undefined;

function workLoop(deadLine: any) {
	let shouldYield = false;
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
		shouldYield = deadLine.timeRemaining() < 1;
	}
	requestIdleCallback(workLoop);
}
// requestIdleCallback is a browser API that calls a function when the browser is idle.
// currently not used anymore. It uses scheduler package.
requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork: any) {
	// TODO
}

/** @jsx Zeroact.createElement */
const element = (
	<div style={{ marginLeft: '100px' }}>
		<button id="foo">
			what
			<a>bar</a>
			<b />
		</button>
		<div>
			<h1>hello</h1>
		</div>
	</div>
);

const container = document.getElementById('root');
if (container) Zeroact.render(element, container);
