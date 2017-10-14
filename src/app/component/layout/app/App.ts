import AbstractComponent from "../../AbstractComponent";

export default class App extends AbstractComponent {
	static displayName:string = 'app-root';

	constructor(element:HTMLElement) {
		super(element);

		// for generic app logic
		console.log('Welcome to this app!');
	}


	public dispose() {
		// clean up stuff when hot reloading
	}
}
