import { IElement, IProp } from '../types/zeroactTypes';

const TEXT_ELEMENT = 'TEXT ELEMENT';

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
			children: children.map((child) =>
				typeof child === 'object' ? child : createTextElement(child)
			),
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

function render(element: IElement, container: any) {
	const dom =
		element.type === TEXT_ELEMENT
			? document.createTextNode('')
			: document.createElement(element.type);

	// TODO: Need to find a way to set props to the dom object.
	for (const key of Object.keys(element.props)) {
		if (key === 'children') continue;
		/**
		 * props[onclick] = () => {}
		 * becomes
		 * dom[onclick] = () => {}
		 */
		dom[key] = element.props[key];
	}

	for (const child of element.props.children) {
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
		<a>bar</a>
		<b />
	</div>
);

const container = document.getElementById('root');
console.log('🚀 ~ file: main.tsx:71 ~ container:', container);
Zeroact.render(element, container);
