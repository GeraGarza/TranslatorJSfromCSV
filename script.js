const data = require("./en.json");
if (typeof require !== "undefined") xlsx = require("xlsx");
var workbook = xlsx.readFile("GreenRoom_Translations.xlsx");
const csv2csv = require("./csv2csv");
const json2json = require("./json2json");

// https://py-googletrans.readthedocs.io/en/latest/  // list of langauges
// Need to match with excel ; don't need english
var languages = {
  Bahasa: "id",
  "Chinese (Traditional)": "zh-tw",
  "Chinese (Simplified)": "zh-cn",
  Japanese: "ja",
  Korean: "ko",
  Thai: "th",
  Vietnamese: "vi",
};

/* _______________   XLSX  --> XLSX    __________________________ */

greenroom = new csv2csv.csv2csv(workbook, languages);
// greenroom.write_sheets();

// /* _______________   JSON  --> JSON    __________________________ */

// translate_languages();
json2json.translate_jsons(data, languages);
