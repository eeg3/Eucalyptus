window.onload = init;

// Global variables
var stepsComplete = 0;
var launchers = [];
var mobile = false;
var loadedNote = false;
var completed = false;
var currentUser = "";
var sequential = false;
var formModified = false;

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

// initiateStepFlow(steps, substeps)
// Makes it so checkboxes are enabled or disabled if the previous checkbox is checked or unchecked.
function initiateStepFlow(steps, substeps) {


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
          $("#li-" + (this.id.split("-")[2])).css("text-decoration", "line-through");
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
            if (sequential) {
              $("#" + nextRow).css("color", "white"); // Hide next sub-step until this sub-step is complete.
            }
            if(nextRow.split("-")[3] == "1") { // Un-crossout the section in the TOC if it's not complete.
              $("#li-" + (this.id.split("-")[2])).css("text-decoration", "");
            }
            stepsComplete--;
            updateCompletionStatus();
          }
        }

      });
    } // End action per substep

  } // End action per step

}

// parseSteps(steps)
// This function actually populates the steps div based on the object's steps element.
function parseSteps(steps) {
  var steps = steps.split(";;;");
  var numberOfSteps = steps.length;

  for (var i = 0;i < steps.length; i++) { // This for loop processes each step
    var stepNumber = i+1;
    var substeps = steps[i].split("|||");
    var stepTitle = substeps[0].split(",,,")[0];
    launchers.push(substeps[0].split(",,,")[1]);

    // We change the way each step's header is displayed if size is too small; otherwise, it looks weird.
    if ($(window).width() >= 660) {
      var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="panel panel-inverse"><div class="panel-heading sp-databox-panel-heading-dark">' + stepTitle + ' <button id="launch-' + stepNumber + '" type="button" class="btn btn-success btn-xs launchButton"><i class="fa fa-rocket"></i> Launch</button><button id="automate-' + stepNumber + '" type="button" class="btn btn-success btn-xs launchButton" disabled><i class="fa fa-cogs"></i> Automate</button></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div>';
    } else {
      var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="panel panel-inverse"><div class="panel-heading sp-databox-panel-heading-dark"><center>' + stepTitle + '<br><button id="launch-' + stepNumber + '" type="button" class="btn btn-success btn-xs "><i class="fa fa-rocket"></i> Launch</button><button id="automate-' + stepNumber + '" type="button" class="btn btn-success btn-xs " disabled><i class="fa fa-cogs"></i> Automate</button></center></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div>';

    }
    $("#stepsSection").append(newDivHTML);

    // The Table of Contents is composed of all of the steps. They are clickable to jump to relevant section.
    $("#tocList").append('<li id="li-' + stepNumber + '"><a href="#row-' + stepNumber + '">' + stepTitle + '</a></li>');

    var table = $('<table></table>').addClass('table table-bordered table-striped sp-databox-table-sm');

    // Similar to modifying step's header if display size is too small, we also disable note-taking because it doesn't work well on devices this small.
    // This section just disabled the th header for Notes. It's also removed from being shown in each substep loop.
    // A warning is displayed in a modal later notifying the user of this.
    if ($(window).width() >= 660) {
      var head = $('<thead><tr class="success"><th width="95px">Sub-Step</th><th>Details</th><th>Notes&nbsp;<span data-toggle="tooltip" data-placement="top" title="Enter notes here to keep track of what you actually did."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></th><th>Status</th></tr></thead>');
    } else {
      var head = $('<thead><tr class="success"><th>Sub-Step</th><th>Details</th><th>Status</th></tr></thead>');
    }
    table.append(head);

    var body = $('<tbody>');
    table.append(body);

    // If there isn't a launcher, disable the button.
    if (substeps[0].split(",,,")[1] == "noLauncher") {
      $("#launch-" + stepNumber).prop("disabled", true);
    }

    // Hook up clicking Launcher to the URL configured in the FlightPlan.
    $("#launch-" + stepNumber).click(function() {
      var strWindowFeatures = "location=no,height=800,width=1050,scrollbars=no,status=no,resizable=no";
      var URL = launchers[this.id.split("-")[1]-1];
      var win = window.open(URL, "_blank", strWindowFeatures);
    });

    // This for loop processes each substep of each step.
    for (var j = 1; j < substeps.length; j++) {
      var substepNumber = j;
      var substepName = substeps[j].split(",,,")[0];
      var substepDetails = substeps[j].split(",,,")[1];
      var substepCode = "substep-" + stepNumber + "-" + substepNumber; // Example: substep-2-1

      var tableLineItem = '<tr id="row-' + substepCode + '" class="">';
      tableLineItem += '<td id="' + substepCode + '" class="st-substep-col">' + substepName + '</td>';
      tableLineItem += '<td id="details-' + substepCode + '" class="st-details-col">' + substepDetails + '</td>';
      // Again disable Notes if window is too small.
      if ($(window).width() >= 660) {
        tableLineItem += '<td><textarea id="notes-' + substepCode + '" class="notesTextArea" rows="1" placeholder="Notes" /></td>';
      }
      // Add checkboxes for completion.
      if (i == 0 && j == 1) {
        tableLineItem += '<td><input type="checkbox" id="status-' + substepCode + '" class=""><label for="status-' + substepCode + '" class="euc-green"></label></td>';
      } else {
        tableLineItem += '<td><input type="checkbox" id="status-' + substepCode + '" class="" disabled><label for="status-' + substepCode + '" class="euc-green"></label></td>';
      }

      tableLineItem += '</tr>';
      table.append(tableLineItem);
    }

    var tableEnd = $('</tbody>');
    table.append(tableEnd);

    $("#" + stepNumber).append(table);
  }

  // We want to track if anything changes so that we can warn the user if they try to exit before saving.
  $('textarea').on('change keyup paste', function() {
    formModified = true;
  });

}

