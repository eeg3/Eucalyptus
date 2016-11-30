window.onload = init;

// Global variables
var stepsComplete = 0;
var invalidInput = 0;
var staticFields = ["title", "description", "category", "author", "product", "revision"];
var formModified = false;
var loadedFlightplan = false;
var loadedFpId = undefined;
var obj;

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

  /*
  console.log("-----");
  for (var o = 0; o < stepOrder.length; o++) {
    console.log("Step Order: " + stepOrder[o]);
  }
  console.log("-----");
  */

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

function addSubStep(stepNumber, substepNumber, details, action) {

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

  /*
  console.log("-----");
  for (var o = 0; o < substepOrder.length; o++) {
    console.log("Substep Order: " + substepOrder[o]);
  }
  console.log("-----");
  */

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




  if (details != undefined) {
    $("#details-" + substepCode).val(details);
    //console.log("setting #details-" + substepCode + " to: " + details);
  }
  if (action != undefined) {
    //console.log("action: " + action);
    $("#action-" + substepCode).val(action);
    //console.log("setting #action-" + substepCode + " to: " + action);
  }


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
        /*
        console.log("-----");
        for (var o = 0; o < substepOrder.length; o++) {
          console.log("Substep Order: " + substepOrder[o]);
        }
        console.log("-----");
        */
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
          //console.log("Substep parsing: " + substepOrder[o]);
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
    if (loadedFlightplan) {
      helper.patch("/api/flightplan/" + loadedFpId, flightplanPost);

    } else {
      helper.post("/api/flightplan/", flightplanPost);
    }
    formModified = false; // Reset this or it will ask if we want to reload after submitting.
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

function getFlightplan(id) {
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

      for (var i = 0; i < data.length; i++) {
        if (flightplan[i]["_id"] == id) {
          displaySummary(id)
          createBoard(flightplan[i]["steps"]);
          hookUpAddDelButtons();
          hookUpInputValidation();
          //parseSteps(flightplan[i]["steps"]);
        }
      }

      //stepQuantity = findTotalStepQuantity();
      //initiateStepFlow(stepQuantity.steps, stepQuantity.substeps);

      // Enable tooltips after all the steps are processed.
      $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
      });
    });

    formModified = false;
}

function displaySummary(id) {

  helper.get("/api/flightplan/")
    .then(function(data){
      var flightplan = data;

      for (var i = 0; i < data.length; i++) {
        if (flightplan[i]["_id"] == id) {
          $("#loadedText").text("Editing: " + flightplan[i]["title"]);
          $("#title").val(flightplan[i]["title"]);
          $("#author").val(flightplan[i]["author"]);
          $("#description").val(flightplan[i]["description"]);
          $("#product").val(flightplan[i]["product"]);
          $("#category").val(flightplan[i]["category"]);
          $("#revision").val(flightplan[i]["revision"]);
        }
      }
    });

}

function createBoard(steps) {
  var steps = steps.split(";;;");
  var numberOfSteps = steps.length;

  for(var i = 1; i <= steps.length; i++) { // i = currentStep
    var substeps = steps[i-1].split("|||");

    if(!(i == steps.length)) {
      addStep(i);
      console.log("adding step #: " + i);
    }

    $("#stepTitle-" + i).val(substeps[0].split(',,,')[0]);
    $("#stepLauncher-" + i).val(substeps[0].split(',,,')[1]);

    for (var j = 1; j < (substeps.length); j++) {
      //console.log("substep [" + i + "," + j + "]: " + substeps[j]);
      var details = substeps[j].split(',,,')[1];
      var action = substeps[j].split(',,,')[2];
      if (j == 1) {
        $("#details-substep-" + i + "-1").val(details);
        $("#action-substep-" + i + "-1").val(action);
      } else {
        addSubStep(i, j-1, details, action);
      }
    }
  }


}

