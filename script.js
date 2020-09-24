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
  // Deep copy
  let data_copy = JSON.parse(JSON.stringify(data));

  for (const property in data) {
    for (const index in data[property]) {
      var words_to_translate = data[property][index];
      var result = await tr([words_to_translate], {
        from: "en",
        to: lang,
      });
      data_copy[property][index] = result.text;
    }
  }

  return data_copy;
}

writeToFile = async (lang) => {
  console.log(languages[lang]);
  fs.writeFile(
    `${languages[lang]}.json`,
    JSON.stringify(await translate(languages[lang])),
    (e) => {
      if (e) throw e;
    }
  );
};

// waits for each language to be completed
(async () => {
  for (var lang in languages) {
    //   waits for request to be completed
    try {
      await writeToFile(lang)
    } catch (e) {
      // too many requests
      console.log(e)
    }
  }
})();