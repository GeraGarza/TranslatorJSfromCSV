const tr = require("googletrans").default;
const data = require("./en.json");
const fs = require("fs");
if (typeof require !== 'undefined') xlsx = require('xlsx');
var workbook = xlsx.readFile('GreenRoom_Translations.xlsx')
const csv2csv = require('./csv2csv');


// https://py-googletrans.readthedocs.io/en/latest/  // list of langauges
// Need to match with excel ; don't need english
var languages = {
  Bahasa: "id",
  "Chinese (Traditional)": "zh-tw",
  "Chinese (Simplified)": "zh-cn",
  Japanese: "ja",
  Korean: "ko",
  Thai: "th",
  Vietnamese: 'vi'
};


/* _______________   JSON  --> XLSX    __________________________ */


function write_file(wss) {

  let wb = xlsx.utils.book_new()
  var total_sheets = greenroom.get_total_sheets()
  for (var i = 0; i < total_sheets; i++) {
    xlsx.utils.book_append_sheet(wb, wss[i], `sheet${i}`)
  }

  let exportFileName = `workbook.xls`;
  xlsx.writeFile(wb, exportFileName)
}

greenroom = new csv2csv.csv2csv(workbook, languages);
var wss = []

translate_sheet = async (sheet_index) => {
  greenroom.set_sheet(sheet_index)
  await greenroom.translate_sheet()
  wss.push(xlsx.utils.json_to_sheet(greenroom.get_sheet_json(), {
    header: greenroom.get_headers()
  }))
}


translate_sheets = async () => {
  var total_sheets = greenroom.get_total_sheets()
  for (var sheet = 0; sheet < total_sheets; sheet++) {
    await translate_sheet(sheet);
    console.log("Done.")
  }
};


write_sheets = async () => {
  await translate_sheets()
  write_file(wss)

};

write_sheets()




// /* _______________   JSON  --> JSON    __________________________ */

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
    `${languages[lang]}.json`,
    JSON.stringify(await translate(languages[lang])),
    (e) => {
      if (e) throw e;
    }
  );
};

translate_languages = async () => {
  for (var lang in languages) {
    try {
      await writeToFile(lang);
    } catch (e) {
      // too many requests
      console.log(e);
    }
  }
};


translate_languages();

