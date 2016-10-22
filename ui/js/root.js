window.onload = init;

// Global variables
var numOfColumns = 0;

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

function parseManifests(id, title, category) {

  // Create new row
  if (numOfColumns % 2 == 0) { // If it's even, time to create a new row
    $("#categorySection").append('<div class="row">');
    numOfColumns++;
  } else {
    numOfColumns++;
  }

  if ($("#" + category).length == 0) { // Create new section if category doesn't exist
    var newDivHTML = '<div class="col-sm-6"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">' + category + '</div><div id="' + category + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div>';
    $("#categorySection").append(newDivHTML);

    if (numOfColumns % 2 == 0) {
      $("#categorySection").append('</div>');
    }

    var table = $('<table id="' + category + 'Table"></table>').addClass('table table-bordered table-striped sp-databox-table');
    var body = $('<tbody>');
    table.append(body);
    var tableLineItem = '<tr><td><a href="/function-api.html?id=' + id + '">' + title + '</a></td></tr>';
    table.append(tableLineItem);
    var tableEnd = $('</tbody>');
    table.append(tableEnd);

    $("#" + category).append(table);
  } else { // Add to section if it already exists
    var tableLineItem = '<tr><td><a href="/function-api.html?id=' + id + '">' + title + '</a></td></tr>';
    $('#' + category + 'Table tr:last').after(tableLineItem);
    $('#' + category + 'Table tr:last').trigger("update");
  }

}

function init () {
  currentTimestamp();

  helper.get("/api/manifest/")
    .then(function(data){
      for (var i = 0; i < data.length; i++) {
        parseManifests(data[i]._id, data[i].title, data[i].category);
      }

      $(document).ready(function(){ // Enable tooltips after all the steps are processed.
        $('[data-toggle="tooltip"]').tooltip();
      });
    });

}
