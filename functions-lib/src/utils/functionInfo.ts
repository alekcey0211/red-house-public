/* eslint-disable no-restricted-syntax */
export class FunctionInfo<F extends { toString: () => string }> {
	// eslint-disable-next-line no-empty-function
	constructor(private f: F) {}

	get body(): string {
		const funcString = this.f.toString().substring(0, this.f.toString().length - 1);
		return funcString.replace(new RegExp('^.+?{', 'm'), '').trim();
	}

	tryCatch(): string {
		return `
      try {
        ${this.body}
      } catch(err) {
        ctx.sp.printConsole('[CTX ERROR]', err);
      }`;
	}

	getText(args?: Record<string, unknown>, log: boolean = false): string {
		let result = this.tryCatch();

		// eslint-disable-next-line guard-for-in
		for (const name in args) {
			const arg = args[name];
			switch (typeof arg) {
				case 'number':
					result = `const ${name} = ${arg};\n${result}`;
					break;
				case 'string':
					result = `const ${name} = '${arg}';\n${result}`;
					break;
				case 'boolean':
					result = `const ${name} = ${arg};\n${result}`;
					break;
				case 'object':
					if (Array.isArray(arg)) {
						if (typeof arg[0] === 'number') {
							result = `const ${name} = [${arg}];\n${result}`;
						} else if (typeof arg[0] === 'string') {
							result = `const ${name} = [${arg.map((x) => `"${x}"`)}];\n${result}`;
						}
					}
					break;
				case 'function':
					// eslint-disable-next-line @typescript-eslint/ban-types
					result = `const ${name} = ${(arg as Function).toString()};\n${result}`;
					break;
			}
		}
		if (log) {
			console.log(result);
		}
		return result;
	}
}
