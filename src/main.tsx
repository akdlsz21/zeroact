import React from 'react';
import { Zeroact } from './lib';

/** @jsx Zeroact.createElement */
function Counter(props: any) {
	const [state, setState] = Zeroact.useState(1);

	return (
		<div>
			<h1>Hello, {props.name}</h1>
			<h2>Count: {state}</h2>

			<button onClick={() => setState((state: number) => state - 1)}>
				-
			</button>
			<button onClick={() => setState((state: number) => state + 1)}>
				+
			</button>
		</div>
	);
}

const element = <Counter name={'This is props. '} />;

const container = document.getElementById('root');

if (container) Zeroact.render(element, container);
