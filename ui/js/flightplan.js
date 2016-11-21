window.onload = init;

// Global variables
var stepsComplete = 0;
var launchers = []; // We use the launchers variable to work around the scope...
var mobile = false;
var loadedNote = false;
var completed = false;
var currentUser = "";

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

  // Hard-code Show All for testing
  /*
  $("tr[id^='row-substep-']").each(function () {
    $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
  });

  $('#toggleSequential').prop('checked', true);
  */
}

function parseSteps(steps) {
  var steps = steps.split(";;;");
  var numberOfSteps = steps.length;

  for (var i = 0;i < steps.length; i++) { // This for loop processes each step

    // Example substep: launcherAddress|A,Sub-step item to do from object,RDP to ServerA|B,Sub-step item to do from object again,Open Citrix Studio|C,Sub-step item to do lastly,Open PVS Console;
    var stepNumber = i+1;

    var substeps = steps[i].split("|||");

    var stepTitle = substeps[0].split(",,,")[0];
    launchers.push(substeps[0].split(",,,")[1]);

    var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step: ' + stepTitle + ' <button id="launch-' + stepNumber + '" type="button" class="btn btn-success btn-xs launchButton"><i class="fa fa-rocket"></i> Launch</button><button id="automate-' + stepNumber + '" type="button" class="btn btn-success btn-xs launchButton" disabled><i class="fa fa-cogs"></i> Automate</button></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';

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

    //var table = $('<table></table>').addClass('table table-bordered table-striped sp-databox-table-lg');
    var table = $('<table></table>').addClass('table table-bordered table-striped sp-databox-table-md');

    if ($(window).width() >= 660) {
      var head = $('<thead><tr class="success"><th width="95px">Sub-Step</th><th>Details</th><th>Action</th><th>Notes&nbsp;<span data-toggle="tooltip" data-placement="top" title="Enter notes here to keep track of what you actually did."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></th><th>Status</th></tr></thead>');
    } else {
      var head = $('<thead><tr class="success"><th>Sub-Step</th><th>Details</th><th>Action</th><th>Status</th></tr></thead>');
    }
    var body = $('<tbody>');
    table.append(head);
    table.append(body);

    if ( substeps[0].split(",,,")[1] == "noLauncher") {
      $("#launch-" + stepNumber).prop("disabled", true);
    }

    $("#launch-" + stepNumber).click(function() {
      //alert("yo from: " + this.id);
      var strWindowFeatures = "location=no,height=800,width=1050,scrollbars=no,status=no,resizable=no";
      //var strWindowFeatures = "";
      //var URL = "https://vcs01.eeg3.lab/admin";
      var URL = launchers[this.id.split("-")[1]-1]; // We use the launchers variable to work around the scope...
      var win = window.open(URL, "_blank", strWindowFeatures);
    });

    $("#popout-" + stepNumber).click(function() {
      //alert("yo from: " + this.id);
      var strWindowFeatures = "location=no,height=200,width=1000,scrollbars=no,status=no,resizable=no";
      //var strWindowFeatures = "";
      var URL = "http://localhost:8001/flightplan-popout.html";
      //var URL = launchers[this.id.split("-")[1]-1]; // We use the launchers variable to work around the scope...
      var win = window.open(URL, "_blank", strWindowFeatures);
    });

    for (var j = 1; j < substeps.length; j++) { // This for loop processes each substep of each step
      var substepNumber = j;
      var substepName = substeps[j].split(",,,")[0];
      var substepDetails = substeps[j].split(",,,")[1];
      var substepAction = substeps[j].split(",,,")[2];
      var substepCode = "substep-" + stepNumber + "-" + substepNumber; // Example: substep-2-1

      var tableLineItem = '<tr id="row-' + substepCode + '" class="">';
      tableLineItem += '<td id="' + substepCode + '" class="st-substep-col">' + substepName + '</td>';
      tableLineItem += '<td id="details-' + substepCode + '" class="st-details-col">' + substepDetails + '</td>';
      tableLineItem += '<td id="action-' + substepCode + '" class="st-action-col">' + substepAction + '</td>';
      //tableLineItem += '<td><input type="text" id="notes-' + substepCode + '" class="form-control input-sm" placeholder="Notes" /></td>';
      if ($(window).width() >= 660) {
        tableLineItem += '<td><textarea id="notes-' + substepCode + '" class="notesTextArea" rows="1" placeholder="Notes" /></td>';
      }
      if (i == 0 && j == 1) {
        tableLineItem += '<td><input type="checkbox" id="status-' + substepCode + '" class=""><label for="status-' + substepCode + '" class="euc-green"></label></td>';
      } else {
        tableLineItem += '<td><input type="checkbox" id="status-' + substepCode + '" class="" disabled><label for="status-' + substepCode + '" class="euc-green"></label></td>';
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
        var nodesToDisplay = ["_id", "title", "author", "revision", "category", "product", "description", "steps"];

        if (flightplan[i]["_id"] == passedId) {
          var flightplanSteps = flightplan[i]["steps"];
          displaySummary();
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

function displaySummary() {

  $("#flightplanHeaderSection").html(""); // Clear it

  helper.get("/api/flightplan/")
    .then(function(data){
      var flightplan = data;
      var flightplanEntry = "";

      var passedId = urlParam('id');

      for (var i = 0; i < data.length; i++) {
        var nodesToDisplay = ["_id", "title", "author", "revision", "category", "product", "description", "steps"];

        if (flightplan[i]["_id"] == passedId) {

          // Example steps string: "A,Sub-step item to do from object,RDP to ServerA|B,Sub-step item to do from object again,Open Citrix Studio|C,Sub-step item to do lastly,Open PVS Console;A,Sub-step item to do in 2,RDP to ServerB|B,Sub-step item to do in 2,RDP to Server|C,Sub-step item to do in 2,RDP to ServerD"
          var flightplanSteps = flightplan[i]["steps"];

          /*
          // Add table

          var table = $('<table></table>').addClass('table table-bordered table-striped sp-databox-table-sm');
          var body = $('<tbody>');
          table.append(body);

          var tableLineItem = "";
          tableLineItem += '<tr><td>Category <span data-toggle="tooltip" data-placement="right" title="Categories are groupings of similar flightplans."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></td><td><span id="flightplanCategory" class="flightplanHeader"></span></td></tr>';
          tableLineItem += '<tr><td>Product <span data-toggle="tooltip" data-placement="right" title="Flightplans are tied to products and versions so they stay relevant."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></td><td><span id="flightplanProduct" class="flightplanHeader"></span></td></tr>';
          tableLineItem += '<tr><td>Description <span data-toggle="tooltip" data-placement="right" title="The purpose of the flightplan."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></td><td><span id="flightplanDescription" class="flightplanHeader"></span></td></tr>';
          tableLineItem += '<tr><td>Revision <span data-toggle="tooltip" data-placement="right" title="As flightplans are updated, revisions are added."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></td><td><span id="flightplanRevision" class="flightplanHeader"></span></td></tr>';
          tableLineItem += '<tr><td>Author <span data-toggle="tooltip" data-placement="right" title="The creator of the flightplan."><i id="categoryInfo" class="fa fa-question-circle-o"></i></span></td><td><span id="flightplanAuthor" class="flightplanHeader"></span></td></tr></tr>';

          table.append(tableLineItem);

          var tableEnd = $('</tbody>');
          table.append(tableEnd);

          $("#flightplanHeaderSection").append(table);
          */

          var flightplanTitle = flightplan[i]["title"];
          $("#flightplanTitle").html(flightplanTitle);

          var flightplanAuthor = flightplan[i]["author"];
          $("#flightplanAuthor").html(flightplanAuthor);

          //var flightplanRevision = flightplan[i]["revision"];
          //$("#flightplanRevision").html(flightplanRevision);

          //var flightplanCategory = flightplan[i]["category"];
          //$("#flightplanCategory").html(flightplanCategory);

          //var flightplanProduct = flightplan[i]["product"];
          //$("#flightplanProduct").html(flightplanProduct);

          var flightplanDescription = flightplan[i]["description"];
          $("#flightplanDescription").html(flightplanDescription);
        }
      }
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

function exportFlightplan() {
    //details-substep-1-1
    //action-substep-1-1
    //notes-substep-1-1
    var flightplanObject = {
      flightplanId: "id",
      title: "title",

    }

    for (var i = 1; i < 100; i++) {
      if(!$("#details-substep-" + i + "-1").length == 0) {
        for (var j = 1; j < 100; j++) {
          if(!$("#details-substep-" + i + "-" + j).length == 0) {
            console.log($("#details-substep-" + i + "-" + j).text());
            console.log($("#action-substep-" + i + "-" + j).text());
            console.log($("#notes-substep-" + i + "-" + j).val());
            //console.log("notes-substep-" + i + "-" + j + ": " + $("#notes-substep-" + i + "-" + j).val());
          } else {
            console.log("details-substep-" + i + "-" + j + " does not exist. Breaking.");
            break;
          }
        }
      }
    }
}

function saveFlightplan(status) {

  var saveTitle = "";
  var user = "";
  var notes = "";
  var saveAlreadyExists = false;
  var passedId = urlParam('id');
  var lastChecked = "";
  //var completed = false;

  // Save instead of Save As if already loaded
  if (status == "new") {
    saveTitle = $('input:text[name=saveTitle]').val();
    //user = $('input:text[name=saveUser]').val();
    user = currentUser;
  } else if (status == "existing") {
    saveTitle = $("#currentInflight").text();
  } else if (status == "completed") {
    saveTitle = $("#currentInflight").text();
  }


  // Find last checked item so we can save progress
  $("input[id^='status-substep-']").each(function () {
    console.log(this.id + ": " + $("#" + this.id).prop('checked'));
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
        var nodesToDisplay = ["_id", "referencedFlightplan", "user", "notes"];

        if (inflight[i]["title"] == saveTitle) {
          saveAlreadyExists = true;
          savedInflight = inflight[i]["_id"];
          console.log("savedInflight: " + savedInflight);
        }
      }

      for (var i = 1; i < 100; i++) {
        if(!$("#details-substep-" + i + "-1").length == 0) {
          for (var j = 1; j < 100; j++) {
            if(!$("#details-substep-" + i + "-" + j).length == 0) {
              //console.log($("#details-substep-" + i + "-" + j).text());
              //console.log($("#action-substep-" + i + "-" + j).text());
              //console.log($("#notes-substep-" + i + "-" + j).val());
              //console.log("notes-substep-" + i + "-" + j + ": " + $("#notes-substep-" + i + "-" + j).val());
              if (($("#notes-substep-" + i + "-" + j).val().indexOf("|||") != -1)) {
                alert("ERROR: Notes cannot contain the string '|||'. Please remove and re-save.");
                //$("#errorMessage").html("ERROR: Launcher cannot contain the string ';;;'.");
                validated = 0;
              } else if (($("#notes-substep-" + i + "-" + j).val().indexOf(";;;") != -1)) {
                alert("ERROR: Notes cannot contain the string ';;;'. Please remove and re-save.");
                //$("#errorMessage").html("ERROR: Launcher cannot contain the string ';;;'.");
                validated = 0;
              } else if (($("#notes-substep-" + i + "-" + j).val().indexOf(",,,") != -1)) {
                alert("ERROR: Notes cannot contain the string ',,,'. Please remove and re-save.");
                //$("#errorMessage").html("ERROR: Launcher cannot contain the string ';;;'.");
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
              //console.log("details-substep-" + i + "-" + j + " does not exist. Breaking.");
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
            console.log("Save already exists. Not overwriting.");
          }
        } else {
          // patch code
          helper.patch("/api/inflight/" + savedInflight, inflightPost);
          $("#currentInflight").html(saveTitle);
        }
      }

    });

}

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
        //console.log("inflightNotes: " + inflightNotes);
        if (inflightNotes != "") {
          (inflightNotes.split(';;;')).forEach(function(item) {
            //console.log("note location: " + item.split("|")[0] + " | note value: " + item.split("|")[1]);
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
          //console.log("----");
          //console.log("currentStep / current Substep: " + currentStep + " / " + currentSubstep);
          //console.log("lastCheckedStep / lastCheckedSubstep: " + lastCheckedStep + " / " + lastCheckedSubstep);
          //console.log("#status-substep-" + lastCheckedStep + "-" + (parseInt(lastCheckedSubstep)+1));

          if (parseInt(currentStep) < parseInt(lastCheckedStep)) {
              //console.log("checking");
              //console.log("we should be checking: " + this.id);
              $("#" + this.id).prop('checked', true);
              $("#" + this.id).prop('disabled', false);
          } else if (parseInt(currentStep) == parseInt(lastCheckedStep)) {
            if (parseInt(currentSubstep) <= parseInt(lastCheckedSubstep)) {
              //console.log("checking2");
              //console.log("we should be checking: " + this.id);
              $("#" + this.id).prop('checked', true);
              $("#" + this.id).prop('disabled', false);
            } else if (parseInt(currentSubstep) == parseInt(lastCheckedSubstep)+1) {
              //console.log("enabling");
              $("#" + this.id).prop('checked', false);
              $("#" + this.id).prop('disabled', false);
            } else {
              //console.log("we should be unchecking: " + this.id);
              $("#" + this.id).prop('checked', false);
              $("#" + this.id).prop('disabled', true);
              //console.log("shouldnt be checked");
            }
          } else {
            //console.log("we should be unchecking: " + this.id);
            $("#" + this.id).prop('checked', false);
            $("#" + this.id).prop('disabled', true);
            //console.log("shouldnt be checked");
          }
          //console.log("----");

          // Unhide substeps based on last checked
          $("tr[id^='row-substep-']").each(function () {
            var currentStep = (this.id).split("-")[2];
            var currentSubstep = (this.id).split("-")[3];

            /*if (parseInt(currentStep) <= parseInt(lastCheckedStep)) {
              if (parseInt(currentSubstep) <= parseInt(lastCheckedSubstep)) {
                $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
              } else if (parseInt(currentSubstep) == parseInt(lastCheckedSubstep)+1) {
                $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
              }
            } */

            if (parseInt(currentStep) < parseInt(lastCheckedStep)) {
              //console.log("this.id: " + this.id);
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

          // One-off code to check if lastChecked is the end of a step, because if it is then we need to handle next step's first Substep
          if($("#status-substep-" + lastCheckedStep + "-" + (parseInt(lastCheckedSubstep)+1)).length == 0) {
            //console.log("lastChecked is the end of a step");
            //console.log("this is: " + "#status-substep-" + (parseInt(lastCheckedStep)+1) + "-1");
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

function init () {
  // Logic flow:
  //  getFlightPlan() pulls everything about the FlightPlan from the API, and populates everything about the FlightPlan except for the steps itself. Then ->
  // parseSteps() parses the steps string which holds all the steps and substeps. It creates the divs for the steps an the tables for the substeps. Then ->
  // initiateStepFlow() goes through all the DOM objects created by paresSteps() and activates the logic around the checkboxes around hooks, hiding, and disabling flows.
  // updateCompletionStatus() is hooked into onClick for all the checkboxes by initiateStepFlow() to activate the logic on user activity.

  //row-substep-
  //var result = beginsWith("abc", "|");
  //console.log("beginsWith: " + result);

  $('#toggleSequential').change(function() {
    var checkboxHit = 0; // This is done to prevent the next item in list to be done from being hidden.

    if($(this).is(":checked")) { // If toggleSequential is checked
      $("tr[id^='row-substep-']").each(function () {
        $("#" + this.id).css("color", "black"); // Unhide next sub-step since this sub-step is complete.
      });
    } else { // if toggleSequential is not checked
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
  });

  currentTimestamp();
  getFlightplan();

  $("#delRows").click(function() {
    //$('#inflightListTable tr').remove();
    $('#inflightListTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
  });

  $("#saveSubmit").click(function() {
    //$('#saveModal').modal('show');

    saveFlightplan('new');

    $('#saveModal').modal('hide');
  });

  $("#completeSubmit").click(function() {
    //$('#saveModal').modal('show');
    completed = true;
    $("#saveModal-title").html("Complete Flight");
    if (loadedNote) {
      saveFlightplan('completed');
    } else {
      $('#saveModal').modal('show');
    }
    //location.reload();
    //$('#saveModal').modal('hide');
  });

  $(".showCompleted").click(function() {
    //window.print();
    //saveFlightplan();

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
                if (nodesToDisplay[j] === "lastCommunication" && inflight[i][nodesToDisplay[j]] !== "Never") {
                  //rowToAdd += '<td><a href="/api/screenshot/' + flightplans[i][nodesToDisplay[j]] + '">' + flightplans[i][nodesToDisplay[j]] + '</a></td>';
                } else {
                  rowToAdd += "<td>" + inflight[i][nodesToDisplay[j]] + "</td>";
                }
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
          console.log(this.id);
          console.log( (this.id).split("-")[1] );

          loadFlightplan((this.id).split("-")[1]);
          $('#viewCompletedModal').modal('hide');
        });

        $(".deleteBtn").click(function() {
          console.log(this.id);
          console.log( (this.id).split("-")[1] );

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
    //window.print();
    //saveFlightplan();

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
                if (nodesToDisplay[j] === "lastCommunication" && inflight[i][nodesToDisplay[j]] !== "Never") {
                  //rowToAdd += '<td><a href="/api/screenshot/' + flightplans[i][nodesToDisplay[j]] + '">' + flightplans[i][nodesToDisplay[j]] + '</a></td>';
                } else {
                  rowToAdd += "<td>" + inflight[i][nodesToDisplay[j]] + "</td>";
                }
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
          console.log(this.id);
          console.log( (this.id).split("-")[1] );

          loadFlightplan((this.id).split("-")[1]);
          $('#loadModal').modal('hide');
        });

        $(".deleteBtn").click(function() {
          console.log(this.id);
          console.log( (this.id).split("-")[1] );

          helper.del("/api/inflight/" + (this.id).split("-")[1]);
          location.reload();
        });

        $('#loadModal').modal('show');
      });

  });

  $(document).ready(function() { // Enable tooltips after all the steps are processed.
    var load = urlParam('load');
    if(load == "inflight") {
      $(".loadFP").trigger("click");
    } else if (load == "completed") {
      $(".showCompleted").trigger("click");
    }

    helper.get("/api/getUserInfo")
      .then(function(data) {
        currentUser = data[0]["username"];
        $("#username").text(data[0]["username"]);
      });
  });
}
