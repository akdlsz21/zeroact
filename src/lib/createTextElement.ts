export const TEXT_ELEMENT = 'TEXT_ELEMENT';

export function createTextElement(
	text: string | number | boolean | null | undefined
) {
	return {
		type: TEXT_ELEMENT,
		props: {
			nodeValue: text,
			children: [],
		},
	};
}
