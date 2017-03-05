import AbstractBlock from "../AbstractBlock";

export default class Block2 extends AbstractBlock {
	static block:string = 'block2';

	constructor(el:HTMLElement) {
		super(el);
	}

	public dispose() {
		super.dispose();
	}
}
