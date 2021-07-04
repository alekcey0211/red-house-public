const csv2json = require('csv2json');
const fs = require('fs');
// const path = require('path');

const serverStringPath = '../server/data/strings';
const strings = fs.readdirSync(serverStringPath);
strings
	.filter((str) => str.endsWith('.csv'))
	.forEach((str) => {
		const file = serverStringPath + '/' + str;
		fs.createReadStream(file)
			.pipe(csv2json())
			.pipe(fs.createWriteStream(file.replace('.csv', '.json')));
	});
