const tr = require("googletrans").default;

class csv2csv {
    constructor(workbook, languages) {
        this.workbook = workbook
        this.languages = languages
        this.headers = []
        this.get_headers()
    }

    set_sheet(sheet_index) {
        var sheet_name = this.workbook.SheetNames[sheet_index];
        var sheet = this.workbook.Sheets[sheet_name];
        this.sheet_json = xlsx.utils.sheet_to_json(sheet)
        this.total_rows = this.sheet_json.length
        this.words2translate = []
        this.get_words_to_translate()

    }

    get_headers() {
        var range = xlsx.utils.decode_range(sheet['!ref']); // get the range
        for (var C = range.s.c; C <= range.e.c; ++C) {
            var cellref = xlsx.utils.encode_cell({
                c: C,
                r: 0
            });
            if (!sheet[cellref]) continue; // if cell doesn't exist, move on
            var cell = sheet[cellref];
            this.headers.push(cell.v);
        }
    }
    // get words in english
    get_words_to_translate() {
        for (const item of this.sheet_json) {
            this.words2translate.push(item["English"])
        }
    }

    get_total_sheets() {
        return this.workbook.SheetNames.length
    }

    async translate_language(language_index) {
        var lang = Object.keys(this.languages)[language_index]

        for (var z = 0; z < this.total_rows; z++) {

            var result = await tr([this.words2translate[z]], {
                from: "en",
                to: this.languages[lang],
            })

            this.sheet_json[z][lang] = 6
        }
    };


    async translate_sheet() {
        var total_languages = Object.keys(this.languages).length
        for (var i = 0; i < total_languages; i++) {
            try {
                await this.translate_language(i)
            } catch (e) {
                // too many requests
                console.log(e);
            }
        }
    }


    get_sheet_json() {
        return this.sheet_json
    }
    get_headers() {
        return this.headers
    }

}

module.exports = {
    csv2csv
}