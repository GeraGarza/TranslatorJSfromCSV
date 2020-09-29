const tr = require("googletrans").default;
if (typeof require !== "undefined") xlsx = require("xlsx");

class csv2csv {
  constructor(workbook, languages) {
    this.workbook = workbook;
    this.languages = languages;
    this.headers = [];
    this.wss = [];
  }

  set_sheet(sheet_index) {
    this.set_headers(sheet_index);

    this.total_rows = this.sheet_json.length;
    this.words2translate = [];

    this.get_words_to_translate();
  }

  set_headers(sheet_index) {
    var sheet_name = this.workbook.SheetNames[sheet_index];
    var sheet = this.workbook.Sheets[sheet_name];
    this.sheet_json = xlsx.utils.sheet_to_json(sheet);

    var range = xlsx.utils.decode_range(sheet["!ref"]); // get the range
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var cellref = xlsx.utils.encode_cell({
        c: C,
        r: 0,
      });
      if (!sheet[cellref]) continue; // if cell doesn't exist, move on
      var cell = sheet[cellref];
      this.headers.push(cell.v);
    }
  }
  // get words in english
  get_words_to_translate() {
    for (const item of this.sheet_json) {
      this.words2translate.push(item["English"]);
    }
  }

  async translate_language(language_index) {
    var lang = Object.keys(this.languages)[language_index];

    for (var z = 0; z < this.total_rows; z++) {
      // var result = await tr([this.words2translate[z]], {
      //   from: "en",
      //   to: this.languages[lang],
      // });

      this.sheet_json[z][lang] = 6; //result.text
    }
  }

  async translate_sheet(sheet_index) {
    this.set_sheet(sheet_index);
    var total_languages = Object.keys(this.languages).length;
    for (var i = 0; i < total_languages; i++) {
      try {
        await this.translate_language(i);
      } catch (e) {
        console.log(e); // too many requests
      }
    }
  }

  async translate_sheets() {
    var total_sheets = this.workbook.SheetNames.length;
    for (var sheet = 0; sheet < total_sheets; sheet++) {
      await this.translate_sheet(sheet);
      this.wss.push(
        xlsx.utils.json_to_sheet(this.sheet_json, {
          header: this.headers,
        })
      );
      console.log("Done.");
    }
  }

  async write_sheets() {
    await this.translate_sheets();
    this.write_file();
  }

  write_file() {
    let wb = xlsx.utils.book_new();
    var total_sheets = this.workbook.SheetNames.length;
    for (var i = 0; i < total_sheets; i++) {
      xlsx.utils.book_append_sheet(
        wb,
        this.wss[i],
        this.workbook.SheetNames[i]
      );
    }
    let exportFileName = `workbook.xls`;
    xlsx.writeFile(wb, exportFileName);
  }
}

module.exports = {
  csv2csv,
};
