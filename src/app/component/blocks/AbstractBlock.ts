export default class AbstractBlock {
	constructor(public element:HTMLElement) {

	}

	dispose() {
		this.element = null;
	}
}
