window.onload = init;

// Global variables
var stepsComplete = 0;

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

function parseSteps(steps) {
  //Example steps object: "A,Sub-step item to do from object,RDP to ServerA|B,Sub-step item to do from object again,Open Citrix Studio|C,Sub-step item to do lastly,Open PVS Console;A,Sub-step item to do in 2,RDP to ServerB|B,Sub-step item to do in 2,RDP to Server|C,Sub-step item to do in 2,RDP to ServerD";
  var steps = steps.split(";");
  var numberOfSteps = steps.length;

  // Insert code to create a quantity of shell tables based on numberOfSteps

  // Insert code to fill in the shell tables
  for (var i = 0;i < steps.length; i++) { // This for loop processes each step
    var stepNumber = i+1;
    console.log("Step " + stepNumber);

    var substeps = steps[i].split("|");

    for (var j = 0; j < substeps.length; j++) { // This for loop processes each substep of each step
      var substepName = substeps[j].split(",")[0];
      var substepDetails = substeps[j].split(",")[1];
      var substepAction = substeps[j].split(",")[2];

      console.log("Sub-step # | Details | Action");
      console.log(substepName + " | " + substepDetails + " | " + substepAction);
    }

  }

}

function updateCompletionStatus() {
  var steps = 2;
  var substeps = 3;
  var totalSteps = steps * substeps;
  var percentComplete = (stepsComplete / totalSteps) * 100;
  if (stepsComplete == 0) { percentComplete = 5; } // Always keep at least 5% so the bar is visible.
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

function getManifest() {
  /*
  helper.get("api/manifest/"):
    Will return an array of manifest objects.
    Those objects can then be sorted through with a for() loop based on .length.
    Inside that for() object[i].parameter can be used.
  */
  helper.get("/api/manifest/")
    .then(function(data){
      var manifest = data;
      var manifestEntry = "";

      for (var i = 0; i < data.length; i++) {
        var nodesToDisplay = ["_id", "title", "author", "revision", "category", "product", "description", "outcome", "steps"];

        if (manifest[i]["_id"] == "5805252fe3c160dcd7e3990a") { // Need to make this dynamic from last page call
          for (var j = 0; j < nodesToDisplay.length; j++) {
            manifestEntry += manifest[i][nodesToDisplay[j]] + "~";
          }
        }

        console.log("ID: " + manifestEntry.split("~")[0]);

        var manifestTitle = manifestEntry.split("~")[1];
        console.log("Title: " + manifestTitle);
        $("#manifestTitle").html(manifestTitle);

        var manifestAuthor = manifestEntry.split("~")[2];
        console.log("Author: " + manifestAuthor);
        $("#manifestAuthor").html(manifestAuthor);

        var manifestRevision = manifestEntry.split("~")[3]
        console.log("Revision: " + manifestRevision);
        $("#manifestRevision").html(manifestRevision);

        var manifestCategory = manifestEntry.split("~")[4];
        console.log("Category: " + manifestCategory);
        $("#manifestCategory").html(manifestCategory);

        var manifestProduct = manifestEntry.split("~")[5]
        console.log("Product: " + manifestProduct);
        $("#manifestProduct").html(manifestProduct);

        var manifestDescription = manifestEntry.split("~")[6];
        console.log("Description: " + manifestDescription);
        $("#manifestDescription").html(manifestDescription);

        var manifestOutcome = manifestEntry.split("~")[7];
        console.log("Outcome: " + manifestOutcome);
        $("#manifestOutcome").html(manifestOutcome);

        var manifestSteps = manifestEntry.split("~")[8];
        parseSteps(manifestSteps);
        //console.log("Steps: " + manifestSteps);
        //$("#manifestSteps").html(manifestSteps);

      }
      //$('#manifestDetailsTable').trigger("update");
    });
}

function init () {
  currentTimestamp();

  // These should be calculated on the fly, but we'll set them statically for now
  var steps=2;
  var substeps=3;

  initiateSteps(steps, substeps);
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
  });
  $("#generateReport").click(function(){ window.print(); }); // Hook clicking Generate Completion Report button into printing the page
  getManifest();
  //parseSteps();
}
