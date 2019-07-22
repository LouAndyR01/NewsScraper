$(document).on("click", ".show-note", function() {

    $("#notes").empty();
var thisId = $(this).attr("data-id");

$.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
        //add the note information to the page //
    .then(function(data) {
      console.log(data);

        //Show notes modal //
      $("#note-modal").modal("toggle");

         //title of the article //
      $("#notes").append("<h2>" + data.title + "</h2>");

        //input to enter a new title //
      $("#notes").append("<br><label for='titleinput'>Note Title</label><input class='form-control' id='titleinput' name='title' >");

         //to add a new note body //
      $("#notes").append("<br><label for='bodyinput'>Note</label><textarea class='form-control' rows='5' id='bodyinput' name='body'></textarea>");

      if (data.note) {
        //note in the title input //
        $("#titleinput").val(data.note.title);
        //note in the body textarea //
        $("#bodyinput").val(data.note.body);
      }
    });
});

        //onclick to save note //
$("#savenote").on("click", function() {
    var thisId = $(this).attr("data-id");
        console.log(thisId);
    $("#note-modal").modal("toggle");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
        }
      })
    
        .then(function(data) {
          console.log(data);

    $("#notes").empty();
        });
    
    $("#titleinput").val("");
    $("#bodyinput").val("");
    });
    
    $(".save-article").on("click", function(event) {
      var id = $(this).attr("data-id");
      console.log(id);
      
        
      $.ajax("/saved/" + id, {
        type: "PUT",
       
      }).then(
        function() {
             //reload the page to get the updated list //
          location.reload();
          alert("Article saved!");
        }
      );
    });
    
            //on-click event deleting an article from the db //
    $(".delete-article").on("click", function(event) {
      var id = $(this).attr("data-id");
      console.log("deleted article", id);
      // Send the DELETE request.
      $.ajax("/delete/" + id, {
        type: "DELETE",
      }).then(
        function() {
          
          // Reload the page to get the updated list //
          location.reload();
          alert("Article deleted.");
        }
      );
    });