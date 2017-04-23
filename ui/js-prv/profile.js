window.onload = init;

function currentTimestamp() {
  var date = new Date();

  var timestamp = (date.getMonth()+1) + "/"
                + (date.getDate()) + "/"
                + date.getFullYear() + " @ "
                + date.getHours() + ":" +
                + date.getMinutes() + ":" +
                + date.getSeconds();
  return timestamp;
}

function init () {

  $('#footer').append("<br /> Current Time: " + currentTimestamp());

  $(document).ready(function(){ // Enable tooltips after all the steps are processed.

    $("#changePassword").click(function() {
      window.location.href='/change_password';
    });

    $("#logout").click(function() {
      window.location.href='/logout';
    });

    $('[data-toggle="tooltip"]').tooltip();

    helper.get("/api/getUserInfo")
      .then(function(data) {
        currentUser = data[0]["email"];
        $("#username").text(data[0]["email"]);
      });

  });
}
