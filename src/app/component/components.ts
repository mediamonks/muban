declare const module:any;
declare const require:any;

// store for instances
const blocks = {
};

const blockModules = [];

/**
 * Registers a component class to be initialized later for each DOM element matching the block name.
 * @param component
 */
export function registerComponent(component) {
	if (component.block) {
		blockModules.push(component);
	} else {
		console.error('missing "block" definition on component', component);
	}
}

/**
 * Used for hot reloading, is called when a new version of a component class is called.
 * @param component
 */
export function updateComponent(component) {
	const BlockConstructor = component;
	const blockName = BlockConstructor.block;

	// cleanup and recreate all block instances
	blocks[blockName].forEach(b => {
		b.instance.dispose && b.instance.dispose();
		b.instance = new BlockConstructor(b.element);
	});
}

/**
 * Called to init components for the elements in the DOM.
 * @param rootElement
 */
export function initComponents(rootElement) {
	blockModules.forEach(component => {
		const BlockConstructor = component;
		const blockName = BlockConstructor.block;
		blocks[BlockConstructor.block] = [];

		// find all DOM elements that belong the this block
		[].forEach.call(rootElement.querySelectorAll(`[data-component="${blockName}"]`), element => {
			const instance = new BlockConstructor(element);
			blocks[blockName].push({instance, element})
		});
	})
}
