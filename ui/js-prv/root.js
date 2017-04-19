window.onload = init;

// Global variables
var numOfColumns = 0;
var displayOption = "category";
var myChart = null;


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
  var savedFlightplans = 0;
  var completedFlightplans = 0;


  // Find out how many saved flightplans per ID exist
  helper.get("/api/inflight/")
    .then(function(data){
      var inflight = data;
      var inflightEntry = "";
      var savedInflight = "";

      for (var i = 0; i < data.length; i++) {
        var nodesToDisplay = ["_id", "referencedFlightplan", "user", "notes"];
        if (inflight[i]["referencedFlightplan"] == id) {
          if (inflight[i]["completed"] == false) {
            savedFlightplans++;
          } else if (inflight[i]["completed"] == true) {
            completedFlightplans++;
          }
        }
      }

      if (!(savedFlightplans == 0 && completedFlightplans == 0 && title.includes("Historical"))) {
        if ( ($("#" + category).length == 0) ) { // Create new section if category doesn't exist

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

          var table = $('<table id="' + category + '-table"></table>').addClass('table table-bordered table-striped sp-databox-table-sm dashboardTable');
          var body = $('<tbody>');
          table.append(body);
          if (savedFlightplans == 0 && completedFlightplans == 0) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a></td></tr>';
          } else if (savedFlightplans >= 1 && completedFlightplans == 0) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a> <a href="/flightplan?id=' + id + '&load=inflight"><span class="badge">' + savedFlightplans + '</span></a></td></tr>';
          }
          else if (savedFlightplans == 0 && completedFlightplans >= 1) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a> <a href="/flightplan?id=' + id + '&load=completed"><span class="badge badge-success savedBadge">' + completedFlightplans + '</span></a></td></tr>';
          } else if (savedFlightplans >= 1 && completedFlightplans >= 1) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a> <a href="/flightplan?id=' + id + '&load=inflight"><span class="badge">' + savedFlightplans + '</span></a>&nbsp;<a href="/flightplan?id=' + id + '&load=completed"><span class="badge badge-success savedBadge">' + completedFlightplans + '</span></a></td></tr>';
          }
          table.append(tableLineItem);
          var tableEnd = $('</tbody>');
          table.append(tableEnd);
          $("#" + category).append(table);
        } else { // Add to section if it already exists
          if (savedFlightplans == 0 && completedFlightplans == 0) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a></td></tr>';
          } else if (savedFlightplans >= 1 && completedFlightplans == 0) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a> <a href="/flightplan?id=' + id + '&load=inflight"><span class="badge">' + savedFlightplans + '</span></a></td></tr>';
          }
          else if (savedFlightplans == 0 && completedFlightplans >= 1) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a> <a href="/flightplan?id=' + id + '&load=completed"><span class="badge badge-success savedBadge">' + completedFlightplans + '</span></a></td></tr>';
          } else if (savedFlightplans >= 1 && completedFlightplans >= 1) {
            var tableLineItem = '<tr><td><a href="/flightplan?id=' + id + '">' + title + '</a> <a href="/flightplan?id=' + id + '&load=inflight"><span class="badge">' + savedFlightplans + '</span></a>&nbsp;<a href="/flightplan?id=' + id + '&load=completed"><span class="badge badge-success savedBadge">' + completedFlightplans + '</span></a></td></tr>';
          }
          $('#' + category + '-table tr:last').after(tableLineItem);
          $('#' + category + '-table tr:last').trigger("update");
        }

        populateChart();
      }


    });

}

