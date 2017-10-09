export default class AbstractComponent {
	constructor(public element:HTMLElement) {

	}

	dispose() {
		this.element = null;
	}
}
