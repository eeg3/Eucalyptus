window.onload = init;

function getManifestsFromApi() {
  /*
  helper.get("api/manifest/"):
    Will return an array of manifest objects.
    Those objects can then be sorted through with a for() loop based on .length.
    Inside that for() object[i].parameter can be used.
  */
  helper.get("/api/manifest/")
    .then(function(data){
      var manifest = data;

      for (var i = 0; i < data.length; i++) {
        var nodesToDisplay = ["_id", "title", "author", "revision", "category", "product", "description", "outcome", "steps"];
        var rowToAdd = "<tr>";
        for (var j = 0; j < nodesToDisplay.length; j++) {
          if (nodesToDisplay[j] === "lastCommunication" && manifest[i][nodesToDisplay[j]] !== "Never") {
            //rowToAdd += '<td><a href="/api/screenshot/' + manifests[i][nodesToDisplay[j]] + '">' + manifests[i][nodesToDisplay[j]] + '</a></td>';
          } else {
            rowToAdd += "<td>" + manifest[i][nodesToDisplay[j]] + "</td>";
          }
        }
        rowToAdd += "</tr>";
        $('#manifestDetailsTable tr:last').after(rowToAdd);
      }
      $('#manifestDetailsTable').trigger("update");
    });
}

function init () {
  $('#manifestDetailsTable').tablesorter();
  getManifestsFromApi();

  $('#deleteButton').click(function() {
    var manifestId = $('input:text[name=delManifest]').val();
    console.log("text: " + $('input:text[name=delManifest]').val());
    helper.del("/api/manifest/" + manifestId);
    location.reload();
  });

  $('#patchButton').click(function() {

    var manifestId = $('input:text[name=patchId]').val();
    var title = $('input:text[name=patchTitle]').val();
    var author = $('input:text[name=patchAuthor]').val();
    var revision = $('input:text[name=patchRevision]').val();
    var category = $('input:text[name=patchCategory]').val();
    var product = $('input:text[name=patchProduct]').val();
    var description = $('input:text[name=patchDescription]').val();
    var outcome = $('input:text[name=patchOutcome]').val();
    var steps = $('input:text[name=patchSteps]').val();

    var manifestPatch = {};

    if (manifestId === "") {
      $('#warningPatch').html("Required")
      return;
    }
    if (title !== "") {
      manifestPatch["title"] = title;
    }
    if (author !== "") {
      manifestPatch["author"] = author;
    }
    if (revision !== "") {
      manifestPatch["revision"] = revision;
    }
    if (category !== "") {
      manifestPatch["category"] = category;
    }
    if (product !== "") {
      manifestPatch["product"] = product;
    }
    if (description !== "") {
      manifestPatch["description"] = description;
    }
    if (outcome !== "") {
      manifestPatch["outcome"] = outcome;
    }
    if (steps !== "") {
      manifestPatch["steps"] = steps;
    }

    helper.patch("/api/manifest/" + manifestId, manifestPatch)
    location.reload();
  });
}
