window.onload = init;

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

  $('#changePassword').click(function() {
    helper.get("/api/getUserInfo")
      .then(function(data) {
        var userId = data[0]["id"];
        var userPatch = {};
        userPatch["password"] = $('input:password[name=patchPassword]').val();
        console.log("password: " + $('input:password[name=patchPassword]').val())
        console.log("user id: " + userId);
        if (userId !== "" && userPatch["password"] !== "") {
          helper.patch("/users/" + userId, userPatch);
          location.reload();
        }
      });
  });

    $(document).ready(function(){ // Enable tooltips after all the steps are processed.

      helper.get("/api/getUserInfo")
        .then(function(data) {
          $("#username").text(data[0]["username"]);
        });

    });
}
