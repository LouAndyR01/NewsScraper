$(document).on("click", ".show-note", function() {

    $("#notes").empty();
var thisId = $(this).attr("data-id");

$.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
      //add the note information to the page
    .then(function(data) {
      console.log(data);

      //Show notes modal
      $("#results-modal").modal("toggle");

      //title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");

      //input to enter a new title
      $("#notes").append("<br><label for='titleinput'>Note Title</label><input class='form-control' id='titleinput' name='title' >");

      //to add a new note body
      $("#notes").append("<br><label for='bodyinput'>Note</label><textarea class='form-control' rows='5' id='bodyinput' name='body'></textarea>");