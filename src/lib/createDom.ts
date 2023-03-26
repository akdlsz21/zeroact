import { TEXT_ELEMENT } from './createTextElement';

export function createDom(fiber: any) {
	let dom;
	if (fiber.type === TEXT_ELEMENT) {
		dom = document.createTextNode('');
	} else {
		dom = document.createElement(fiber.type);
	}

	for (const key in fiber.props) {
		if (key === 'children') continue;
		dom[key] = fiber.props[key];
	}

	return dom;
}
