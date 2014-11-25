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
 * @fileoverview A very simple demo showing how easy it is to visualize
 * GA data in the Google Visualization API. In this demo we show the
 * top 10 tracked pages tiles and page URIs by pageviews in a
 * Gviz Table, Pie Chart and Column Chart.
 */

var myService;
var dataTable;
var sourceTable;
var sourceChart;
var sourceColumnChart;
var scope = 'https://www.google.com/analytics/feeds';

/**
 * Initialize all the objects from the Google AJAX Apis once they
 *     have been loaded and are ready to use.
 */
function init() {
  myService =
      new google.gdata.analytics.AnalyticsService('gaExportAPI_gViz_v1.0');
  sourceTable =
      new google.visualization.Table(document.getElementById('sourceTableDiv'));
  sourceChart =
      new google.visualization.PieChart(document.getElementById('sourceChartDiv'));
  sourceColumnChart =
      new google.visualization.ColumnChart(document.getElementById('sourceColumnChartDiv'));

  getStatus();
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
 * AuthSub Authentication to allow users to grant this script
 *     access to their GA data.
 */
function login() {
  google.accounts.user.login(scope);
  getStatus();
}

/**
 * AuthSub Authentication to allow users to remove this script
 *     access to their GA data.
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
    '&dimensions=ga:pageTitle,ga:pagePath' +
    '&metrics=ga:pageviews' +
    '&sort=-ga:pageviews' +
    '&max-results=10' +
    '&ids=ga:' + document.getElementById('inputProfileId').value;

  myService.getDataFeed(myFeedUri, handleMyDataFeed, handleError);
}

/**
 * Handle and display any error that occurs from the API request.
 * @param {Object} e The error object returned by the Analytics API.
 */
function handleError(e) {
  var msg = e.cause ? e.cause.statusText : e.message;
  msg = 'ERROR: ' + msg;
  alert(msg);
}

/**
 * Handle all the data returned by GA Export API.
 * Delete existing GViz dataTable before creating a new one.
 * @param {Object} myResultsFeedRoot the feed object
 *     retuned by the data feed.
 */
function handleMyDataFeed(myResultsFeedRoot) {
  dataTable = new google.visualization.DataTable();
  fillDataTable(dataTable, myResultsFeedRoot);
  sourceTable.draw(dataTable);

  // remove the URI column to only graph 1 dimension
  dataTable.removeColumn(0);
  sourceChart.draw(dataTable, {width: 500, height: 400, is3D: true});
  sourceColumnChart.draw(dataTable, {width: 500, height: 300, is3D: true, title: 'Company Performance'});
}

/**
 * Put the feed result into a GViz Data Table.
 * @param {Object} dataTable the GViz dataTable object to put data into.
 * @param {Object} myResultsFeedRoot the feed returned by the GA Export API.
 * @return {Objcet} GViz DataTable object.
 */
function fillDataTable(dataTable, myResultsFeedRoot) {
  var entries = myResultsFeedRoot.feed.getEntries();

  dataTable.addColumn('string', 'Page Title');
  dataTable.addColumn('string', 'Page Uri Path');
  dataTable.addColumn('number', 'Pageviews');

  if (entries.length == 0) {
    dataTable.addRows(1);
    dataTable.setCell(0, 0, 'No Data');
    dataTable.setCell(0, 1, 0);
  } else {
    dataTable.addRows(entries.length);
    for (var idx = 0; idx < entries.length; idx++) {
      var entry = entries[idx];
      var title = entry.getValueOf('ga:pageTitle');
      var keyword = entry.getValueOf('ga:pagePath');
      var visits = entry.getValueOf('ga:pageviews');
      dataTable.setCell(idx, 0, title);
      dataTable.setCell(idx, 1, keyword);
      dataTable.setCell(idx, 2, visits);
    }
  }
}

// Load the Google Visualization API client Libraries
google.load('visualization', '1', {packages: ['piechart', 'table', 'columnchart']});

// Load the Google data JavaScript client library
google.load('gdata', '1.x');

google.setOnLoadCallback(init);
