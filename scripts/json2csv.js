const data = require("../en.json");
if (typeof require !== "undefined") xlsx = require("xlsx");
var header = ["Constant", "English", "Chinese (Traditional)", "Chinese (Simplified)", "Japanese", "Korean", "Thai", "Vietnamese", "Indonesian"]

translate_jsons = (data, filename = "GreenRoom_Translations_English.xls") => {


    var wb = xlsx.utils.book_new();


    for (var pageKey of Object.keys(data)) {
        console.log(pageKey + " -> " + data[key])

        var page = data[pageKey]
        var page_json = []
        for (var key of Object.keys(page)) {
            page_json.push({
                "Constant": key,
                "English": page[key]
            })
        }

        var ws = xlsx.utils.json_to_sheet(page_json, {
            header: header
        });

        xlsx.utils.book_append_sheet(wb, ws, pageKey);

    }

    xlsx.writeFile(wb, filename);

};


module.exports = {
    translate_jsons,
};