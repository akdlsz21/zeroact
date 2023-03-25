import {
	IElement,
	NonHTMLReadOnlyPropertyKeys,
} from '../../types/zeroactTypes';
import { TEXT_ELEMENT } from './createTextElement';

export function render(element: IElement, container: HTMLElement | Text) {
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
		if (dom instanceof HTMLElement) {
			const elemPropKey = key as NonHTMLReadOnlyPropertyKeys;
			// dom[elemPropKey] = element.props[key];
		}
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