function populateInprogress() {

  helper.get("/api/inflight/")
    .then(function(data){
      var inflight = data;
      // We only want to clear the table if something is found, so track that.
      var clearedInprogressLoads = 0;


      for (var i = 0; i < data.length; i++) {
        if (inflight[i]["completed"] == false) {
          if (clearedInprogressLoads == 0) {
            // Clear old loads
            $('#inflightTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
            clearedInprogressLoads++;
          }
          var nodesToDisplay = ["referencedFlightplan", "title", "user", "lastChecked"];
          var rowToAdd = "<tr>";
          for (var j = 0; j < nodesToDisplay.length; j++) {
            if (nodesToDisplay[j] == "lastChecked") {
              if (inflight[i][nodesToDisplay[j]] == undefined) {
                rowToAdd += "<td>" + "1-1" + "</td>";
              } else {
                rowToAdd += "<td>" + inflight[i][nodesToDisplay[j]].split("-")[2] + "-" + inflight[i][nodesToDisplay[j]].split("-")[3] + "</td>";
              }
            } else if (nodesToDisplay[j] == "referencedFlightplan") {
              rowToAdd += '<td id="inprog-' + inflight[i][nodesToDisplay[j]] + "-" + inflight[i]["title"]  + '" class="referencedFlightplan">' + inflight[i][nodesToDisplay[j]] + '</td>';
            } else {
              rowToAdd += "<td>" + inflight[i][nodesToDisplay[j]] + "</td>";
            }
          }
          rowToAdd += "</tr>";
          $('#inflightTable tr:last').after(rowToAdd);
        }
      }
      $('#inflightTable').trigger("update");

      convertReferenceToTitle();
    });

}

function populateCompleted() {

  helper.get("/api/inflight/")
    .then(function(data){
      var inflight = data;
      var completedEntriesAdded = 0;
      var clearedCompletedLoads = 0;

      for (var i = 0; i < data.length; i++) {
        if(completedEntriesAdded >= 3) {
          break;
        }
        if (inflight[i]["completed"] == true) {
          if (clearedCompletedLoads == 0) {
            // Clear old loads
            $('#completedTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
            clearedCompletedLoads++;
          }
          var nodesToDisplay = ["referencedFlightplan", "title", "user", "saveDate"];
          var rowToAdd = "<tr>";
          for (var j = 0; j < nodesToDisplay.length; j++) {
            if (nodesToDisplay[j] == "referencedFlightplan") {
              rowToAdd += '<td id="comp-' + inflight[i][nodesToDisplay[j]] + '-' + inflight[i]["title"] + '" class="referencedFlightplan">' + inflight[i][nodesToDisplay[j]] + '</td>';
            } else {
              rowToAdd += "<td>" + inflight[i][nodesToDisplay[j]] + "</td>";
            }
          }
          rowToAdd += "</tr>";
          $('#completedTable tr:last').after(rowToAdd);
          completedEntriesAdded++;
        }
      }
      $('#completedTable').trigger("update");

      convertReferenceToTitle();
    });

}

// We grab referencedFlightplan IDs and want to convert all of them to Titles for readability
function convertReferenceToTitle() {
  // Re-process all entries and convert the referencedFlightplan ID to its Title
  $("td[class^='referencedFlightplan']").each(function () {
    var trId = $(this).html();
    helper.get("/api/flightplan/")
      .then(function(data){
        var flightplan = data;
        for (var i = 0; i < data.length; i++) {
          if (flightplan[i]["_id"] == trId) {
            $( 'td:contains(' + trId + ')').html(flightplan[i]["title"]);
          }
        }
      });

  });
}

function populateChart() {
  var newColumns = [];
  var rowCount = [];

  $("div[id^='section-']").each(function () {
    var categoryName = this.id.split("-")[1];
    newColumns.push(categoryName);
    rowCount.push($('#' + categoryName + '-table tr').length);
   });

  var chartLabels = newColumns;
  var ctx = $("#myChart");

  // Destroy the chart if it already exists. If we dont destroy it first, it breaks when adding over.
  if(myChart != null) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
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

        if (sortOption == "category") {
          parseFlightplans(data[i]._id, data[i].title, data[i].category);
        } else {
          parseFlightplans(data[i]._id, data[i].title, data[i].product);
        }
      }
    });
}

