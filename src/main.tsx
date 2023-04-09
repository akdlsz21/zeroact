import React from 'react';
import { Zeroact } from './lib';

/** @jsx Zeroact.createElement */
function Counter(props: any) {
	const [state, setState] = Zeroact.useState(1);
	return (
		<h1
			// DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>'
			onclick={() => setState((c: number) => c + 1)}
			// onclick={() => alert('a')}
			// style="user-select: none"
		>
			Count: {state}
		</h1>
	);
}
const element = <Counter name={'jihoon'} />;
const container = document.getElementById('root');
if (container) Zeroact.render(element, container);
