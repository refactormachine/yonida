const colors = require('colors');
const ignoreKeys = ['brfs'];
const packages = {};
const multiVersions = {};

function npmCheck() {
	require('child_process').exec('npm ls --prod --json', function (err, stdout, stderr) {
		var result;
		try {
			result = JSON.parse(stdout);
		} catch (e) {
			err = new Error('Cannot parse npm ls json');
		}
		if (err && !result) {
			log(`npm ls error: ${err} | ${stderr}`);
			process.exit(1);
		}
		getDependencies(result, '/');
		const multiVersionKeys = Object.keys(multiVersions);

		if (multiVersionKeys.length) {
			log(('Found multiple dependencies:').underline.bold, 'red');
			multiVersionKeys.forEach(key => {
				log(`${key}:`, 'white');
				multiVersions[key].forEach(multiVersion => {
					log(`--- ${multiVersion.version} (${multiVersion.path})`);
				});
			});
			process.exit(1);
		} else {
			log(('npm dependencies OK').bold, 'green');
		}
	});
}

function getDependencies(node, path) {
	if (!node.dependencies) {
		return;
	}
	
	const dependencies = node.dependencies;
	Object.keys(dependencies).forEach(dependencyKey => {

		if (ignoreKeys.indexOf(dependencyKey) > -1) {
			return;
		}

		const dependency = dependencies[dependencyKey];

		if (typeof packages[dependencyKey] === 'undefined') { // new dependency
			packages[dependencyKey] = [{
				version: dependency.version,
				path: path
			}];
		} else if (packages[dependencyKey].map(details => details.version).indexOf(dependency.version) === -1) { // new dependency version
			packages[dependencyKey].push({
				version: dependency.version,
				path: path
			});

			multiVersions[dependencyKey] = packages[dependencyKey];
		}

		getDependencies(dependency, `${path}${dependencyKey}/`);
	});

}

function log(msg, color) {
	color = color || 'cyan';

	console.log((msg)[color]);
}

npmCheck();
