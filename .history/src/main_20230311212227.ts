import { IElement, IProp } from '../types/zeroactTypes';

const TEXT_ELEMENT = 'TEXT_ELEMENT';

export function createElement(
	type: string,
	props: IProp,
	...children: Array<IElement | string>
): IElement {
	return {
		type,
		props: {
			...props,
			// children array could be primitive, so we need to filter it, and make it an array of Element type objects.
			children: children.map((child) => {
				if (typeof child === 'object') return child;
				const textElement = createTextElement(child);
				return typeof child === 'object' ? child : textElement;
			}),
		},
	};
}

function createTextElement(text: string | number | boolean | null | undefined) {
	return {
		type: TEXT_ELEMENT,
		props: {
			nodeValue: text,
			children: [],
		},
	};
}

function render(element: IElement, container: HTMLElement | Text) {
	if (!container) alert('container is not defined');
	if (!element) alert('element is not defined');

	let dom =
		element.type === TEXT_ELEMENT
			? document.createTextNode('')
			: document.createElement(element.type);

	for (const key in element.props) {
		if (key === 'children') continue;
		if (key === 'nodeValue' && dom.nodeValue === '') {
			// Static method Object.defineProperty does sets a new property to the dom,
			// but when appendChild to the container, it does not get reflected. Do not know why.
			dom.nodeValue = element.props[key];
			continue;
		}
		const val: keyof HTMLElement = element.props[key];
		dom[key] = val;
		// Object.defineProperty(dom, key, {
		// 	value: element.props[key],
		// 	enumerable: true,
		// 	writable: false,
		// });
	}

	const { children } = element.props;
	if (!children) return;
	for (const child of children) {
		render(child, dom);
	}

	container.appendChild(dom);
}

const Zeroact = {
	createElement,
	render,
};

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
