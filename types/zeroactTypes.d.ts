export interface IElement {
	type: string;
	props: IProp;
}

export interface IProp {
	[key: string]: any; // all additional properties will be allowed.
	children?: IElement[]; // there might not be children.
}

export type HTMLElementReadOnlyProperties =
	| 'ATTRIBUTE_NODE'
	| 'CDATA_SECTION_NODE'
	| 'COMMENT_NODE'
	| 'DOCUMENT_FRAGMENT_NODE'
	| 'DOCUMENT_NODE'
	| 'DOCUMENT_POSITION_CONTAINED_BY'
	| 'DOCUMENT_POSITION_CONTAINS'
	| 'DOCUMENT_POSITION_DISCONNECTED'
	| 'DOCUMENT_POSITION_FOLLOWING'
	| 'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC'
	| 'DOCUMENT_POSITION_PRECEDING'
	| 'DOCUMENT_TYPE_NODE'
	| 'ELEMENT_NODE'
	| 'ENTITY_NODE'
	| 'ENTITY_REFERENCE_NODE'
	| 'NOTATION_NODE'
	| 'PROCESSING_INSTRUCTION_NODE'
	| 'TEXT_NODE'
	| 'accessKeyLabel'
	| 'assignedSlot'
	| 'attributeStyleMap'
	| 'attributes'
	| 'baseURI'
	| 'childElementCount'
	| 'childNodes'
	| 'children'
	| 'classList'
	| 'clientHeight'
	| 'clientLeft'
	| 'clientTop'
	| 'clientWidth'
	| 'dataset'
	| 'firstChild'
	| 'firstElementChild'
	| 'isConnected'
	| 'isContentEditable'
	| 'lastChild'
	| 'lastElementChild'
	| 'localName'
	| 'namespaceURI'
	| 'nextElementSibling'
	| 'nextSibling'
	| 'nodeName'
	| 'nodeType'
	| 'offsetHeight'
	| 'offsetLeft'
	| 'offsetParent'
	| 'offsetTop'
	| 'offsetWidth'
	| 'ownerDocument'
	| 'parentElement'
	| 'parentNode'
	| 'part'
	| 'prefix'
	| 'previousElementSibling'
	| 'previousSibling'
	| 'scrollHeight'
	| 'scrollWidth'
	| 'shadowRoot'
	| 'style'
	| 'tagName';

export type NonHTMLReadOnlyPropertyKeys = Exclude<
	keyof HTMLElement,
	HTMLElementReadOnlyProperties
>;
