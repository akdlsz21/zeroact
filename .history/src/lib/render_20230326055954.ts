import {
	IElement,
	IProp,
	NonHTMLReadOnlyPropertyKeys,
} from '../../types/zeroactTypes';
import { createDom } from './createDom';
import { TEXT_ELEMENT } from './createTextElement';

let nextUnitOfWork: any = null;
let wipRoot: any = null;
let currentRoot:any = null;


export function render(element: IElement, container: HTMLElement) {
	wipRoot = {
		dom: container,
		props: {
			children: [element],
		},
		alternate: currentRoot;
	};

	nextUnitOfWork = wipRoot;
}

function commitRoot() {
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
}

function commitWork(fiber: any) {
	if (!fiber) return;
	const domParent = fiber.parent.dom;
	domParent.appendChild(fiber.dom);
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

export function workLoop(deadLine: any) {
	let shouldYield = false;
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
		shouldYield = deadLine.timeRemaining() < 1;
	}

	// if there is no next work to do, and there is a root fiber, commit the root.
	if (!nextUnitOfWork && wipRoot) commitRoot();

	requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber: IProp) {
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}

	if (fiber.parent) {
		fiber.parent.dom.appendChild(fiber.dom);
	}

	const elements = fiber.props.children;
	let index = 0;
	let prevSibling: any = null;

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		const newFiber = {
			type: element.type,
			props: element.props,
			parent: fiber,
			dom: null,
		};

		if (i === 0) {
			fiber.child = newFiber;
		} else {
			prevSibling.sibling = newFiber;
		}

		prevSibling = newFiber;
	}

	if (fiber.child) {
		return fiber.child;
	}

	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent;
	}
}

// requestIdleCallback is a browser API that calls a function when the browser is idle.
// currently not used anymore. It uses scheduler package.
requestIdleCallback(workLoop);

/*
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
*/
