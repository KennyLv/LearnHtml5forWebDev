// Copyright 2009 Google Inc. All Rights Reserved.

/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Sample program that highlights how the GA Export API can
 *     be used with the Google Visualization API to store data in a dataTable
 *     as well as visualize the data as Table and PieChart objects.
 */

var myService;
var matchedTable;
var notMatchedTable;
var pieChart;
var dataTable;
var dataViewMatched;
var dataViewNotMatched;
var scope = 'https://www.google.com/analytics/feeds';

/**
 * Initialize all the objects from the Google AJAX Apis once they
 *     have been loaded and are ready to use.
 */
function init() {
  myService =
      new google.gdata.analytics.AnalyticsService('gaExportAPI_gVizBrand_v1.0');
  matchedTable =
      new google.visualization.Table(document.getElementById('matchedTableDiv'));
  notMatchedTable =
      new google.visualization.Table(document.getElementById('notMatchedTableDiv'));
  pieChart =
      new google.visualization.PieChart(document.getElementById('pieChartDiv'));

  setupEnterHandler();
  getStatus();
}

/**
 * Utility function to setup the event handling for pressing enter
 *     on the text matching input.
 */
function setupEnterHandler() {
  document.getElementById('filterInput').onkeydown = function(e) {
    if (e.which == 13) {
      drawViz();
    }
  };
}

/**
 * Utility function to setup the login/logout functionality.
 */
function getStatus() {
  var status = document.getElementById('status');
  var buttonLogin = document.getElementById('buttonLogin');
  var inputP = document.getElementById('inputP');
  buttonLogin.style.visibility = 'visible';

  if (!google.accounts.user.checkLogin(scope)) {
    buttonLogin.value = 'Login';
    buttonLogin.onclick = login;
    status.innerHTML = 'You are logged out, login to continue';
    inputP.style.visibility = 'hidden';
  } else {
    buttonLogin.value = 'Logout';
    buttonLogin.onclick = logout;
    status.innerHTML = 'You are logged in';
    inputP.style.visibility = 'visible';
  }
}

/**
 * AuthSub Authentication to allow user to grant this script
 * access to their GA data.
 */
function login() {
  google.accounts.user.login(scope);
  getStatus();
}

/**
 * AuthSub Authentication to allow user to remove this script
 * access to their GA data.
 */
function logout() {
  google.accounts.user.logout();
  getStatus();
}

/**
 * Request data from GA Export API
 */
function getDataFeed() {
  var myFeedUri = scope + '/data' +
    '?start-date=2008-10-01' +
    '&end-date=2008-10-31' +
    '&dimensions=ga:keyword' +
    '&metrics=ga:visits' +
    '&sort=-ga:visits' +
    '&max-results=50' +
    '&ids=ga:' + document.getElementById('inputProfileId').value;
  myService.getDataFeed(myFeedUri, handleMyDataFeed, handleError);
}

/**
 * Handle and display any error that occurs from the API request.
 * @param {Object} e The error object returned by the Analytics API.
 */
function handleError(e) {
  var error = 'There was an error!\n';
  if (e.cause) {
    error += e.cause.statusText;
  } else {
    error += e.message;
  }
  alert(error);
}

/**
 * Handle all the data returned by GA Export API.
 * Create GViz dataTable and dataViews objects.
 * @param {Object} myResultsFeedRoot the feed object
 *     retuned by the data feed.
 */
function handleMyDataFeed(myResultsFeedRoot) {
  dataTable = new google.visualization.DataTable();
  fillDataTable(dataTable, myResultsFeedRoot);
  dataViewMatched = new google.visualization.DataView(dataTable);
  dataViewNotMatched = new google.visualization.DataView(dataTable);

  drawViz();
}

/**
 * Put the feed result into a GViz Data Table.
 * @param {Object} dataTable the GViz dataTable object to put data into.
 * @param {Object} myResultsFeedRoot the feed returned by the GA Export API.
 */
function fillDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();

  dataTable.addColumn('string', 'Keyword');
  dataTable.addColumn('number', 'Visits');

  if (entries.length == 0) {
    dataTable.addRows(1);
    dataTable.setCell(0, 0, 'No Data');
    dataTable.setCell(0, 1, 0);
  } else {
    dataTable.addRows(entries.length);
    for (var idx = 0; idx < entries.length; idx++) {
      var entry = entries[idx];
      var keyword = entry.getValueOf('ga:keyword');
      var visits = entry.getValueOf('ga:visits');
      dataTable.setCell(idx, 0, keyword);
      dataTable.setCell(idx, 1, visits);
    }
  }
}

/**
 * Handle Visualization of data by drawing all the charts on the page.
 * Put focus on the matching form when done.
 */
function drawViz() {
  var matchedRows = [];
  var notMatchedRows = [];

  var matchedVisits = 0;
  var notMatchedVisits = 0;

  // put indicies of matched and not matched rows into two arrays
  // get matched and unmatched total visits
  for (var idx = 0; idx < dataTable.getNumberOfRows(); idx++) {
    var keyword = dataTable.getValue(idx, 0);
    var visits = dataTable.getValue(idx, 1);

    if (keyword.indexOf('(not set)') == -1) {
      if (isMatchedKeyword(keyword)) {
        matchedRows.push(idx);
        matchedVisits += visits;
      } else {
        notMatchedRows.push(idx);
        notMatchedVisits += visits;
      }
    }
  }

  // draw matched table views
  drawTable(dataViewMatched, matchedRows, matchedTable);
  drawTable(dataViewNotMatched, notMatchedRows, notMatchedTable);

  // draw visits pie chart
  drawChart('Visits of Matched', matchedVisits, notMatchedVisits, pieChart);


  //update the table headers
  document.getElementById('matchedVisitsSpan').innerHTML = matchedVisits;
  document.getElementById('notMatchedVisitsSpan').innerHTML = notMatchedVisits;

  document.getElementById('vizDiv').style.visibility = 'visible';
  document.getElementById('filterInput').focus();
}

/**
 * Draw a filtered GViz Table from Givz DataTable.
 * @param {Object} dataView a GViz DataView object.
 * @param {Array} filteredRows an array holding all the row indicies to show.
 * @param {Object} tableObject the visualization Table Object to display.
 */
function drawTable(dataView, filteredRows, tableObject) {
  dataView.setRows(filteredRows);
  tableObject.draw(dataView, null);
}

/**
 * Draw a pie chart from values passed into this function.
 * @param {String} myTitle the title of this chart.
 * @param {Number} chartValueOne the first value to display.
 * @param {Number} chartValueTwo the second number to display.
 * @param {Object} chartObject the visualization Chart Object to display.
 */
function drawChart(myTitle, chartValueOne, chartValueTwo, chartObject) {
  var label1 = 'Matched';
  var label2 = 'Didn\'t Match';

  // create a GViz DataTable JSON data object.
  chartDataTable = new google.visualization.DataTable({
    cols: [
      {id: 'A', label: 'Type', type: 'string'},
      {id: 'B', label: 'Count of Matched', type: 'number'}],
    rows: [
      {c: [{v: label1}, {v: chartValueOne}]},
      {c: [{v: label2}, {v: chartValueTwo}]}
    ]}, 0.5);

  chartObject.draw(chartDataTable, {width: 300, height: 200, title: myTitle, is3D: true});
}

/**
 * Test if the keyword is matched by the filter using a regualr expression match
 * @param {String} keyword the keyword returned to test.
 * @return {Boolean} true or false.
 */
function isMatchedKeyword(keyword) {
  var filter = document.getElementById('filterInput').value;
  return keyword.match(filter);
}

// Load the Google Visualization API client Libraries
google.load('visualization', '1', {packages: ['piechart', 'table', 'columnchart']});

// Load the Google data JavaScript client library
google.load('gdata', '1.x');

google.setOnLoadCallback(init);