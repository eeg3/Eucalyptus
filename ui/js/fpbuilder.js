window.onload = init;

// Global variables
var stepsComplete = 0;
var invalidInput = 0;
var staticFields = ["title", "description", "category", "author", "product", "revision"];

// We use these arrays to store the step & substep order so if user removes and adds steps & substeps in random ways, we track that properly and keep them in expected order.
var stepOrder = [];
var substepOrder = [];


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

function createStep(stepNumber) {

  stepOrder.push(stepNumber);
  //for (var o = 0; o < stepOrder.length; o++) {
  //  console.log("Step Order: " + stepOrder[o]);
  //}

  //  var newDivHTML = '<div class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step ' + stepNumber + '&nbsp;&nbsp;<i id="addButton-' + stepNumber + '" class="fa fa-plus leafLogo"></i>&nbsp;<i id="addButton-' + stepNumber + '" class="fa fa-minus minus"></i></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
  if(stepNumber == 1) {
    //var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step ' + stepNumber + '&nbsp;&nbsp;<a id="addButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
    var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step #&nbsp;<input type="text" class="input-medium" id="stepTitle-' + stepNumber + '" placeholder="Step Title"></input><input type="text" class="input-medium" id="stepLauncher-' + stepNumber + '" placeholder="Step Launcher URL"></input><a id="addButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
  } else {
    //var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step ' + stepNumber + '&nbsp;&nbsp;<a id="addButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a><a id="delButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-minus minus"></i></a></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
    var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step #&nbsp;<input type="text" class="input-medium" id="stepTitle-' + stepNumber + '" placeholder="Step Title"><input type="text" class="input-medium" id="stepLauncher-' + stepNumber + '" placeholder="Step Launcher URL"></input></input><a id="addButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a><a id="delButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-minus minus"></i></a></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
  }
  $("#stepsSection").append(newDivHTML);

  var table = $('<table id="table-' + stepNumber + '"></table>').addClass('table table-bordered table-striped sp-databox-table');;
  var head = $('<thead><tr><td>Sub-Step</td><td>Details</td><td>Action</td></tr></thead>');
  var body = $('<tbody>');
  table.append(head);
  table.append(body);

  var substepNumber = 1;

  var tableLineItem = createSubStep(stepNumber, substepNumber);

  table.append(tableLineItem);

  var tableEnd = $('</tbody>');
  table.append(tableEnd);

  $("#" + stepNumber).append(table);

}

function addStep(currentStep) {

  var stepNumber = 999;

  // Check for a place to put the step
  for(var i = 1; i < 50; i++) {
    if(!($("#row-" + i).length)) {
      stepNumber = i;
      break;
    }
  }

  stepOrder.splice(stepOrder.indexOf(parseInt(currentStep))+1, 0, stepNumber);

  console.log("-----");
  for (var o = 0; o < stepOrder.length; o++) {
    console.log("Step Order: " + stepOrder[o]);
  }
  console.log("-----");

  //  var newDivHTML = '<div class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step ' + stepNumber + '&nbsp;&nbsp;<i id="addButton-' + stepNumber + '" class="fa fa-plus leafLogo"></i>&nbsp;<i id="addButton-' + stepNumber + '" class="fa fa-minus minus"></i></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
  //var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step ' + stepNumber + '&nbsp;&nbsp;<a id="addButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a><a id="delButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-minus minus"></i></a></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
  var newDivHTML = '<div id="row-' + stepNumber + '" class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step #&nbsp;<input type="text" class="input-medium" id="stepTitle-' + stepNumber + '" placeholder="Step Title"></input><input type="text" class="input-medium" id="stepLauncher-' + stepNumber + '" placeholder="Step Launcher URL"></input><a id="addButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a><a id="delButton-' + stepNumber + '" class="btn btn-small leafLogo"><i class="fa fa-minus minus"></i></a></div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
  //$("#stepsSection").append(newDivHTML);
  $("#row-" + currentStep).after(newDivHTML);

  // Add a table name so we can add to it
  var table = $('<table id="table-'+ stepNumber + '"></table>').addClass('table table-bordered table-striped sp-databox-table');
  var head = $('<thead><tr><td>Sub-Step</td><td>Details</td><td>Action</td></tr></thead>');
  var body = $('<tbody>');
  table.append(head);
  table.append(body);

  var substepNumber = 1;

  var tableLineItem = createSubStep(stepNumber, substepNumber);

  table.append(tableLineItem);

  var tableEnd = $('</tbody>');
  table.append(tableEnd);

  $("#" + stepNumber).append(table);
  //$("#row-" + currentStep).append(table);

}

