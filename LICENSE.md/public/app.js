$(document).ready(function() {
  $(document).ajaxStart(function() {
    $("#wait").css("display", "block");
  });
  $(document).ajaxComplete(function(event, xhr, settings) {
    if (settings.url === "/scrape") {
      setTimeout(function() {
        $("#wait").css("display", "none");
      }, 5000);
    } else {
      $("#wait").css("display", "none");
    }
  });
  $("button").click(function() {
    $("#txt").load("demo_ajax_load.asp");
  });

  $(document).on("click", "#scraper", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function() {
      console.log("Loading...");
    });
  });

  $(document).on("click", "#showArticles", function() {
    // Grab the articles as a json
    $.getJSON("/articles", function(data) {
      console.log("Getting articles:", data);
      $("#articles").empty();
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append(
          "<p data-id='" +
            data[i]._id +
            "'>" +
            "TITLE: " +
            data[i].title +
            "<br />" +
            "SUMMARY: " +
            data[i].summary +
            "<br />" +
            "LINK: " +
            data[i].link +
            "</p>"
        );
      }
    });
  });

  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // A textarea to add a new note body
        $("#notes").append(
          "<br/><p>Add Comment</p><br/><textarea id='bodyinput' name='body'></textarea>"
        );
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append(
          "<button data-id='" +
            data._id +
            "' id='savenote'>Save Comment</button>"
        );
        $("#notes").append("<h3>Comments</h3>");
        $("#notes").append("<p id='comments'></p>");

        // If there's a note in the article
        if (data.note) {
          console.log("COMMENT:", data.note);
          // Place the body of the note in the body textarea
          console.log("BODY: ", data.note.body);
          $("#comments").append(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
});