// updateCompletionStatus()
// This function handles calculating the completion status bar. We also keep the status bar at atleast 5%.
function updateCompletionStatus() {
  var stepCount = findTotalStepQuantity();
  var percentComplete = (stepsComplete / stepCount.substeps) * 100;
  if (stepsComplete == 0) { percentComplete = 5; } // Always keep at least 5% so the bar is visible.
  $("#completionStatus").css("width", percentComplete + '%');
}

// getFlightplan()
// Grabs the FlightPlan itself from the FlightPlan API.
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

      // Search all the flightplans until we get the one that matches the passed Id.
      for (var i = 0; i < data.length; i++) {
        if (flightplan[i]["_id"] == passedId) {
          var flightplanSteps = flightplan[i]["steps"];
          displaySummary(); // Generate the Summary section.
          parseSteps(flightplanSteps); // Generate the Steps section.
        }
      }

      stepQuantity = findTotalStepQuantity();
      initiateStepFlow(stepQuantity.steps, stepQuantity.substeps); // Hook Up step checkbox logic.

      // Enable tooltips after all the steps are processed.
      $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
        $("#toggleSequential").prop("checked", true);
        toggleSeq("initialize");
      });
    });

}

function displaySummary() {
  $("#flightplanHeaderSection").html(""); // Clear it before we add it.

  helper.get("/api/flightplan/")
    .then(function(data){
      var flightplan = data;
      var flightplanEntry = "";
      var passedId = urlParam('id');

      // Search for FlightPlan then show its title, author, and description.
      for (var i = 0; i < data.length; i++) {
        if (flightplan[i]["_id"] == passedId) {
          var flightplanTitle = flightplan[i]["title"];
          $("#flightplanTitle").html(flightplanTitle);

          var flightplanAuthor = flightplan[i]["author"];
          $("#flightplanAuthor").html(flightplanAuthor);

          var flightplanDescription = flightplan[i]["description"];
          $("#flightplanDescription").html(flightplanDescription);
        }
      }
    });
}

// findStepQuantity()
// Finds step quantity based on the DOM created by parseSteps(), and doesn't actually look at the API.
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

// urlParam(name, url)
// Gets the id from the URL parameters (e.g. flightplan?id=546345634563456ee)
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