function createSubStep(stepNumber, substepNumber) {

  substepOrder.push(stepNumber + "," + substepNumber);

  var substepName = "#";
  var substepCode = "substep-" + stepNumber + "-" + substepNumber; // Example: substep-2-1
  var tableLineItem = '<tr id="row-' + substepCode + '">';
  tableLineItem += '<td id="' + substepCode + '" class="st-substep-col borderTD">' + substepName + '</td>';
  tableLineItem += '<td><input type="text" id="details-' + substepCode + '" class="form-control input-sm" placeholder="Sub-Step Details" /></td>';
  tableLineItem += '<td><input type="text" id="action-' + substepCode + '" class="form-control input-sm" placeholder="Sub-Step Action" /></td>';
  if (substepNumber == 1) {
    tableLineItem += '<td class="borderTD"><a id="addButton-' + substepCode + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a>&nbsp;&nbsp;</td>';
  } else {
    tableLineItem += '<td class="borderTD"><a id="addButton-' + substepCode + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a>&nbsp;&nbsp;<a id="delButton-' + substepCode + '" class="btn btn-small leafLogo"><i class="fa fa-minus minus"></i></a></td>';
  }
  tableLineItem += '</tr>';
  return tableLineItem;
}

function addSubStep(stepNumber, substepNumber) {

  var currentSubstepID = stepNumber + "," + substepNumber;
  var currentSubstepNumber = substepNumber;

  //var subStepCode = "substep-" + stepNumber + "-";
  var substepNumber = 999;

  // Check for a place to put the substep
  for(var i = 1; i < 50; i++) {
    if(!($("#row-substep-" + stepNumber + "-" + i).length)) {
      substepNumber = i;
      break;
    }
  }

  var newSubstepID = stepNumber + "," + substepNumber;

  substepOrder.splice(substepOrder.indexOf(currentSubstepID)+1, 0, newSubstepID);

  console.log("-----");
  for (var o = 0; o < substepOrder.length; o++) {
    console.log("Substep Order: " + substepOrder[o]);
  }
  console.log("-----");

  var substepName = "#";
  var substepCode = "substep-" + stepNumber + "-" + substepNumber; // Example: substep-2-1
  var tableLineItem = '<tr id="row-' + substepCode + '">';
  tableLineItem += '<td id="' + substepCode + '" class="st-substep-col borderTD">' + substepName + '</td>';
  tableLineItem += '<td ><input type="text" id="details-' + substepCode + '" class="form-control input-sm" placeholder="Sub-Step Details" /></td>';

  tableLineItem += '<td><input type="text" id="action-' + substepCode + '" class="form-control input-sm" placeholder="Sub-Step Action" /></td>';
  if (substepNumber == 1) {
    tableLineItem += '<td class="borderTD"><a id="addButton-' + substepCode + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a>&nbsp;&nbsp;</td>';
  } else {
    tableLineItem += '<td class="borderTD"><a id="addButton-' + substepCode + '" class="btn btn-small leafLogo"><i class="fa fa-plus"></i></a>&nbsp;&nbsp;<a id="delButton-' + substepCode + '" class="btn btn-small leafLogo"><i class="fa fa-minus minus"></i></a></td>';
  }
  tableLineItem += '</tr>';

  //$('#table-' + stepNumber + ' tr:last').after(tableLineItem);
  $("#row-substep-" + stepNumber + "-" + currentSubstepNumber).after(tableLineItem);

}

