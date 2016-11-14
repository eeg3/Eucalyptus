window.onload = init;


function init () {

  $("#loginButton").click(function() {
    if ($("#username").val() == "earl") {
      if ($("#password").val() == "earl") {
        window.location = "index.html";
      }
    } else {
      $("#loginError").html("Invalid login. Please try again.");
      $("#loginError").css("color", "red");
    }
  });

  $("#username").on('input', function() {
    $("#loginError").css("color", "white");
    $("#loginError").html("Please login.");
  });
  $("#password").on('input', function() {
    $("#loginError").css("color", "white");
    $("#loginError").html("Please login.");
  });

  $(document).ready(function() {

  });
}
