const util = require("util");
const fs = require("fs");
​
// package will be used to generate our unique ids. https://www.npmjs.com/package/uuid
const uuidv1 = require("uuid/v1");
const { parse } = require("path");
​
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
​
class Store {
  read() {
    return readFileAsync("db/db.json", "utf8");
  }
​
  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }
​
  getNotes() {
    return this.read().then((notes) => {
       // here you will write a function that uses the above read function and parses the notes from the file 
      let parsedNotes;
      try {
        parsedNotes =[].concat(JSON.parse(notes));
      // If notes isn't an array or can't be turned into one, send back a new empty array
      } catch (err) {
        parsedNotes = [];
      }
      return parsedNotes;
    })
  }
​
  addNote(note) {
    // set up variables with our notes data here
​   const { title, text } = note;
​
    // Error handle here, if we have no title or text added throw a new error explaining what is wrong
    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }
​
    // Add a unique id to the note using uuid package
    const newNote = { title, text, id: ++this.lastId }
​
    // Get all notes, add the new note, write all the updated notes, return the newNote
    return this.getNotes()
    .then(notes => [...notes, newNote])
    .then(updatedNotes => this.write(updatedNotes))
    .then(() => newNote);
  }
​
  removeNote(id) {
    // Get all notes, remove the note with the given id, write the filtered notes
    return this.getNotes()
    // filter out the notes we do want 
    .then(notes => notes.filter(note => note.id !== parseInt(id)))
    // write out the notes that we do want
    .then(filteredNotes => this.write(filteredNotes));
  }
}
​
module.exports = new Store();