import {
	IElement,
	IProp,
	NonHTMLReadOnlyPropertyKeys,
} from '../../types/zeroactTypes';
import { createDom } from './createDom';
import { TEXT_ELEMENT } from './createTextElement';

let nextUnitOfWork: any = null;
let wipRoot: any = null;
let currentRoot: any = null;
let deletions: any = null;

export function render(element: IElement, container: HTMLElement) {
	wipRoot = {
		dom: container,
		props: {
			children: [element],
		},
		// alternate is used to compare the old fiber tree with the new fiber tree.
		// It is used to determine which fibers need to be updated.
		alternate: currentRoot,
	};

	deletions = [];
	nextUnitOfWork = wipRoot;
}

function commitRoot() {
	deletions.forEach(commitWork);
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
}

const isProperty = (key: string) => key !== 'children' && !isEvent(key);
const isGone = (prev: IProp, next: IProp) => (key: string) => !(key in next);
const isNew = (prev: IProp, next: IProp) => (key: string) =>
	prev[key] !== next[key];
// isEvent is used to determine if a property is an event listener.
// event listeners starts with 'on'. For example, onClick, onMouseOver, etc.
// and should be added to the dom element using addEventListener.
const isEvent = (key: string) => key.startsWith('on');

function updateDom(dom: HTMLElement | any, prevProps: IProp, nextProps: IProp) {
	// old or chagned event listeners should be removed.
	Object.keys(prevProps)
		.filter(isEvent)
		.filter(
			(key: string) =>
				!(key in nextProps) || isNew(prevProps, nextProps)(key)
		)
		.forEach((name: string) => {
			const eventType = name.toLowerCase().substring(2);
			dom.removeEventListener(eventType, prevProps[name]);
		});

	// Remove Old Properties
	Object.keys(prevProps)
		.filter(isProperty)
		.filter(isGone(prevProps, nextProps))
		.forEach((key: string) => {
			dom[key] = '';
		});

	Object.keys(nextProps)
		.filter(isProperty)
		.filter(isNew(prevProps, nextProps))
		.forEach((name) => {
			dom[name] = nextProps[name];
		});

	// add event listeners
	Object.keys(nextProps)
		.filter(isEvent)
		.filter(isNew(prevProps, nextProps))
		.forEach((name: string) => {
			console.log(name);
			const eventType = name.toLowerCase().substring(2);
			dom.addEventListener(eventType, nextProps[name]);
		});
}

function commitWork(fiber: any) {
	if (!fiber) return;
	const domParent = fiber.parent.dom;
	domParent.appendChild(fiber.dom);
	commitWork(fiber.child);
	commitWork(fiber.sibling);
	if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
		console.log('asd');
		domParent.appendChild(fiber.dom);
	} else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
		console.log('asd');

		updateDom(fiber.dom, fiber.alternate.props, fiber.props);
	} else if (fiber.effectTag === 'DELETION') {
		console.log('asd');

		domParent.removeChild(fiber.dom);
	}
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
	const isFunctionComponent = fiber.type instanceof Function;

	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
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
	console.log(nextFiber);
}

function reconcileChildren(wipFiber: any, elements: any) {
	let index = 0;
	let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
	let prevSibling = null;

	while (index < elements.length || oldFiber != null) {
		const element = elements[index];
		let newFiber = null;

		// compare oldFiber to element
		const sameType = oldFiber && element && element.type === oldFiber.type;

		if (sameType) {
			newFiber = {
				type: oldFiber.type,
				props: element.props,
				dom: oldFiber.dom,
				parent: wipFiber,
				alternate: oldFiber,
				// effectTag is used at commit phase
				effectTag: 'UPDATE',
			};
		}
		if (element && !sameType) {
			newFiber = {
				type: element.type,
				props: element.props,
				dom: null,
				parent: wipFiber,
				alternate: null,
				effectTag: 'PLACEMENT',
			};
		}
		if (oldFiber && !sameType) {
			// if oldFiber exists, and it is not the same type as element, delete it.
			oldFiber.effectTag = 'DELETION';
			deletions.push(oldFiber);
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		if (index === 0) {
			wipFiber.child = newFiber;
		} else if (element) {
			prevSibling.sibling = newFiber;
		}

		prevSibling = newFiber;
		index++;
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
