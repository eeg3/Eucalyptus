window.onload = init;

// Global variables
var stepsComplete = 0;

/*
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
*/

/*
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
*/

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

function initiateSteps(steps, substeps) {
  // The following for section makes it so checkboxes are enabled or disabled if the previous checkbox is checked or unchecked

  // Take action per step
  for (var i = 1; i<steps+1; i++) {

    // Take action per substep
    for (var j = 1; j<substeps+1; j++) {

      // Set checkbox names for current and next item
      var checkboxA = "status-" + i + "-" + j;
      var checkboxB = "status-" + i + "-" + (j*1 + 1);
      var row = "row-substep-" + i + "-" + j;

      // White out everything except the first row at page open.
      if ((i == 1) && (j == 1)) { } else {
        $("#" + row).css("color", "white");
      }

      // Setting checkboxA's onclick to modify checkboxB's enabled/disabled status
      $("input#" + checkboxA).click(function(){
        checkboxA = this.id;
        checkboxB = this.id.split("-")[0] + "-" + this.id.split("-")[1] + "-" + (this.id.split("-")[2]*1 + 1);
        nextRow = "row-substep-" + checkboxB.split("-")[1] + "-" + checkboxB.split("-")[2];

        // If checkboxB's length is 0 then time to modify next step's substep instead of a non-existing substep in this current step
        if (!($("#" + checkboxB).length)) {
          checkboxB = this.id.split("-")[0] + "-" + (this.id.split("-")[1]*1 +1) + "-" + 1;
          nextRow = "row-substep-" + checkboxB.split("-")[1] + "-1";
        }

        // If checkboxA is checked, then enable the next checkbox; if it isn't, then disable the next checkbox
        if(this.checked) {
          $("input#" + checkboxB).prop("disabled", false);
          stepsComplete++;
          updateCompletionStatus();
          $("#" + nextRow).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
        } else {
          // If trying to uncheck a checkbox way up the chain where others are checked, don't allow it
          try { // Perform a try otherwise the last checkbox will break when trying to un-check it
            nextItem = document.getElementById(checkboxB).checked;
          } catch(err) {
            nextItem = 0;
          }
          if (nextItem) {
            $("input#" + checkboxA).prop("checked", true);
          } else {
            $("input#" + checkboxB).prop("disabled", true);
            $("#" + nextRow).css("color", "white"); // Hide next sub-step until this sub-step is complete.
            stepsComplete--;
            updateCompletionStatus();
          }
        }

      });
    } // End action per substep

  } // End action per step
}

function updateCompletionStatus() {
  var steps = 2;
  var substeps = 3;
  var totalSteps = steps * substeps;
  var percentComplete = (stepsComplete / totalSteps) * 100;
  if (stepsComplete == 0) { percentComplete = 1; } // Always keep at least 1% so the bar is visible.
  $("#completionStatus").css("width", percentComplete + '%');
}

/*
// Sample of how we could export the manifest for printing
function exportManifest() {
    console.log($("td#substep-1-1").html());
    console.log($("td#details-1-1").html());
    console.log($("td#action-1-1").html());
    console.log($("input#notes-1-1").val());
}
*/

function init () {
  currentTimestamp();

  // These should be calculated on the fly, but we'll set them statically for now
  var steps=2;
  var substeps=3;

  initiateSteps(steps, substeps);

  $("#generateReport").click(function(){ window.print(); }); // Hook clicking Generate Completion Report button into printing the page
}
