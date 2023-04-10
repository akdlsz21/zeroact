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
	console.log('🚀 ~ file: render.ts:15 ~ render ~ element:', element);
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
	console.log('a');
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
	console.log('a');
	// add event listeners
	Object.keys(nextProps)
		.filter((key) => isEvent(key))
		.filter(isNew(prevProps, nextProps))
		.forEach((name: string) => {
			console.log(name);
			const eventType = name.toLowerCase().substring(2);
			console.log(
				'🚀 ~ file: render.ts:80 ~ .forEach ~ eventType:',
				eventType
			);
			dom.addEventListener(eventType, nextProps[name]);
		});
}

function commitWork(fiber: any) {
	if (!fiber) return;

	let domParentFiber = fiber.parent;
	while (!domParentFiber.dom) {
		domParentFiber = domParentFiber.parent;
	}
	const domParent = domParentFiber.dom;
	commitWork(fiber.child);
	commitWork(fiber.sibling);

	if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
		domParent.appendChild(fiber.dom);
	} else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
		updateDom(fiber.dom, fiber.alternate.props, fiber.props);
	} else if (fiber.effectTag === 'DELETION') {
		commitDeletion(fiber, domParent);
	}
}

function commitDeletion(fiber: any, domParent: any) {
	if (fiber.dom) {
		domParent.removeChild(fiber.dom);
	} else {
		commitDeletion(fiber.child, domParent);
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
	if (isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
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

function reconcileChildren(wipFiber: any, elements: any) {
	console.log(elements);
	elements;
	let index = 0;
	let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
	let prevSibling: any = null;

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
let wipFiber: any = {
	alternate: null,
	hooks: [],
};
let hookIndex: any = null;

export function useState(initial: any) {
	const oldHook =
		wipFiber.alternate &&
		wipFiber.alternate.hooks &&
		wipFiber.alternate.hooks[hookIndex];
	const hook = {
		state: oldHook ? oldHook.state : initial,
		queue: [] as any[],
	};

	const actions = oldHook ? oldHook.queue : [];
	actions.forEach((action: any) => {
		hook.state = action(hook.state);
	});

	const setState = (action: any) => {
		hook.queue.push(action);
		wipRoot = {
			dom: currentRoot.dom,
			props: currentRoot.props,
			alternate: currentRoot,
		};
		nextUnitOfWork = wipRoot;
		deletions = [];
	};

	wipFiber.hooks.push(hook);
	hookIndex++;
	return [hook.state, setState];
}

function updateFunctionComponent(fiber: any) {
	wipFiber = fiber;
	hookIndex = 0;
	wipFiber.hooks = [];
	const children = [fiber.type(fiber.props)];
	reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: any) {
	console.log(fiber);
	if (!fiber.dom) {
		fiber.dom = createDom(fiber);
	}
	reconcileChildren(fiber, fiber.props.children);
}

// requestIdleCallback is a browser API that calls a function when the browser is idle.
// currently not used anymore. It uses scheduler package.
requestIdleCallback(workLoop);
