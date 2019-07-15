var mongoose = require("mongoose");

var Schema = mongoose.Schema;

    //new note schema object //
var NoteSchema = new Schema ({
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

    //exports the note model //
module.exports = Note;

