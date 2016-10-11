window.onload = init;

function getDesktopsFromApi() {
  /*
  helper.get("api/desktop/"):
    Will return an array of desktop objects.
    Those objects can then be sorted through with a for() loop based on .length.
    Inside that for() object[i].parameter can be used.
  */
  helper.get("/api/desktop/")
    .then(function(data){
      var desktops = data;

      for (var i = 0; i < data.length; i++) {
        var nodesToDisplay = ["_id", "name", "user", "os", "status", "sessionState", "lastCommunication"];
        var rowToAdd = "<tr>";
        for (var j = 0; j < nodesToDisplay.length; j++) {
          if (nodesToDisplay[j] === "lastCommunication" && desktops[i][nodesToDisplay[j]] !== "Never") {
            rowToAdd += '<td><a href="/api/screenshot/' + desktops[i][nodesToDisplay[j]] + '">' + desktops[i][nodesToDisplay[j]] + '</a></td>';
          } else {
            rowToAdd += "<td>" + desktops[i][nodesToDisplay[j]] + "</td>";
          }
        }
        rowToAdd += "</tr>";
        $('#desktopDetailsTable tr:last').after(rowToAdd);
      }
      $('#desktopDetailsTable').trigger("update");
    });
}

function init () {
  $('#desktopDetailsTable').tablesorter();
  getDesktopsFromApi();

  $('#deleteButton').click(function() {
    var desktopId = $('input:text[name=delDesktop]').val();
    console.log("text: " + $('input:text[name=delDesktop]').val());
    helper.del("/api/desktop/" + desktopId);
    location.reload();
  });

  $('#patchButton').click(function() {

    var desktopId = $('input:text[name=patchId]').val();
    var name = $('input:text[name=patchName]').val();
    var user = $('input:text[name=patchUser]').val();
    var os = $('input:text[name=patchOs]').val();
    var status = $('input:text[name=patchStatus]').val();
    var sessionState = $('input:text[name=patchSessionState]').val();
    var lastCommunication = $('input:text[name=patchLastCommunication]').val();

    var desktopPatch = {};

    if (desktopId === "") {
      $('#warningPatch').html("Required")
      return;
    }
    if (name !== "") {
      desktopPatch["name"] = name;
    }
    if (user !== "") {
      desktopPatch["user"] = user;
    }
    if (os !== "") {
      desktopPatch["os"] = os;
    }
    if (status !== "") {
      desktopPatch["status"] = status;
    }
    if (sessionState !== "") {
      desktopPatch["sessionState"] = sessionState;
    }
    if (lastCommunication !== "") {
      desktopPatch["lastCommunication"] = lastCommunication;
    }

    helper.patch("/api/desktop/" + desktopId, desktopPatch)
    location.reload();
  });
}
