export interface IElement {
	type: string;
	props: IProp;
}

export interface IProp {
	[key: string]: any;
	children: IElement[];
}
