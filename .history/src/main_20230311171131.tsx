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
			// children array could be primitive, so we need to filter it, and make it an array of objects
			children: children.map((child) => {
				if (typeof child === 'object') return child;
				const textElement = createTextElement(child);
				console.log(textElement);
				return typeof child === 'object' ? child : createTextElement(child);
			}),
		},
	};
}

function createTextElement(text: string | number | boolean | null | undefined) {
	console.log(text);
	return {
		type: TEXT_ELEMENT,
		props: {
			nodeValue: text,
			children: [],
		},
	};
}

function render(element: IElement, container: HTMLElement | Text) {
	console.log(element);
	console.log(container);
	if (!container) alert('container is not defined');
	if (!element) alert('element is not defined');
	let dom =
		element.type === TEXT_ELEMENT
			? document.createTextNode('')
			: document.createElement(element.type);

	// TODO: Need to find a way to set props to the dom object.
	const { props } = element;
	if (!props) return;
	// only for props
	for (const key of Object.keys(props)) {
		if (key === 'children') continue;
		/**
		 * props[onclick] = () => {}
		 * becomes
		 * dom[onclick] = () => {}
		 */

		// dom = { ...dom, [key]: props[key] };
		// dom[key] = element.props[key];
		Object.defineProperty(dom, key, { value: props[key] });
	}
	// only for children, recursively render to the first ancestor and append
	// BUG: element2.props.children is not iterable.
	const { children } = props;
	if (!children) return;
	for (const child of children) {
		// rendering child recursively
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
	<div id="foo">
		text
		{/* <a>bar</a>
		<b /> */}
	</div>
);

const container = document.getElementById('root');
if (container) Zeroact.render(element, container);
