import AbstractBlock from "../AbstractBlock";

export default class Paragraph extends AbstractBlock {
	static displayName:string = 'paragraph';

	private btn:HTMLButtonElement;
	private contentMore:HTMLParagraphElement;

	constructor(el:HTMLElement) {
		super(el);

		this.btn = this.element.querySelector('button');
		this.btn.addEventListener('click', this.onButtonClick);

		this.contentMore = <HTMLParagraphElement>this.element.querySelector('.js-content-more');
	}

	private onButtonClick = () => {
		console.log('click');
		this.contentMore.classList.toggle('hidden');

		if (this.contentMore.classList.contains('hidden')) {
			this.btn.textContent = 'read more...';
		} else {
			this.btn.textContent = 'read less...';
		}
	};

	public dispose() {
		this.btn.removeEventListener('click', this.onButtonClick);
		this.btn = null;

		super.dispose();
	}
}
