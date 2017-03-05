import AbstractBlock from "../AbstractBlock";

export default class Block1 extends AbstractBlock {
	static block:string = 'block1';

	private btn:HTMLButtonElement;

	constructor(el:HTMLElement) {
		super(el);

		this.btn = this.element.querySelector('button');
		this.btn.addEventListener('click', this.onButtonClick);
	}

	private onButtonClick = () => {
		console.log('btn click');
	};

	public dispose() {
		this.btn.removeEventListener('click', this.onButtonClick);
		this.btn = null;

		super.dispose();
	}
}
