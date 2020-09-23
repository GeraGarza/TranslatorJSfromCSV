const tr = require("googletrans").default;
const data = require( './en.json');

var spanishObj =data


async function translate(lang="en") {
  for (const property in data) {
    for (const index in data[property]) {
      var result = await tr([data[property][index]], { from:"en", to:lang })
      spanishObj[property][index] = result.text
    }
  }
}


(async() => {
  console.log('starting translation...');
  await translate('es');
  console.log(JSON.stringify(spanishObj));
  console.log('finished.');
})();