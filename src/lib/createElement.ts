import { IElement, IProp } from '../../types/zeroactTypes';
import { createTextElement } from './createTextElement';

export function createElement(
	type: string,
	props: IProp,
	...children: Array<IElement>
): IElement {
	/**
	 * type: div
	 * props: null
	 * children: null
	 */

	/**
	 * {type: div
	 * 	props: {}
	 * }
	 */
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