function hookUpAddDelButtons() {
  for(var i = 0; i < 10; i++) {
    if(!("#addButton-substep-" + i + "-1").length == 0) {

      // Hook steps up.
      $("#addButton-" + i).unbind("click"); // Make sure it's clear, otherwise it appends
      $("#addButton-" + i).click(function() {
        addStep(this.id.split("-")[1]);
        hookUpAddDelButtons();
      }); // Hook add button

      $("#delButton-" + i).unbind("click"); // Make sure it's clear, otherwise it appends
      $("#delButton-" + i).click(function() {
        var trToDelete = "row-" + (this.id).split("-")[1];
        $("#" +trToDelete).remove();
        stepOrder.splice(stepOrder.indexOf(parseInt((this.id).split("-")[1])), 1); // Delete from stepOrder
        // Delete all substeps for substepOrder
        for (var n = 0; n < 5; n++) { // Should change this to just stop when value doens't exist
          var valToDel = (this.id.split("-")[1])+ "," + n;
          //console.log("Deleting: " + valToDel);
          //console.log("Does " + valToDel + " exist? " + substepOrder.indexOf((this.id.split("-")[1])+ "," + n));
          if (substepOrder.indexOf((this.id.split("-")[1])+ "," + n) != -1) {
            console.log("Deleting: " + valToDel);
            substepOrder.splice(substepOrder.indexOf((this.id.split("-")[1])+ "," + n), 1);
          }
        }
        console.log("-----");
        for (var o = 0; o < substepOrder.length; o++) {
          console.log("Substep Order: " + substepOrder[o]);
        }
        console.log("-----");
      }); // Hook del button

      // Hook substeps up.
      for(var j = 0; j < 10; j++) {
        if(!("#addButton-substep-" + i + "-1").length == 0) {
          $("#addButton-substep-" + i + "-" + j).unbind("click"); // Make sure it's clear, otherwise it appends
          $("#addButton-substep-" + i + "-" + j).click(function() {
            addSubStep(this.id.split("-")[2], this.id.split("-")[3]);
            hookUpAddDelButtons();
          }); // Hook add button

          $("#delButton-substep-" + i + "-" + j).unbind("click"); // Make sure it's clear, otherwise it appends
          $("#delButton-substep-" + i + "-" + j).click(function() {
            var trToDelete = "row-" + (this.id).split("-")[1] + "-" + (this.id).split("-")[2] + "-" + (this.id).split("-")[3];
            $("#" +trToDelete).remove();
            console.log("deleting: " + (this.id.split("-")[2])+ "," + (this.id).split("-")[3]);
            substepOrder.splice(substepOrder.indexOf((this.id.split("-")[2])+ "," + (this.id).split("-")[3]), 1);
          }); // Hook del button
        }
      }

    }
  }
}

function findStepQuantity() {
  // Cycle through every step and find how many there are total row-' + stepNumber
  var totalSteps = 0;
  for(var i = 0; i < 50; i++) {
    if($("#row-" + i).length) {
      totalSteps++;
    }
  }
  return totalSteps;
}

function hookUpInputValidation() {

  staticFields.forEach(function(entry) {
    $("#" + entry).on('input', function() {
      //if($("#" + this.id).val() == "") {
        $("#" + this.id).css("border", "1px solid #ccc");
        //$("#errorMessage").html("");
    //  }
    });
  });

  for (var i = 0; i < 50; i++) {
    for (var j = 0; j < 50; j++) {
      $("#action-substep-" + i + "-" + j).on('input', function() {
        if($("#" + this.id).val() == "") {
          $("#" + this.id).css("border", "1px solid #ccc");
          //$("#errorMessage").html("");
        } else {

          //$("#errorMessage").html("");
          if ($("#" + this.id).val().indexOf(";;;") != -1) {
            //$("#errorMessage").html("ERROR: Steps cannot contain the ';' character.");
            $("#" + this.id).css("border", "1px solid red");
            return;
          } else if ($("#" + this.id).val().indexOf("|||") != -1) {
            //$("#errorMessage").html("ERROR: Steps cannot contain the '|' character.");
            $("#" + this.id).css("border", "1px solid red");
            return;
          } else if ($("#" + this.id).val().indexOf(",,,") != -1) {
            //$("#errorMessage").html("ERROR: Steps cannot contain the '|' character.");
            $("#" + this.id).css("border", "1px solid red");
            return;
          } else {
            $("#" + this.id).css("border", "1px solid #ccc");
          }
        }
      });

      $("#details-substep-" + i + "-" + j).on('input', function() {
        if($("#" + this.id).val() == "") {
          $("#" + this.id).css("border", "1px solid #ccc");
          //$("#errorMessage").html("");
        } else {

          //$("#errorMessage").html("");
          if ($("#" + this.id).val().indexOf(";;;") != -1) {
            //$("#errorMessage").html("ERROR: Steps cannot contain the ';' character.");
            $("#" + this.id).css("border", "1px solid red");
            return;
          } else if ($("#" + this.id).val().indexOf("|||") != -1) {
            //$("#errorMessage").html("ERROR: Steps cannot contain the '|' character.");
            $("#" + this.id).css("border", "1px solid red");
            return;
          } else if ($("#" + this.id).val().indexOf(",,,") != -1) {
            //$("#errorMessage").html("ERROR: Steps cannot contain the '|' character.");
            $("#" + this.id).css("border", "1px solid red");
            return;
          } else {
            $("#" + this.id).css("border", "1px solid #ccc");
          }
        }
      });

    }
  }
}

