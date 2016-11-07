window.onload = init;

// Global variables
var numOfColumns = 0;
var displayOption = "category";

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

function parseFlightplans(id, title, category) {

  if ($("#" + category).length == 0) { // Create new section if category doesn't exist

    // Create new row
    if (numOfColumns % 2 == 0) { // If it's even, time to create a new row
      $("#categorySection").append('<div class="row">');
      numOfColumns++;
    } else {
      numOfColumns++;
    }


    var newDivHTML = '<div id="section-' + category + '" class="col-sm-6"><div class="row"><div class="col-md-12"><div class="panel"><div class="panel-heading sp-databox-panel-heading">' + category + '</div><div id="' + category + '" class="panel-body sp-databox-panel-body"></div></div></div></div></div>';
    $("#categorySection").append(newDivHTML);

    if (numOfColumns % 2 == 0) {
      $("#categorySection").append('</div>');
    }

    var table = $('<table id="' + category + '-table"></table>').addClass('table table-bordered table-striped sp-databox-table');
    var body = $('<tbody>');
    table.append(body);
    var tableLineItem = '<tr><td><a href="/flightplan.html?id=' + id + '">' + title + '</a></td></tr>';
    table.append(tableLineItem);
    var tableEnd = $('</tbody>');
    table.append(tableEnd);

    $("#" + category).append(table);
  } else { // Add to section if it already exists
    var tableLineItem = '<tr><td><a href="/flightplan.html?id=' + id + '">' + title + '</a></td></tr>';
    $('#' + category + '-table tr:last').after(tableLineItem);
    $('#' + category + '-table tr:last').trigger("update");
  }

}

function populateChart() {
  var newColumns = [];
  var rowCount = [];

  $("div[id^='section-']").each(function () {
    var categoryName = this.id.split("-")[1];
    newColumns.push(categoryName);
    rowCount.push($('#' + categoryName + '-table tr').length);
   });

  //var chartLabels = ["Installation", "Configuration", "Manage"];
  var chartLabels = newColumns;
  var ctx = $("#myChart");

  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: chartLabels,
      datasets: [{
        backgroundColor: [
          "#2ecc71",
          "#3498db",
          "#95a5a6",
          "#9b59b6",
          "#f1c40f",
          "#e74c3c",
          "#34495e"
        ],
        //data: [7, 2, 1]
        data: rowCount
      }]
    }
  });

  ctx.click(function (evt) {
     var activePoints = myChart.getElementAtEvent(evt);
     if (activePoints.length > 0) {
         var index = activePoints[0]["_index"];
         window.location.hash = "section-" + chartLabels[index];
     }
   });
}

function populateFlightplans(sortOption) {

  /* Add logic to clear flightplans div */
  $("#categorySection").html("");
  numOfColumns = 0;

  helper.get("/api/flightplan/")
    .then(function(data){
      var categories = [];

      for (var i = 0; i < data.length; i++) {
        //console.log("id: " + data[i]._id);
        //console.log("title: " + data[i].title);
        //console.log("category: " + data[i].category);
        //if(categories.indexOf(data[i].category) == -1) {
        //    categories.push(data[i].category);
        //}
        if (sortOption == "category") {
          parseFlightplans(data[i]._id, data[i].title, data[i].category);
        } else {
          parseFlightplans(data[i]._id, data[i].title, data[i].product);
        }
      }

      populateChart();

    });
}

function init () {
  currentTimestamp();
  /*
  helper.get("/api/flightplan/")
    .then(function(data){
      var categories = [];

      for (var i = 0; i < data.length; i++) {
        //console.log("id: " + data[i]._id);
        //console.log("title: " + data[i].title);
        //console.log("category: " + data[i].category);
        //if(categories.indexOf(data[i].category) == -1) {
        //    categories.push(data[i].category);
        //}
        //parseFlightplans(data[i]._id, data[i].title, data[i].category);
        parseFlightplans(data[i]._id, data[i].title, data[i].product);
      }

      populateChart();

      $("#toggleDisplay").click(function() {
        //Insert logic here
      });
    });
    */
    populateFlightplans(displayOption);


    $(document).ready(function(){ // Enable tooltips after all the steps are processed.

      $("#categoryRadio").click(function() {
        populateFlightplans("category");
      });

      $("#productRadio").click(function() {
        populateFlightplans("product");
      });

      $('[data-toggle="tooltip"]').tooltip();
    });
}
