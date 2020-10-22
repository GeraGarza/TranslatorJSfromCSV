const tr = require("googletrans").default;
const fs = require("fs");

data = [];
languages = [];

translate = async (lang = "en") => {
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
};

writeToFile = async (lang) => {
  console.log(languages[lang]);
  fs.writeFile(
    `./lang_json/${languages[lang]}.json`,
    JSON.stringify(await translate(languages[lang])),
    (e) => {
      if (e) throw e;
    }
  );
};

translate_jsons = async (_data, _languages) => {
  data = _data;
  languages = _languages;
  for (var lang in languages) {
    try {
      await writeToFile(lang);
    } catch (e) {
      // too many requests
      console.log(e);
    }
  }
};

module.exports = {
  translate_jsons,
};
