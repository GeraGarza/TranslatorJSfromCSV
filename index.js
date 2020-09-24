const tr = require("googletrans").default;
const data = require("./en.json");
const fs = require("fs");

// https://py-googletrans.readthedocs.io/en/latest/  // list of langauges
var languages = {
  spanish: "es",
  japanese: "ja",
  korean: "ko",
  malay: "ms",
  chinese_simplified: "zh-cn",
  chinese_traditional: "zh-tw",
  thai: "th",
  indonesian: "id",
};

async function translate(lang = "en") {
  let data_copy = JSON.parse(JSON.stringify(data));

  for (const property in data) {
    for (const index in data[property]) {
      var words_to_translate = data[property][index];
      var result = await tr([words_to_translate], {
        from: "en",
        to: lang,
      });
      data_copy[property][index] = result.text;
      //   console.log(data[property][index]);
      //   console.log(result.text);
    }
  }

  return data_copy;
}

(async () => {
  for (var lang in languages) {
    await (async () => {
      console.log(languages[lang]);
      fs.writeFile(
        `${languages[lang]}.json`,
        JSON.stringify(await translate(languages[lang])),
        (e) => {
          if (e) throw e;
        }
      );
    })();
  }
})();
