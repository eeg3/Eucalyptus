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

    $(document).ready(function(){ // Enable tooltips after all the steps are processed.

      helper.get("/api/getUserInfo")
        .then(function(data) {
          $("#username").text(data[0]["username"]);
        });

    });
}
