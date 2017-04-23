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

    $("#inviteUser").click(function() {
      if ($("#email").val() != "") {
        window.location.href='/api/user/invite/' + $("#email").val();
      }
    });

    $('[data-toggle="tooltip"]').tooltip();

    helper.get("/api/user/")
      .then(function(data) {
        currentUser = data[0]["email"];
        $("#username").text(data[0]["email"]);
      });

  });
}
