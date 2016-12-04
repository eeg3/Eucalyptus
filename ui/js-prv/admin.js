window.onload = init;

var showSteps = false;

function getUsers() {
  /*
  helper.get("api/flightplan/"):
    Will return an array of flightplan objects.
    Those objects can then be sorted through with a for() loop based on .length.
    Inside that for() object[i].parameter can be used.
  */
  helper.get("/users/")
    .then(function(data){
      var users = data;

      for (var i = 0; i < data.length; i++) {
        var rowToAdd = "<tr>";
        rowToAdd += "<td>" + users[i]["_id"] + "</td>";
        rowToAdd += "<td>" + users[i]["local"]["name"] + "</td>";
        rowToAdd += "<td>" + users[i]["local"]["email"] + "</td>";
        rowToAdd += "<td>" + users[i]["local"]["enabled"] + "</td>";
        rowToAdd += "<td>" + users[i]["local"]["walkthroughDashboard"] + "</td>";
        rowToAdd += '<td><button id="enable-' + users[i]["_id"] + '" type="button" title="Enable" class="btn btn-success btn-xs enableAcct"><i class="fa fa-check"></i></button>&nbsp;&nbsp;<button id="disable-' + users[i]["_id"] + '" type="button" title="Disable" class="btn btn-warning btn-xs disableAcct"><i class="fa fa-ban"></i></button>&nbsp;&nbsp;<button id="delete-' + users[i]["_id"] + '" type="button" title="Delete" class="btn btn-danger btn-xs deleteAcct"><i class="fa fa-remove"></i></button></td>'
        rowToAdd += "</tr>";
        $('#userDetailsTable tr:last').after(rowToAdd);
      }
      $('#userDetailsTable').trigger("update");

      $('.enableAcct').click(function() {
        var userId = this.id.split("-")[1];
        var userPatch = {};
        userPatch["enabled"] = true;
        helper.patch("/users/" + userId, userPatch);
        location.reload();
      });

      $('.disableAcct').click(function() {
        var userId = this.id.split("-")[1];
        var userPatch = {};
        userPatch["enabled"] = false;
        helper.patch("/users/" + userId, userPatch);
        location.reload();
      });

      $('.deleteAcct').click(function() {
        var userId = this.id.split("-")[1];
        helper.del("/users/" + userId);
        location.reload();
      });

    });
}

function currentTimestamp() {
  var date = new Date();
  var timestamp = (date.getMonth()+1) + "/"
                + (date.getDate()) + "/"
                + date.getFullYear() + " @ "
                + date.getHours() + ":" +
                + date.getMinutes() + ":" +
                + date.getSeconds();
  $('#footer').append("<br /> Current Time: " + timestamp);
}

function init () {
  currentTimestamp();

  getUsers();

  $('#patchButton').click(function() {

    var userId = $('input:text[name=patchId]').val();
    var userName = $('input:text[name=patchName]').val();
    var userEnabled = $('input:text[name=patchEnabled]').val();
    var userEmail = $('input:text[name=patchEmail]').val();
    var userPassword = $('input:text[name=patchPassword]').val();
    var walkthrough = $('input:text[name=patchWalkthrough]').val();

    var userPatch = {};

    if (userId === "") {
      $('#warningPatch').html("Required")
      return;
    }

    if (userName !== "") {
      userPatch["name"] = userName;
    }

    if (userEmail !== "") {
      userPatch["email"] = userEmail;
    }

    if (userPassword !== "") {
      userPatch["password"] = userPassword;
    }

    if (walkthrough == "true") {
      userPatch["walkthroughDashboard"] = true;
    } else if (walkthrough == "false") {
      userPatch["walkthroughDashboard"] = false;
    }

    if (userEnabled == "true") {
      userPatch["enabled"] = true;
    } else if (userEnabled == "false") {
      userPatch["enabled"] = false;
    }

    helper.patch("/users/" + userId, userPatch);
    location.reload();
  });

  $('#deleteButton').click(function() {
    var userId = $('input:text[name=delUser]').val();
    helper.del("/users/" + userId);
    location.reload();
  });

  $(document).ready(function(){ // Enable tooltips after all the steps are processed.

    helper.get("/api/getUserInfo")
      .then(function(data) {
        $("#username").text(data[0]["name"]);
      });

  });
}
