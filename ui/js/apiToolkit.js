window.onload = init;

function getFlightplansFromApi() {
  /*
  helper.get("api/flightplan/"):
    Will return an array of flightplan objects.
    Those objects can then be sorted through with a for() loop based on .length.
    Inside that for() object[i].parameter can be used.
  */
  helper.get("/api/flightplan/")
    .then(function(data){
      var flightplan = data;

      for (var i = 0; i < data.length; i++) {
        var nodesToDisplay = ["_id", "title", "author", "revision", "category", "product", "description", "steps"];
        var rowToAdd = "<tr>";
        for (var j = 0; j < nodesToDisplay.length; j++) {
          if (nodesToDisplay[j] === "lastCommunication" && flightplan[i][nodesToDisplay[j]] !== "Never") {
            //rowToAdd += '<td><a href="/api/screenshot/' + flightplans[i][nodesToDisplay[j]] + '">' + flightplans[i][nodesToDisplay[j]] + '</a></td>';
          } else {
            rowToAdd += "<td>" + flightplan[i][nodesToDisplay[j]] + "</td>";
          }
        }
        rowToAdd += "</tr>";
        $('#flightplanDetailsTable tr:last').after(rowToAdd);
      }
      $('#flightplanDetailsTable').trigger("update");
    });
}

function init () {
  $('#flightplanDetailsTable').tablesorter();
  getFlightplansFromApi();

  $('#deleteButton').click(function() {
    var flightplanId = $('input:text[name=delFlightplan]').val();
    console.log("text: " + $('input:text[name=delFlightplan]').val());
    helper.del("/api/flightplan/" + flightplanId);
    location.reload();
  });

  $('#deleteInflightButton').click(function() {
    var inflightId = $('input:text[name=delInflight]').val();
    console.log("text: " + $('input:text[name=delInflight]').val());
    helper.del("/api/inflight/" + inflightId);
    location.reload();
  });

  $('#patchButton').click(function() {

    var flightplanId = $('input:text[name=patchId]').val();
    var title = $('input:text[name=patchTitle]').val();
    var author = $('input:text[name=patchAuthor]').val();
    var revision = $('input:text[name=patchRevision]').val();
    var category = $('input:text[name=patchCategory]').val();
    var product = $('input:text[name=patchProduct]').val();
    var description = $('input:text[name=patchDescription]').val();
    var steps = $('input:text[name=patchSteps]').val();

    var flightplanPatch = {};

    if (flightplanId === "") {
      $('#warningPatch').html("Required")
      return;
    }
    if (title !== "") {
      flightplanPatch["title"] = title;
    }
    if (author !== "") {
      flightplanPatch["author"] = author;
    }
    if (revision !== "") {
      flightplanPatch["revision"] = revision;
    }
    if (category !== "") {
      flightplanPatch["category"] = category;
    }
    if (product !== "") {
      flightplanPatch["product"] = product;
    }
    if (description !== "") {
      flightplanPatch["description"] = description;
    }
    if (steps !== "") {
      flightplanPatch["steps"] = steps;
    }

    helper.patch("/api/flightplan/" + flightplanId, flightplanPatch)
    location.reload();
  });
}