function init () {
  currentTimestamp();

  createStep(1);

  $('#importExistingDiv').hide();

  // Enable tooltips after all the steps are processed.
  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $("#loadSuccessModal").hide();

    if (!(urlParam('id') == undefined)) {
      loadedFlightplan = true;
      loadedFpId = urlParam('id');
      getFlightplan(loadedFpId);
      $("#createFlightplan").html("Update FlightPlan");
    } else {
      $('#myModal').modal('show');
    }

    // We want to track if anything changes so that we can warn the user if they try to exit before saving.
    $('textarea').on('change keyup paste', function() {
      formModified = true;
    });

    helper.get("/api/getUserInfo")
      .then(function(data) {
        $("#username").text(data[0]["username"]);
      });

    // Leave Warning
    window.onbeforeunload = function() {
      if (formModified) {
        return "New information not saved. Do you wish to leave the page?";
      }
    }
    // End Leave Warning

  });

  // We want to track if anything changes so that we can warn the user if they try to exit before saving.
  $('input').on('change keyup paste', function() {
    formModified = true;
  });

  $("#createFlightplan").click(function() {
    exportFlightplan();
  }); // Hook clicking Create FlightPlan

  $("#createNewFP").click(function() {
    $('#myModal').modal('hide');

    var introguide = introJs();

    introguide.setOptions({
      steps: [
            {
              intro: 'We noticed this was your first time using the FlightPlan Builder. This guided tour will demonstrate how to get started creating your own flights for you and other pilots to use.',
              position: 'right-bottom'
            },
            {
              //intro: 'Eucalyptus is a simple solution to help with complex processes. By defining complex processes in simple steps, allowing us to easily start and stop them, and enabling us to document our steps, we lessen the operational burden of new solutions.',
              intro: 'This builder is meant to <b>create templates</b> for future Flights.<br><br>If you meant to actually take a Flight instead, simply go back <i class="fa fa-home"></i> and then select a prepared FlightPlan to get started.',
              position: 'bottom'
            },
            {
              element: '#summaryRow',
              intro: 'First, enter the characteristics of the FlightPlan. These help future pilots understand what the FlightPlan is for.<br><br>In gray, you can see example text for each field.',
              position: 'bottom'
            },
            {
              element: '#stepsSection',
              intro: 'Next up is the steps section, where the magic happens. These are the steps that future pilots will use to navigate the flight.<br><br>These should be as unambiguous as possible, so that anyone can follow them. Do not assume anyone will know start, middle, or ending steps. <b>Make sure to document everything!</b>',
              position: 'top'
            },
            {
              element: '#stepTitle-1',
              intro: 'Each step is a collection of sub-steps that will be executed to accomplish the step\'s goals.<br><br>Enter a title for each step to give the pilot an idea of what will be accomplished through the sub-steps.',
              position: 'top'
            },
            {
              element: '#stepLauncher-1',
              intro: 'This is a step launcher! Put in a URI/URL here that pilots can click if they need to execute the step on another page. The launcher will pop up in a new window when "Launch" is selected.<br><br>Ideally, each step should be accomplished within the launcher location. If a step needs multiple launchers, it should be broken out into multiple steps.',
              position: 'top'
            },
            {
              element: '#row-substep-1-1',
              intro: 'Each substep has a details section and an actions section.<br><br>Details is the high level summary of the substep, and Action is what all happens in the substep.',
              position: 'bottom'
            },
            {
              element: '#addButton-substep-1-1',
              intro: 'Steps are made up of multiple substeps (usually). Click the <i class="fa fa-plus"></i> to add more substeps to the step.',
              position: 'bottom'
            },
            {
              element: '#addButton-1',
              intro: 'FlightPlans are made up of multiple steps. Click the <i class="fa fa-plus"></i> to add more steps.',
              position: 'bottom'
            },
            {
              element: '#createFlightplan',
              intro: 'Done with the FlightPlan (or just ready to save it)? Click \'Create FlightPlan\' to add the FlightPlan to the system.<br><br>Don\'t worry, you can add/edit/delete it later if needed!<br><br>To edit or delete later, simply re-launch the FlightPlan Builder and choose "Modify Existing".',
              position: 'top'
            },
            {
              intro: 'We recommend testing the FlightPlan after creation to make sure it is clear and concise to follow.<br><br>If something is ambiguous, edit the FlightPlan to add more steps or substeps!',
              position: 'bottom'
            },
            {
              intro: 'Thanks for viewing the walkthrough! Have fun creating FlightPlans!',
              position: 'bottom'
            }
      ],
      tooltipClass: 'customDefault'
    });

    introguide.start();

  });

  $("#importExistingFP").click(function() {
    $('#myModal').modal('hide');
    $('#createNewDiv').hide();
    $('#importExistingDiv').show();
  });

  $("#importFlightplan").click(function() {
    alert("Working!");
  }); // Hook clicking Create FlightPlan


  $("#flpUpload").on('change', function() {
    var file = $("#flpUpload").prop('files')[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          obj = JSON.parse(reader.result);


          helper.post("/api/flightplan/", obj);

          /*
          console.log("obj[_id]: " + obj["_id"]);
          console.log("obj[title]: " + obj["title"]);
          console.log("obj[author]: " + obj["author"]);
          console.log("obj[revision]: " + obj["revision"]);
          console.log("obj[category]: " + obj["category"]);
          console.log("obj[product]: " + obj["product"]);
          console.log("obj[description]: " + obj["description"]);
          console.log("obj[steps]: " + obj["steps"]);
          */

          $('#myModal').modal('hide');
          $('#loadSuccessModal').modal('show');
          // End Find

        } catch (e) {
          console.log("Invalid FlightPlan File!");
        }
      }
      reader.readAsText(file);
    } else {
      console.log("Invalid FlightPlan File!");
    }

  });

  $("#viewLoad").click(function() {

    helper.get("/api/flightplan/")
      .then(function(data){
        for (var i = 0; i < data.length; i++) {
          if (data[i]["title"] == obj["title"]) {
            formModified = false;
            window.location.replace("/flightplan?id=" + data[i]["_id"]);
            break;
          }
        }
      });
  });

  $("#editLoad").click(function() {
    $('#loadSuccessModal').modal('hide');
    loadedFlightplan = true;
    $("#createFlightplan").html("Update FlightPlan");
    // Find the new FP ID

    helper.get("/api/flightplan/")
      .then(function(data){
        for (var i = 0; i < data.length; i++) {
          if (data[i]["title"] == obj["title"]) {
            $('#createNewDiv').show();
            $('#importExistingDiv').hide();
            getFlightplan(data[i]["_id"]);
            $("#createFlightplan").html("Update FlightPlan");
            break;
          }
        }
      });
  });

  $("#loadExistingFP").click(function() {
    //window.print();
    //saveFlightplan();
    $('#myModal').modal('hide');

    helper.get("/api/flightplan/")
      .then(function(data) {
        var flightplan = data;

        // Clear old loads
        $('#flightplanListTable tr').not(function(){ return !!$(this).has('th').length; }).remove();

        for (var i = 0; i < data.length; i++) {

          var nodesToDisplay = ["title", "author"];
          var rowToAdd = "<tr>";
          for (var j = 0; j < nodesToDisplay.length; j++) {
            if (nodesToDisplay[j] === "lastCommunication" && flightplan[i][nodesToDisplay[j]] !== "Never") {
            } else {
              rowToAdd += "<td>" + flightplan[i][nodesToDisplay[j]] + "</td>";
            }
          }
          rowToAdd += '<td>';
          rowToAdd += '<button id="open-' + flightplan[i]["_id"] + '" title="Load Saved Progress" type="button" class="btn btn-success btn-xs loadBtn"><i class="fa fa-folder-open-o"></i></button>';
          rowToAdd += '<button id="del-' + flightplan[i]["_id"] + '" title="Delete Saved Progress" type="button" class="btn btn-danger btn-xs deleteBtn"><i class="fa fa-trash-o"></i></button>';
          rowToAdd += '</td>';
          rowToAdd += "</tr>";
          $('#flightplanListTable tr:last').after(rowToAdd);

        }
        $('#flightplanListTable').trigger("update");

        $(".loadBtn").click(function() {
          loadedFlightplan = true;
          $("#createFlightplan").html("Update FlightPlan");
          loadedFpId = (this.id).split("-")[1];
          getFlightplan((this.id).split("-")[1]);
          $('#loadModal').modal('hide');
        });

        $(".deleteBtn").click(function() {
          console.log(this.id);
          console.log( (this.id).split("-")[1] );

          helper.del("/api/flightplan/" + (this.id).split("-")[1]);
          formModified = false; // Reset this or it will ask if we want to reload after submitting.
          $(this).closest('tr').remove();
          //location.reload();
        });

        $('#loadModal').modal('show');

        var introguide = introJs();

        introguide.setOptions({
          steps: [
            {
              intro: 'We noticed this was your first time modifying an existing FlightPlan!<br><br>Here you can edit or delete existing FlightPlans that anyone within your system has created.Please proceed with caution as changes are not recoverable.',
              position: 'right-bottom'
            },
            {
              intro: 'To load a FlightPlan into the Builder, simply select the <i class="fa fa-folder-open-o"></i> button next to the FlightPlan to load it and begin editing.<br><br>To delete a FlightPlan, simply select the <i class="fa fa-trash-o"></i> button next to the FlightPlan to permanently delete it.',
              position: 'right-bottom'
            }
          ],
          tooltipClass: 'customDefault'
        });

        introguide.start();

      });

  });

  hookUpAddDelButtons(); // Cycle through every step and substep created and hook them up.
  hookUpInputValidation();

}