function createChart(itemName, chartName) {
  helper.get("/api/flightplan/")
    .then(function(data){
      var items = [];
      var flightPlansPerItem = [];

      for (var i = 0; i < data.length; i++) {
        var item = data[i][itemName];
        var itemLoc = items.indexOf(item);

        if (itemLoc != -1) {
          flightPlansPerItem[itemLoc]++;
        } else {
          items.push(item);
          flightPlansPerItem.push(1);
        }

      }

      var ctx2 = document.getElementById(chartName).getContext('2d');
      var myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: items,
          datasets: [{
            backgroundColor: [
              "#9b59b6",
              "#e74c3c",
              "#34495e",
              "#2ecc71",
              "#3498db",
              "#95a5a6",
              "#f1c40f",
            ],
            data: flightPlansPerItem
          }]
        }
      });

    });
}

function init () {
  currentTimestamp();
  populateFlightplans(displayOption);


  $(document).ready(function(){ // Enable tooltips after all the steps are processed.

    $('#inflightTable').tablesorter();

    populateInprogress();
    populateCompleted();

    // FlightPlans by Product
    createChart("product", "myChart2");

    $("#helpBtn").click(function() {
      introguide.start();
    });

    $("#categoryRadio").click(function() {
      populateFlightplans("category");
    });

    $("#productRadio").click(function() {
      populateFlightplans("product");
    });

    $('[data-toggle="tooltip"]').tooltip();

    var introguide = introJs();

    introguide.setOptions({
      exitOnEsc: false,
      exitOnOverlayClick: false,
      steps: [
            {
              intro: 'Welcome! This guided tour will demonstrate how to use Eucalyptus Dashboard.',
              position: 'right-bottom'
            },
            {
              intro: 'Eucalyptus is a simple solution to help with complex processes.<br><br>The idea is to use a FlightPlan every time you take off with a task. Just like pilots have flightplans to help them remember the gazillion steps they must do, now you will too!',
              position: 'bottom'
            },
            {
              element: '#categorySection',
              intro: 'To take off, simply click a FlightPlan and a new instance will be created for you to track your progress and takes notes.',
              position: 'top'
            },
            {
              element: '#categorySection',
              intro: 'Interruptions happen during flights!<br><br>If you get interrupted while in a FlightPlan, you can save and return. Saved flights are shown in gray bubbles.',
              position: 'top'
            },
            {
              element: '#categorySection',
              intro: 'Sometimes you or a co-pilot need to remember what happened during a flight!<br><br>When done with a flight, save it so your Flight notes can be visible later. Green bubbles show Completed Flights.',
              position: 'top'
            },
            {
              element: '#toggleFlightPlan',
              intro: 'How FlightPlans are categorized can be toggled between Category or Product.',
              position: 'bottom'
            },
            {
              element: '.fa-home',
              intro: 'Need to get back here?<br><br>Simply select \"<i class="fa fa-home">\"</i> to get back.',
              position: 'bottom'
            },
            {
              element: '.fa-plus',
              intro: 'Want to create your own FlightPlan for other pilots to use?<br><br>Select \"<i class="fa fa-plus">\"</i> to go to the FlightPlan Builder.',
              position: 'bottom'
            },
            {
              element: '.fa-question',
              intro: 'Need more training before taking off?<br><br>Select \"<i class="fa fa-question">\"</i> for more help.',
              position: 'bottom'
            },
            {
              element: '.fa-user',
              intro: 'If need to go to your User Profile, Admin Portal, or Logout, select the \"<i class="fa fa-user">\"</i> dropdown for more options.',
              position: 'bottom'
            },
            {
              intro: 'Thanks for viewing the walkthrough!<br><br>Have fun creating and using FlightPlans to make your operational processes simpler!',
              position: 'bottom'
            }
      ],
      tooltipClass: 'customDefault'
    });

    /*
    helper.get("/api/getUserInfo")
      .then(function(data) {
        $("#username").text(data[0]["name"]);

        if(data[0]["walkthroughDashboard"] == true) {
          introguide.start();

          var userPatch = {};
          userPatch["walkthroughDashboard"] = false;
          helper.patch("/users/" + data[0]["id"], userPatch);
        }
      });
    */

  });
}
