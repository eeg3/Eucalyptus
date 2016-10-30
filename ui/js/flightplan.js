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

function initiateStepFlow(steps, substeps) {
  // The following for section makes it so checkboxes are enabled or disabled if the previous checkbox is checked or unchecked

  // Take action per step
  for (var i = 1; i<steps+1; i++) {

    // Take action per substep
    for (var j = 1; j<substeps+1; j++) {

      // Set checkbox names for current and next item
      var checkboxA = "status-substep-" + i + "-" + j;
      var checkboxB = "status-substep-" + i + "-" + (j*1 + 1);
      var row = "row-substep-" + i + "-" + j;

      // White out everything except the first row at page open.
      if ((i == 1) && (j == 1)) { } else {
        $("#" + row).css("color", "white");
      }

      // Setting checkboxA's onclick to modify checkboxB's enabled/disabled status
      $("input#" + checkboxA).click(function(){
        checkboxA = this.id;
        checkboxB = this.id.split("-")[0] + "-" + this.id.split("-")[1] + "-" + this.id.split("-")[2] + "-" + (this.id.split("-")[3]*1 + 1);
        nextRow = "row-substep-" + checkboxB.split("-")[2] + "-" + checkboxB.split("-")[3];

        // If checkboxB's length is 0 then time to modify next step's substep instead of a non-existing substep in this current step

        if (!($("#" + checkboxB).length)) {
          checkboxB = this.id.split("-")[0] + "-" + this.id.split("-")[1] + "-" + (this.id.split("-")[2]*1 +1) + "-" + 1;
          nextRow = "row-substep-" + checkboxB.split("-")[2] + "-1";
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


  // Insert code to fill in the shell tables
  for (var i = 0;i < steps.length; i++) { // This for loop processes each step
    var stepNumber = i+1;

    var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step ' + stepNumber + ' <button id="launch-' + stepNumber + '" type="button" class="btn btn-success btn-xs launchButton">Launch</button></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';

    $("#stepsSection").append(newDivHTML);

    /* Add Launchers */
    // What else could we launch?
      // * Documentation
      // * KB Articles
      // * Management Consoles
      // * VM Consoles
      // * Remote Desktop
      // * Virtual Desktops
      // * Virtual Apps
      // * Ticketing Sites

    if(stepNumber == 1) {
      $("#launch-" + stepNumber).click(function() {
        //alert("yo from: " + this.id);
        var strWindowFeatures = "location=no,height=800,width=1050,scrollbars=no,status=no,resizable=no";
        //var strWindowFeatures = "";
        var URL = "https://vcsa01.eeg3.lab:9443/vsphere-client/webconsole.html?vmId=vm-1317&vmName=wem01&serverGuid=da13ce2d-f990-496c-80ff-feefbd52b7fe&locale=en_US&host=vcsa01.eeg3.lab:443&sessionTicket=cst-VCT-52111846-5c67-3af9-5929-303d0a1b30ac--tp-85-37-0D-31-36-77-C7-54-46-E8-D2-E7-C3-B0-FB-1A-6F-90-FC-49&thumbprint=85:37:0D:31:36:77:C7:54:46:E8:D2:E7:C3:B0:FB:1A:6F:90:FC:49";
        var win = window.open(URL, "_blank", strWindowFeatures);
      });
    } else {
      $("#launch-" + stepNumber).click(function() {
        //alert("yo from: " + this.id);
        var strWindowFeatures = "location=no,height=800,width=1050,scrollbars=no,status=no,resizable=no";
        //var strWindowFeatures = "";
        var URL = "https://vcs01.eeg3.lab/admin";
        var win = window.open(URL, "_blank", strWindowFeatures);
      });
    }


    var substeps = steps[i].split("|");


    var table = $('<table></table>').addClass('table table-bordered table-striped sp-databox-table');;
    var head = $('<thead><tr><td>Sub-Step</td><td>Details</td><td>Action</td><td>Notes&nbsp;<span data-toggle="tooltip" data-placement="top" title="Enter notes here to keep track of what you actually did."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></td><td>Status</td></tr></thead>');
    var body = $('<tbody>');
    table.append(head);
    table.append(body);

    for (var j = 0; j < substeps.length; j++) { // This for loop processes each substep of each step
      var substepNumber = j+1;
      var substepName = substeps[j].split(",")[0];
      var substepDetails = substeps[j].split(",")[1];
      var substepAction = substeps[j].split(",")[2];
      var substepCode = "substep-" + stepNumber + "-" + substepNumber; // Example: substep-2-1

      var tableLineItem = '<tr id="row-' + substepCode + '">';
      tableLineItem += '<td id="' + substepCode + '" class="st-substep-col">' + substepName + '</td>';
      tableLineItem += '<td id="details-' + substepCode + '" class="st-details-col">' + substepDetails + '</td>';
      tableLineItem += '<td id="action-' + substepCode + '" class="st-action-col">' + substepAction + '</td>';
      tableLineItem += '<td><input type="text" id="notes-' + substepCode + '" class="form-control input-sm" placeholder="Notes" /></td>';
      //tableLineItem += '<td><textarea" id="notes-' + substepCode + '" class="form-control input-sm" placeholder="Notes" /></td>';
      if (i == 0 && j == 0) {
        tableLineItem += '<td><input type="checkbox" id="status-' + substepCode + '"></td>';
      } else {
        tableLineItem += '<td><input type="checkbox" id="status-' + substepCode + '" disabled></td>';
      }
      tableLineItem += '</tr>';

      table.append(tableLineItem);

  //    console.log("Step Number: " + stepNumber);
  //    console.log("Substep-Number: " + substepNumber);
  //    console.log("Sub-step # | Details | Action");
  //    console.log(substepName + " | " + substepDetails + " | " + substepAction);

    }

    var tableEnd = $('</tbody>');
    table.append(tableEnd);

    $("#" + stepNumber).append(table);

  }

}

function updateCompletionStatus() {
  var stepCount = findTotalStepQuantity();
  var percentComplete = (stepsComplete / stepCount.substeps) * 100;
  if (stepsComplete == 0) { percentComplete = 5; } // Always keep at least 5% so the bar is visible.
  $("#completionStatus").css("width", percentComplete + '%');
}

/*
// Sample of how we could export the flightplan for printing
function exportFlightplan() {
    console.log($("td#substep-1-1").html());
    console.log($("td#details-1-1").html());
    console.log($("td#action-1-1").html());
    console.log($("input#notes-1-1").val());
}
*/

function getFlightplan() {
  /*
  helper.get("api/flightplan/"):
    Will return an array of flightplan objects.
    Those objects can then be sorted through with a for() loop based on .length.
    Inside that for() object[i].parameter can be used.
  */
  helper.get("/api/flightplan/")
    .then(function(data){
      var flightplan = data;
      var flightplanEntry = "";

      var passedId = urlParam('id');
      console.log("passedId: " + passedId);

      for (var i = 0; i < data.length; i++) {
        var nodesToDisplay = ["_id", "title", "author", "revision", "category", "product", "description", "outcome", "steps"];

        if (flightplan[i]["_id"] == passedId) { // Need to make this dynamic from last page call
          for (var j = 0; j < nodesToDisplay.length; j++) {
            flightplanEntry += flightplan[i][nodesToDisplay[j]] + "~";
          }

          console.log("ID: " + flightplanEntry.split("~")[0]);

          var flightplanTitle = flightplanEntry.split("~")[1];
          console.log("Title: " + flightplanTitle);
          $("#flightplanTitle").html(flightplanTitle);

          var flightplanAuthor = flightplanEntry.split("~")[2];
          console.log("Author: " + flightplanAuthor);
          $("#flightplanAuthor").html(flightplanAuthor);

          var flightplanRevision = flightplanEntry.split("~")[3]
          console.log("Revision: " + flightplanRevision);
          $("#flightplanRevision").html(flightplanRevision);

          var flightplanCategory = flightplanEntry.split("~")[4];
          console.log("Category: " + flightplanCategory);
          $("#flightplanCategory").html(flightplanCategory);

          var flightplanProduct = flightplanEntry.split("~")[5]
          console.log("Product: " + flightplanProduct);
          $("#flightplanProduct").html(flightplanProduct);

          var flightplanDescription = flightplanEntry.split("~")[6];
          console.log("Description: " + flightplanDescription);
          $("#flightplanDescription").html(flightplanDescription);

          var flightplanOutcome = flightplanEntry.split("~")[7];
          console.log("Outcome: " + flightplanOutcome);
          $("#flightplanOutcome").html(flightplanOutcome);

          // Example steps string: "A,Sub-step item to do from object,RDP to ServerA|B,Sub-step item to do from object again,Open Citrix Studio|C,Sub-step item to do lastly,Open PVS Console;A,Sub-step item to do in 2,RDP to ServerB|B,Sub-step item to do in 2,RDP to Server|C,Sub-step item to do in 2,RDP to ServerD"
          var flightplanSteps = flightplanEntry.split("~")[8];
          parseSteps(flightplanSteps);
        }
      }

      stepQuantity = findTotalStepQuantity();
      initiateStepFlow(stepQuantity.steps, stepQuantity.substeps);

      // Enable tooltips after all the steps are processed.
      $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
      });
    });

}

// findStepQuantity() finds it based on the DOM created by parseSteps(), and doesn't actually look at the API
function findTotalStepQuantity() {
  var result = {
    steps: 0,
    substeps: 0
  }
  // Cycle through every step and substep and find how many there are total. Based off of the div row for the step and then the tr row for each substep.
  for(var i = 0; i < 100; i++) {
    if($("#row-" + i).length) {
      result.steps++;
      for (var j = 0; j < 100; j++) {
        if($("#row-substep-" + i + "-" + j).length) {
          result.substeps++;
        }
      }
    }
  }
  return result;
}

function urlParam(name, url) {
    if (!url) {
     url = window.location.href;
    }
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) {
        return undefined;
    }
    return results[1] || undefined;
}

function init () {
  // Logic flow:
  //  getFlightPlan() pulls everything about the FlightPlan from the API, and populates everything about the FlightPlan except for the steps itself. Then ->
  // parseSteps() parses the steps string which holds all the steps and substeps. It creates the divs for the steps an the tables for the substeps. Then ->
  // initiateStepFlow() goes through all the DOM objects created by paresSteps() and activates the logic around the checkboxes around hooks, hiding, and disabling flows.
  // updateCompletionStatus() is hooked into onClick for all the checkboxes by initiateStepFlow() to activate the logic on user activity.

  currentTimestamp();
  getFlightplan();

  $("#generateReport").click(function(){ window.print(); }); // Hook clicking Generate Completion Report button into printing the page
}
