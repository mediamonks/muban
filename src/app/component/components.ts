declare const module:any;
declare const require:any;

import { getModuleContext, getChanged } from '../util/webpack';

// Get all component scripts
const [blockModules, blockContext] = getModuleContext(
	require.context('./', true, /([^\/]+)\/\1\.(ts|js)$/i)
);

// store for instances
const blocks = {
};

export function initComponents(rootElement) {
	Object.keys(blockModules).forEach(key => {
		const BlockConstructor = blockModules[key].default;
		const blockName = BlockConstructor.block;
		blocks[BlockConstructor.block] = [];

		// find all DOM elements that belong the this block
		[].forEach.call(rootElement.querySelectorAll(`[data-component="${blockName}"]`), element => {
			const instance = new BlockConstructor(element);
			blocks[blockName].push({instance, element})
		});
	})
}


// Hot Module Replacement API
if (module.hot) {
	module.hot.accept(blockContext.id, () => {
		const changedModules = getChanged(
			require.context('./', true, /([^\/]+)\/\1\.(ts|js)$/i),
			blockModules,
		);

		changedModules.forEach(({key, content}) => {
			const BlockConstructor = content.default;
			const blockName = BlockConstructor.block;

			// cleanup and recreate all block instances
			blocks[blockName].forEach(b => {
				b.instance.dispose && b.instance.dispose();
				b.instance = new BlockConstructor(b.element);
			})
		});
	});
}
