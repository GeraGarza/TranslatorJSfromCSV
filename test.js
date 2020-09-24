const tr = require("googletrans").default;
const data = require('./en.json');
const fs = require('fs')

var languages = {
  spanish: "es",
  japanese: "ja",
  korean: "ko",
  malay: "ms",

  thai: 'th',
  indonesian: "id"
}
// chinese_simplified: "zh_CN",
// chinese_traditional: "zh_TW",


async function translateReq(lang, property, index) {
  return await tr([data[property][index]], {
    from: "en",
    to: lang
  }).catch(function (error) {
    console.log(error);
  });
}

dataCopy = data

function translate(lang = "en") {
  var promiseData = data
  promises = []

  for (const property in data) {
    for (const index in data[property]) {
      promiseData[property[index]]= translateReq(lang, property, index);
      promises.push(index)
    }
  }


  return Promise.all(promises)
    .then(() => {
      for (const property in data) {
        for (const index in data[property]) {
          promiseData[property][index] = promiseData[property][index]
        }
      }
      return promiseData
    })
}

(async () => {
  for (var lang in languages) {
    console.log(lang + " -> " + languages[lang]);

    try {
      var newObj = await translate(languages[lang])
      fs.writeFile(`${languages[lang]}.json`, JSON.stringify(newObj), e => {
        if (e) throw e
      })
      console.log('finished.');
    } catch (e) {
      console.log(e)
    }

  }
})();