// saveFlightplan(status)
// Saves the FlightPlan.
function saveFlightplan(status) {

  var saveTitle = "";
  var user = "";
  var notes = "";
  var saveAlreadyExists = false;
  var passedId = urlParam('id');
  var lastChecked = "";

  // Save instead of Save As if already loaded
  if (status == "new") {
    saveTitle = $('input:text[name=saveTitle]').val();
    user = currentUser;
  } else if (status == "existing") {
    saveTitle = $("#currentInflight").text();
  } else if (status == "completed") {
    saveTitle = $("#currentInflight").text();
  }


  // Find last checked item so we can save progress
  $("input[id^='status-substep-']").each(function () {
    if($("#" + this.id).prop('checked')) {
      lastChecked = this.id;
    }
  });

  // Check to see if save already exists
  helper.get("/api/inflight/")
    .then(function(data){
      var inflight = data;
      var inflightEntry = "";
      var savedInflight = "";
      var validated = 1;

      for (var i = 0; i < data.length; i++) {
        if (inflight[i]["title"] == saveTitle) {
          saveAlreadyExists = true;
          savedInflight = inflight[i]["_id"];
        }
      }

      for (var i = 1; i < 100; i++) {
        if(!$("#details-substep-" + i + "-1").length == 0) {
          for (var j = 1; j < 100; j++) {
            if(!$("#details-substep-" + i + "-" + j).length == 0) {
              if (($("#notes-substep-" + i + "-" + j).val().indexOf("|||") != -1)) {
                alert("ERROR: Notes cannot contain the string '|||'. Please remove and re-save.");
                validated = 0;
              } else if (($("#notes-substep-" + i + "-" + j).val().indexOf(";;;") != -1)) {
                alert("ERROR: Notes cannot contain the string ';;;'. Please remove and re-save.");
                validated = 0;
              } else if (($("#notes-substep-" + i + "-" + j).val().indexOf(",,,") != -1)) {
                alert("ERROR: Notes cannot contain the string ',,,'. Please remove and re-save.");
                validated = 0;
              } else if (beginsWith($("#notes-substep-" + i + "-" + j).val(), ";") || endsWith($("#notes-substep-" + i + "-" + j).val(), ";")) {
                alert("ERROR: Notes cannot begin or end with the character ';'. Please remove and re-save.");
                validated = 0;
              } else if (beginsWith($("#notes-substep-" + i + "-" + j).val(), "|") || endsWith($("#notes-substep-" + i + "-" + j).val(), "|")) {
                alert("ERROR: Notes cannot begin or end with the character '|'. Please remove and re-save.");
                validated = 0;
              } else if (beginsWith($("#notes-substep-" + i + "-" + j).val(), ",") || endsWith($("#notes-substep-" + i + "-" + j).val(), ",")) {
                alert("ERROR: Notes cannot begin or end with the character ','. Please remove and re-save.");
                validated = 0;
              } else {
                notes += "notes-substep-" + i + "-" + j + "|||" + $("#notes-substep-" + i + "-" + j).val() + ";;;";
              }
            } else {
              break;
            }
          }
        }
      }

      var inflightPost = {};

      if (saveTitle !== "") {
        inflightPost["title"] = saveTitle;
      }
      if (passedId !== "") {
        inflightPost["referencedFlightplan"] = passedId;
      }
      if (user !== "") {
        inflightPost["user"] = user;
      }
      if (notes !== "") {
        inflightPost["notes"] = notes;
      }
      if (lastChecked !== "") {
        inflightPost["lastChecked"] = lastChecked;
      }
      if (completed !== "") {
        inflightPost["completed"] = completed;
      }

      if (validated) {
        if (!loadedNote) {
          if (!saveAlreadyExists) {
            helper.post("/api/inflight/", inflightPost);
            $("#currentInflight").html(saveTitle);
          } else {
            $("modalError").html("Error: Save name already exists. Not overwriting.")
          }
        } else {
          helper.patch("/api/inflight/" + savedInflight, inflightPost);
          $("#currentInflight").html(saveTitle);
        }
      }

    });

}

