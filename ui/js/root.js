window.onload = init;

function drawCompHealth(canvas, context, items, total) {

  // Health Coloring is deprecating for now. In the meantime, just make it green.
  /*
  var health = 100;
  // Color code the fill based on health
  if (health > 70 && health < 100) { context.fillStyle = "#F28500"; }
  else if (health == 100) { context.fillStyle = "green"; }
  else { context.fillStyle = "red"; }
  */
  context.fillStyle = "green";

  // Get the items number in a percentage for filling amount.
  var fillAmount = 100 - ( (items/total) * 100 );

  /*
  fillRect = x, y, width, height
  Want to always start from the bottom (x=0)
  Want to fill in the progress out of total (y=progress)
  Want the width to always be the total of the square (canvas width)
  Want the height to always fill in (since going up, just make sure its >canvas height)
  */
  context.fillRect(0, fillAmount, 100, 100);

  // Write the percent in the middle
  context.fillStyle = "black";
  context.font = "30px Roboto";
  context.textAlign = "center";
  context.fillText(items, canvas.width/2, canvas.height/1.6);
}

// Check the API and update the Dashboard Item sent
function checkAPI (dashboardItem, key, value) {
  var availableDesktops = 0;

  var canvas = document.getElementById(dashboardItem);
  var context = canvas.getContext("2d");

  helper.get("/api/desktop/")
    .then(function(data) {
      var desktops = data;

      for (var i = 0; i < data.length; i++) {
        if (value.indexOf(",") == -1) {
          if (desktops[i][key] == value) { availableDesktops++; }
        } else {
          var values = value.split(",");
          for (var j = 0; j < values.length; j++) {
            if (desktops[i][key] == values[j]) { availableDesktops++; }
          }
        }
      }
      drawCompHealth(canvas, context, availableDesktops, desktops.length);

      $("#" + dashboardItem).click(function() {
        window.location = dashboardItem + ".html";
      });

    });
}

function initializeDashboard() {
  // Store all Component Health Dashboard items
  // Key is the object value we're looking for, and value is any value we're looking for.
  // Value can be multiple values, just put them in "item1,item2" format.
  var compDashList = ["desktopDetails", "activeSessions", "problemDesktops"];
  var compDashListKey = ["status", "sessionState", "status"];
  var compDashListValue = ["On,Off", "Connected", "Error"]

  // Check the API for each dashboard item.
  for (var i = 0; i < compDashList.length; i++) {
    checkAPI(compDashList[i], compDashListKey[i], compDashListValue[i]);
  }
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
  initializeDashboard();
}
