if (typeof require !== "undefined") xlsx = require("xlsx");
const FileSystem = require("fs");

var object_data = {
    "Constant": [],
    "English": [],
    "Chinese (Traditional)": [],
    "Chinese (Simplified)": [],
    "Japanese": [],
    "Korean": [],
    "Thai": [],
    "Vietnamese": [],
    "Indonesian": []
}

var json_builders = {
    "English": "",
    "Chinese (Traditional)": "",
    "Chinese (Simplified)": "",
    "Japanese": "",
    "Korean": "",
    "Thai": "",
    "Vietnamese": "",
    "Indonesian": ""
}


var jsons = {
    "English": "",
    "Chinese (Traditional)": "",
    "Chinese (Simplified)": "",
    "Japanese": "",
    "Korean": "",
    "Thai": "",
    "Vietnamese": "",
    "Indonesian": ""
}


translate_csv = (workbook, languages) => {
    //workbook = xlsx.readFile(filename_template);
    var total_sheets = workbook.SheetNames.length;
    // sheets
    for (var sheet = 0; sheet < total_sheets; sheet++) {
        var sheet_name = workbook.SheetNames[sheet];
        var i_sheet = workbook.Sheets[sheet_name];
        sheet_json = xlsx.utils.sheet_to_json(i_sheet);

        //object
        for (var key of Object.keys(sheet_json)) {
            // languages
            for (var lang of Object.keys(sheet_json[key])) {
                var langage_list = object_data[lang]
                if (langage_list) {
                    var value = sheet_json[key][lang]
                    var replaced = value.toString().replace(/"/g, "'")
                    langage_list.push(replaced)
                    object_data[lang] = langage_list
                }
            }
        }


        for (var lang of Object.keys(object_data)) {
            if (lang == "Constant") continue
            json_string_lang = `"${sheet_name}":{`
            for (var i of Object.keys(object_data[lang])) {
                json_string_lang += `"${object_data["Constant"][i]}":"${object_data[lang][i]}",`
            }
            json_string_lang = json_string_lang.slice(0, -1)
            json_string_lang += "},"
            json_builders[lang] = json_builders[lang] + json_string_lang
            object_data[lang] = []
        }

    }

    for (var lang of Object.keys(object_data)) {
        if (lang == "Constant") continue
        json_builders[lang] = "{ " + json_builders[lang].slice(0, -1) + "}"

        var filename = languages[lang];
        if(!filename) filename = "en"
        
        FileSystem.writeFile(`converted_jsons/${filename}.json`, json_builders[lang], (err) => {
            if (err) throw err;
        });
    }

    return jsons

};

module.exports = {
    translate_csv,
};