// loadFlightPlan(idToLoad)
// This function loads previously saved or completed FlightPlans.
function loadFlightplan(idToLoad) {

  var inflightNotes = "";
  loadedNote = true;

  if (idToLoad.length) {
    helper.get("/api/inflight/")
      .then(function(data){
        var inflight = data;
        var lastChecked = "";

        var inflightEntry = "";

        for (var i = 0; i < data.length; i++) {
          var nodesToDisplay = ["_id", "title", "referencedFlightplan", "user", "notes"];

          if (inflight[i]["_id"] == idToLoad) {
            inflightTitle = inflight[i]["title"];
            inflightNotes = inflight[i]["notes"];
            lastChecked = inflight[i]["lastChecked"];
          }
        }

        // Process Notes
        if (inflightNotes != "") {
          (inflightNotes.split(';;;')).forEach(function(item) {
            $("#" + item.split("|||")[0]).val( item.split("|||")[1] );
          });
        }

        if (lastChecked != undefined) {
          lastCheckedStep = lastChecked.split("-")[2];
          lastCheckedSubstep = lastChecked.split("-")[3];
        } else {
          lastCheckedStep = 0;
          lastCheckedSubstep = 0;
        }

        // Set active flight
        $("#currentInflight").html(inflightTitle);

        // Check boxes based on last checked
        $("input[id^='status-substep-']").each(function () {
          var currentStep = (this.id).split("-")[2];
          var currentSubstep = (this.id).split("-")[3];

          if (parseInt(currentStep) < parseInt(lastCheckedStep)) {
              $("#" + this.id).prop('checked', true);
              $("#" + this.id).prop('disabled', false);
              $("#li-" + currentStep).css("text-decoration", "line-through");
          } else if (parseInt(currentStep) == parseInt(lastCheckedStep)) {
            if (parseInt(currentSubstep) <= parseInt(lastCheckedSubstep)) {
              $("#" + this.id).prop('checked', true);
              $("#" + this.id).prop('disabled', false);

              var nextRow = "status-substep-" + currentStep + "-" + (parseInt(currentSubstep)*1 + 1);
              if (!($("#" + nextRow).length)) {
                $("#li-" + currentStep).css("text-decoration", "line-through");
              }
            } else if (parseInt(currentSubstep) == parseInt(lastCheckedSubstep)+1) {
              $("#" + this.id).prop('checked', false);
              $("#" + this.id).prop('disabled', false);
            } else {
              $("#" + this.id).prop('checked', false);
              $("#" + this.id).prop('disabled', true);
            }
          } else {
            $("#" + this.id).prop('checked', false);
            $("#" + this.id).prop('disabled', true);
          }

          // Unhide substeps based on last checked
          if (sequential) {
            $("tr[id^='row-substep-']").each(function () {
              var currentStep = (this.id).split("-")[2];
              var currentSubstep = (this.id).split("-")[3];

              if (parseInt(currentStep) < parseInt(lastCheckedStep)) {
                $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
              } else if (parseInt(currentStep) == parseInt(lastCheckedStep)) {
                if (parseInt(currentSubstep) <= parseInt(lastCheckedSubstep)) {
                  $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
                } else if (parseInt(currentSubstep) == parseInt(lastCheckedSubstep)+1) {
                  $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
                }
              } else {
                $("#" + this.id).css("color", "white"); // Unhide next sub-step since this sub-step is complete.
              }

            });
          }

          // One-off code to check if lastChecked is the end of a step, because if it is then we need to handle next step's first Substep
          if($("#status-substep-" + lastCheckedStep + "-" + (parseInt(lastCheckedSubstep)+1)).length == 0) {
            $("#status-substep-" + (parseInt(lastCheckedStep)+1) + "-1").prop('checked', false);
            $("#status-substep-" + (parseInt(lastCheckedStep)+1) + "-1").prop('disabled', false);
            $("#row-substep-" + (parseInt(lastCheckedStep)+1) + "-1").css("color", "black");
          }

        });

      });
  }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function beginsWith(str, suffix) {
    return (str.substr(0, suffix.length) == suffix);
}

// toggleSeq(state)
// Toggles whether we show all steps at once or sequentially as they are completed.
function toggleSeq(state) {
  var checkboxHit = 0; // This is done to prevent the next item in list to be done from being hidden.

  if($(this).is(":checked") || state == "initialize" || state == false) { // If toggleSequential is checked
    sequential = false;
    $("tr[id^='row-substep-']").each(function () {
      $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
    });
  } else { // if toggleSequential is not checked
    sequential = true;
    $("tr[id^='row-substep-']").each(function () {
      var checkboxCode = "#status-" + this.id.split("-")[1] + "-" + this.id.split("-")[2] + "-" + this.id.split("-")[3];

      if(!$(checkboxCode).prop('checked') ) {
        if (checkboxHit) { // This is done to prevent the next item in list to be done from being hidden.
          $("#" + this.id).css("color", "white"); // Unhide next sub-step since this sub-step is complete.
        }
        checkboxHit++;
      }
    });
  }
}

function init () {
  // Logic flow:
  //  getFlightPlan() pulls everything about the FlightPlan from the API, and populates everything about the FlightPlan except for the steps itself. Then ->
  // parseSteps() parses the steps string which holds all the steps and substeps. It creates the divs for the steps an the tables for the substeps. Then ->
  // initiateStepFlow() goes through all the DOM objects created by paresSteps() and activates the logic around the checkboxes around hooks, hiding, and disabling flows.
  // updateCompletionStatus() is hooked into onClick for all the checkboxes by initiateStepFlow() to activate the logic on user activity.

  if ($(window).width() >= 660) {
    $("#stepsSection").css("min-width", "750px");
    $("#stepsSection").css("width", "auto !important");
  } else {
    $("#resolutionModal").modal('show');
  }

  $('#toggleSequential').on('switchChange.bootstrapSwitch', function(event, state) {
    toggleSeq(state);
  });

  $('#reload').click(function() {
    location.reload();
  });

  currentTimestamp();
  getFlightplan();

  $("#delRows").click(function() {
    $('#inflightListTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
  });

  $("#saveSubmit").click(function() {
    saveFlightplan('new');
    formModified = false;
    $('#saveModal').modal('hide');
  });

  $("#completeSubmit").click(function() {
    completed = true;
    $("#saveModal-title").html("Complete Flight");
    if (loadedNote) {
      saveFlightplan('completed');
    } else {
      $('#saveModal').modal('show');
    }
  });

  $(".showCompleted").click(function() {
    helper.get("/api/inflight/")
      .then(function(data){
        var inflight = data;
        var passedId = urlParam('id');

        // Clear old loads
        $('#completedListTable tr').not(function(){ return !!$(this).has('th').length; }).remove();

        for (var i = 0; i < data.length; i++) {
          if(inflight[i]["referencedFlightplan"] == passedId) {
            if (inflight[i]["completed"] == true) {
              var nodesToDisplay = ["title", "user"];
              var rowToAdd = "<tr>";
              for (var j = 0; j < nodesToDisplay.length; j++) {
                rowToAdd += "<td>" + inflight[i][nodesToDisplay[j]] + "</td>";
              }
              rowToAdd += '<td>';
              rowToAdd += '<button id="open-' + inflight[i]["_id"] + '" title="Load Saved Progress" type="button" class="btn btn-success btn-xs loadBtn"><i class="fa fa-folder-open-o"></i></button>';
              rowToAdd += '<button id="del-' + inflight[i]["_id"] + '" title="Delete Saved Progress" type="button" class="btn btn-success btn-xs deleteBtn"><i class="fa fa-trash-o"></i></button>';
              rowToAdd += '</td>';
              rowToAdd += "</tr>";
              $('#completedListTable tr:last').after(rowToAdd);
            }
          }
        }
        $('#completedListTable').trigger("update");

        $(".loadBtn").click(function() {
          loadFlightplan((this.id).split("-")[1]);
          $('#viewCompletedModal').modal('hide');
        });

        $(".deleteBtn").click(function() {
          helper.del("/api/inflight/" + (this.id).split("-")[1]);
          location.reload();
        });

        $('#viewCompletedModal').modal('show');
      });

  });

  $(".saveFP").click(function() {
    if (loadedNote) {
      saveFlightplan('existing');
    } else {
      $("#saveModal-title").html("Save Flight");
      $('#saveModal').modal('show');
    }
  });

  $(".loadFP").click(function() {
    helper.get("/api/inflight/")
      .then(function(data){
        var inflight = data;
        var passedId = urlParam('id');

        // Clear old loads
        $('#inflightListTable tr').not(function(){ return !!$(this).has('th').length; }).remove();

        for (var i = 0; i < data.length; i++) {
          if(inflight[i]["referencedFlightplan"] == passedId) {
            if (inflight[i]["completed"] == false) {
              var nodesToDisplay = ["title", "user"];
              var rowToAdd = "<tr>";
              for (var j = 0; j < nodesToDisplay.length; j++) {
                rowToAdd += "<td>" + inflight[i][nodesToDisplay[j]] + "</td>";
              }
              rowToAdd += '<td>';
              rowToAdd += '<button id="open-' + inflight[i]["_id"] + '" title="Load Saved Progress" type="button" class="btn btn-success btn-xs loadBtn"><i class="fa fa-folder-open-o"></i></button>';
              rowToAdd += '<button id="del-' + inflight[i]["_id"] + '" title="Delete Saved Progress" type="button" class="btn btn-success btn-xs deleteBtn"><i class="fa fa-trash-o"></i></button>';
              rowToAdd += '</td>';
              rowToAdd += "</tr>";
              $('#inflightListTable tr:last').after(rowToAdd);
            }
          }
        }
        $('#inflightListTable').trigger("update");

        $(".loadBtn").click(function() {
          loadFlightplan((this.id).split("-")[1]);
          $('#loadModal').modal('hide');
        });

        $(".deleteBtn").click(function() {
          helper.del("/api/inflight/" + (this.id).split("-")[1]);
          location.reload();
        });

        $('#loadModal').modal('show');
      });

  });

  // Code to avoid navbar covering up top of jumped-to anchor
  window.addEventListener("hashchange", function() { scrollBy(0, -60) })

  $(document).ready(function() {

    $("#helpBtn").click(function() {
      introguide.start();
    });

    $("#toggleSequential").bootstrapSwitch({
      onColor: 'success',
      offColor: 'success',
      state: false
    });

    var load = urlParam('load');
    if(load == "inflight") {
      $(".loadFP").trigger("click");
    } else if (load == "completed") {
      $(".showCompleted").trigger("click");
    }

    // Leave Warning
    window.onbeforeunload = function() {
      if (formModified) {
        return "New information not saved. Do you wish to leave the page?";
      }
    }

    // Walkthrough Code
    var introguide = introJs();
    introguide.setOptions({
      exitOnEsc: false,
      exitOnOverlayClick: false,
      steps: [
            {
              intro: 'This guided tour will demonstrate how to use a FlightPlan.',
              position: 'bottom'
            },
            {
              element: '#activeFlightCol',
              intro: 'This section shows what Active Flight is loaded.<br><br>If you haven\'t saved the flight yet, it will show "Not Saved".<br><br>If you have loaded a flight, the title of that loaded flight will be shown.',
              position: 'bottom'
            },
            {
            	element: '#tocList',
            	intro: 'These are all of the steps within the FlightPlan. As you complete the FlightPlan, these will be crossed off.',
            	position: 'top'
            },
            {
            	element: '#loadDiv',
            	intro: 'Load a previous Flight that was not completed.',
            	position: 'top'
            },
            {
            	element: '#saveDiv',
            	intro: 'Save a Flight to come back and finish later.',
            	position: 'top'
            },
            {
            	element: '#completedDiv',
            	intro: 'View a past Flight that was completed.',
            	position: 'top'
            },
            {
            	element: '#toggleBoxes',
            	intro: 'Toggle between showing all steps, or only showing steps as they are completed.',
            	position: 'top'
            },
            {
            	element: '#row-1',
            	intro: 'Actions are broken down into steps and sub-steps.',
            	position: 'top'
            },
            {
            	element: '#launcher-1',
            	intro: 'Launchers will open new windows where the step\'s actions can be completed.',
            	position: 'top'
            },
            {
            	element: '#completeSubmit',
            	intro: 'Once the Flight is complete, submit it and it will be saved for reference later.',
            	position: 'top'
            }
      ],
      tooltipClass: 'customDefault'
    });

    helper.get("/api/getUserInfo")
      .then(function(data) {
        currentUser = data[0]["name"];
        $("#username").text(data[0]["name"]);
        if(data[0]["walkthroughFlightplan"] == true) {
          introguide.start();

          var userPatch = {};
          userPatch["walkthroughFlightplan"] = false;
          helper.patch("/users/" + data[0]["id"], userPatch);
        }
      });

  });
}