function exportFlightplan() {

  // We set these and base off of them because we due to adding/removing of steps/substeps by user in weird ways, the actual element could be out of order.
  var stepNumber = 1;
  var substepNumber = 1;

  var validated = 1;
  var stepsString = "";

  staticFields.forEach(function(entry) {
    if ($("#" + entry).val() == "") {
      validated = 0;
      $("#errorMessage").html("ERROR: Cannot have empty steps.");
      $("#" + entry).css("border", "1px solid red");
    }
  });

  // Check for a place to put the step
  //for(var i = 1; i < 50; i++) {
  stepOrder.forEach(function(i) {
    if($("#row-" + i).length) { // If step exists
      stepNumber++;
      substepNumber = 1;

      //console.log("Launcher: " + $("#stepLauncher-1").val());
      // stepLauncher-# stepTitle-#

      if ($("#stepTitle-" + i).length) {
        if($("#stepTitle-" + i).val() == "") {
          $("#errorMessage").html("ERROR: Cannot have empty step titles.");
          $("#stepTitle-" + i).css("border", "1px solid red");
          validated = 0;
          return;
        }
        //($("#" + this.id).val().indexOf(";;;") != -1)
        //if (cleanOfSemicolons.test( $("#stepTitle-" + i).val() ) == false) {
        if ($("#stepTitle-" + i).val().indexOf(";;;") != -1) {
          $("#errorMessage").html("ERROR: Steps cannot contain the string ';;;'.");
          validated = 0;
        } else if ($("#stepTitle-" + i).val().indexOf("|||") != -1) {
          $("#errorMessage").html("ERROR: Steps cannot contain the string '|||'.");
          validated = 0;
        } else if ($("#stepTitle-" + i).val().indexOf(",,,") != -1) {
          $("#errorMessage").html("ERROR: Steps cannot contain the string ',,,'.");
          validated = 0;
        } else if (beginsWith($("#stepTitle-" + i).val(), ";") || endsWith($("#stepTitle-" + i).val(), ";"))  {
          $("#errorMessage").html("ERROR: Steps cannot begin or end with the ';' character.");
          validated = 0;
        } else if (beginsWith($("#stepTitle-" + i).val(), "|") || endsWith($("#stepTitle-" + i).val(), "|"))  {
          $("#errorMessage").html("ERROR: Steps cannot begin or end with the '|' character.");
          validated = 0;
        } else if (beginsWith($("#stepTitle-" + i).val(), ",") || endsWith($("#stepTitle-" + i).val(), ","))  {
          $("#errorMessage").html("ERROR: Steps cannot begin or end with the ',' character.");
          validated = 0;
        } else {
          stepsString += $("#stepTitle-" + i).val() + ',,,';
        }
      }

      if ($("#stepLauncher-" + i).length) {
        if ($("#stepLauncher-" + i).val() == "") {
          //$("#errorMessage").html("ERROR: Cannot have empty step launcher.");
          stepsString += "noLauncher|";
        //} else if (cleanOfSemicolons.test( $("#stepLauncher-" + i).val() ) == false) {
        } else if ($("#stepLauncher-" + i).val().indexOf(";;;") != -1) {
          $("#errorMessage").html("ERROR: Launcher cannot contain the string ';;;'.");
          validated = 0;
        } else if ($("#stepLauncher-" + i).val().indexOf("|||") != -1) {
          $("#errorMessage").html("ERROR: Launcher cannot contain the string '|||'.");
          validated = 0;
        } else if ($("#stepLauncher-" + i).val().indexOf(",,,") != -1) {
          $("#errorMessage").html("ERROR: Launcher cannot contain the string ',,,'.");
          validated = 0;
        } else if (beginsWith($("#stepLauncher-" + i).val(), ";") || endsWith($("#stepLauncher-" + i).val(), ";"))  {
          $("#errorMessage").html("ERROR: Launcher cannot begin or end with the ';' character.");
          validated = 0;
        } else if (beginsWith($("#stepLauncher-" + i).val(), "|") || endsWith($("#stepLauncher-" + i).val(), "|"))  {
          $("#errorMessage").html("ERROR: Launcher cannot begin or end with the '|' character.");
          validated = 0;
        } else if (beginsWith($("#stepLauncher-" + i).val(), ",") || endsWith($("#stepLauncher-" + i).val(), ","))  {
          $("#errorMessage").html("ERROR: Launcher cannot begin or end with the ',' character.");
          validated = 0;
        } else {
          stepsString += $("#stepLauncher-" + i).val() + '|||';
        }
      }

      for (var o = 0; o < substepOrder.length; o++) {
        if (substepOrder[o].split(",")[0] == i) {
          console.log("Substep parsing: " + substepOrder[o]);
          j = substepOrder[o].split(",")[1];

          if ($("#row-substep-" + i + "-" + j).length) {
            if($("#details-substep-" + i + "-" + j).val() == "") {
              $("#errorMessage").html("ERROR: Cannot have empty steps.");
              $("#details-substep-" + i + "-" + j).css("border", "1px solid red");
              validated = 0;
              return;
            }
            if($("#action-substep-" + i + "-" + j).val() == "") {
              $("#errorMessage").html("ERROR: Cannot have empty steps.");
              $("#action-substep-" + i + "-" + j).css("border", "1px solid red");
              validated = 0;
              return;
            }
            if ($("#details-substep-" + i + "-" + j).val().indexOf(";;;") != -1) {
              $("#errorMessage").html("ERROR: Steps cannot contain the string ';;;'.");
              validated = 0;
            } else if ($("#details-substep-" + i + "-" + j).val().indexOf("|||") != -1) {
              $("#errorMessage").html("ERROR: Steps cannot contain the string '|||'.");
              validated = 0;
            } else if ($("#details-substep-" + i + "-" + j).val().indexOf(",,,") != -1) {
              $("#errorMessage").html("ERROR: Steps cannot contain the string ',,,'.");
              validated = 0;
            } else if (beginsWith($("#details-substep-" + i + "-" + j).val(), ";") || endsWith($("#details-substep-" + i + "-" + j).val(), ";"))  {
              $("#errorMessage").html("ERROR: Steps cannot begin or end with the ';' character.");
              validated = 0;
            } else if (beginsWith($("#details-substep-" + i + "-" + j).val(), "|") || endsWith($("#details-substep-" + i + "-" + j).val(), "|"))  {
              $("#errorMessage").html("ERROR: Steps cannot begin or end with the '|' character.");
              validated = 0;
            } else if (beginsWith($("#details-substep-" + i + "-" + j).val(), ",") || endsWith($("#details-substep-" + i + "-" + j).val(), ","))  {
              $("#errorMessage").html("ERROR: Steps cannot begin or end with the ',' character.");
              validated = 0;
            }

            if ($("#action-substep-" + i + "-" + j).val().indexOf(";;;") != -1) {
              $("#errorMessage").html("ERROR: Steps cannot contain the string ';;;'.");
              validated = 0;
            } else if ($("#action-substep-" + i + "-" + j).val().indexOf("|||") != -1) {
              $("#errorMessage").html("ERROR: Steps cannot contain the string '|||'.");
              validated = 0;
            } else if ($("#action-substep-" + i + "-" + j).val().indexOf(",,,") != -1) {
              $("#errorMessage").html("ERROR: Steps cannot contain the string ',,,'.");
              validated = 0;
            } else if (beginsWith($("#action-substep-" + i + "-" + j).val(), ";") || endsWith($("#action-substep-" + i + "-" + j).val(), ";"))  {
              $("#errorMessage").html("ERROR: Steps cannot begin or end with the ';' character.");
              validated = 0;
            } else if (beginsWith($("#action-substep-" + i + "-" + j).val(), "|") || endsWith($("#action-substep-" + i + "-" + j).val(), "|"))  {
              $("#errorMessage").html("ERROR: Steps cannot begin or end with the '|' character.");
              validated = 0;
            } else if (beginsWith($("#action-substep-" + i + "-" + j).val(), ",") || endsWith($("#action-substep-" + i + "-" + j).val(), ","))  {
              $("#errorMessage").html("ERROR: Steps cannot begin or end with the ',' character.");
              validated = 0;
            }

            stepsString += substepNumber + ",,," + $("#details-substep-" + i + "-" + j).val() + ",,," + $("#action-substep-" + i + "-" + j).val() + "|||";
            //console.log(substepNumber + " Details: " + $("#details-substep-" + i + "-" + j).val() );
            //console.log(substepNumber + " Action:" + $("#action-substep-" + i + "-" + j).val() );
            substepNumber++;
          }

        }
      }
      stepsString = stepsString.slice(0, -3); // Slice off the last |
      stepsString += ";;;";
    }
  });

  stepsString = stepsString.slice(0, -3); // Slice off the last ;



  if(validated) {
    console.log("Title: " + $("#title").val());
    console.log("Author: " + $("#author").val());
    console.log("Description: " + $("#description").val());
    console.log("Product: " + $("#product").val());
    console.log("Category: " + $("#category").val());
    console.log("Revision: " + $("#revision").val());
    console.log("Steps: " + stepsString);

    // Insert code to actually post to API
    //var flightplanId = $('input:text[name=patchId]').val();
    var titlePost = $("#title").val();
    var authorPost = $("#author").val();
    var revisionPost = $("#revision").val();
    var categoryPost = $("#category").val();
    var productPost = $("#product").val();
    var descriptionPost = $("#description").val();
    //var outcome = $('input:text[name=patchOutcome]').val();
    var stepsPost = stepsString;

    // Begin validation code

    //var cleanInput = new RegExp("^[^;]+$");
    //console.log("validate: " + cleanInput.test('abc1;23') ); // Returns true if it is clean, and false if it is unclean

    // End validation code

    var flightplanPost = {};

    if (titlePost !== "") {
      flightplanPost["title"] = titlePost;
    }
    if (authorPost !== "") {
      flightplanPost["author"] = authorPost;
    }
    if (revisionPost !== "") {
      flightplanPost["revision"] = revisionPost;
    }
    if (categoryPost !== "") {
      flightplanPost["category"] = categoryPost;
    }
    if (productPost !== "") {
      flightplanPost["product"] = productPost;
    }
    if (descriptionPost !== "") {
      flightplanPost["description"] = descriptionPost;
    }
    if (stepsPost !== "") {
      flightplanPost["steps"] = stepsPost;
    }

    helper.post("/api/flightplan/", flightplanPost)
    location.reload();
  } else {
    console.log("Form invald.");
  }

}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function beginsWith(str, suffix) {
    return (str.substr(0, suffix.length) == suffix);
}

function init () {
  currentTimestamp();

  createStep(1);

  $('#importExistingDiv').hide();

  // Enable tooltips after all the steps are processed.
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('#myModal').modal('show');

    helper.get("/api/getUserInfo")
      .then(function(data) {
        $("#username").text(data[0]["username"]);
      });

  });

  $("#createFlightplan").click(function() {
    exportFlightplan();
  }); // Hook clicking Create FlightPlan

  $("#createNewFP").click(function() {
    $('#myModal').modal('hide');
  });

  $("#loadExistingFP").click(function() {
    $('#myModal').modal('hide');
    $('#createNewDiv').hide();
    $('#importExistingDiv').show();
  });

  hookUpAddDelButtons(); // Cycle through every step and substep created and hook them up.
  hookUpInputValidation();

}
