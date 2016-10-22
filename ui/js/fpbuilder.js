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

function createStep(stepNumber) {

  var newDivHTML = '<div class="row"><div class="col-sm-12"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">Step ' + stepNumber + '</div><div id="' + stepNumber + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div></div>';
  $("#stepsSection").append(newDivHTML);

  var table = $('<table></table>').addClass('table table-bordered table-striped sp-databox-table');;
  var head = $('<thead><tr><td>Sub-Step</td><td>Details</td><td>Action</td></tr></thead>');
  var body = $('<tbody>');
  table.append(head);
  table.append(body);

  var substepNumber = 1;

  var tableLineItem = createSubStep(stepNumber, substepNumber);
  tableLineItem += createSubStep(stepNumber, 2);
  tableLineItem += createSubStep(stepNumber, 3);

  table.append(tableLineItem);

  var tableEnd = $('</tbody>');
  table.append(tableEnd);

  $("#" + stepNumber).append(table);

}

function createSubStep(stepNumber, substepNumber) {
  var substepName = "A";
  var substepCode = "substep-" + stepNumber + "-" + substepNumber; // Example: substep-2-1
  var tableLineItem = '<tr id="row-' + substepCode + '">';
  tableLineItem += '<td id="' + substepCode + '" class="st-substep-col">' + substepName + '</td>';
  tableLineItem += '<td><input type="text" id="details-' + substepCode + '" class="form-control input-sm" placeholder="Sub-Step Details" /></td>';
  tableLineItem += '<td><input type="text" id="action-' + substepCode + '" class="form-control input-sm" placeholder="Sub-Step Action" /></td>';
  tableLineItem += '</tr>';
  return tableLineItem;
}

function init () {
  currentTimestamp();

  var steps=2;
  var substeps=3;
  createStep(1);
  createStep(2);
  // Enable tooltips after all the steps are processed.
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
  });

  $("#generateReport").click(function(){ window.print(); }); // Hook clicking Generate Completion Report button into printing the page
}
