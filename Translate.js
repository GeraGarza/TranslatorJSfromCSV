const tr = require("googletrans").default;
const data = require('./en.json');
const fs = require('fs')

var languages = {
  english: "en",
  spanish: "es",
  japanese: "ja",
  korean: "ko",
  malay: "ms",
  chinese_simplified: "zh_CN",
  chinese_traditional: "zh_TW",
  thai: 'th',
  indonesian: "id"
}

var data_copy = data

async function translate(lang = "en") {
  for (const property in data) {
    for (const index in data[property]) {
      var result = await tr([data[property][index]], {
        from: "en",
        to: lang
      })
      data_copy[property][index] = result.text
    }
  }

  return data_copy

}

(async () => {
  for (var lang in languages) {
    console.log(lang + " -> " + languages[lang]);

    var newObj = await translate(languages.spanish)

    fs.writeFile(`${languages[lang]}.json`, JSON.stringify(newObj), e => {
      if (e) throw e
    })
    console.log('finished.');

  }
})();