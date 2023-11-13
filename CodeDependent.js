

function webTesting() {
  var test = getCountries('North America');
  Logger.log(`getCountries('North America'): ${test}`);
}

function doGet(e) {
  var htmlOutput = HtmlService.createTemplateFromFile('DependentSelect');
  var colors = getContinents();
  htmlOutput.message = '';
  htmlOutput.colors = colors;
  return htmlOutput.evaluate();
}

function doPost(e) {

  Logger.log(JSON.stringify(e));

  var name = e.parameters.name.toString();
  var color = e.parameters.color.toString();
  var fruit = e.parameters.fruit.toString();

  AddRecord(name, color, fruit);

  var htmlOutput = HtmlService.createTemplateFromFile('DependentSelect');
  var colors = getContinents();
  htmlOutput.message = 'Record Added';
  htmlOutput.colors = colors;
  return htmlOutput.evaluate();

}

//function getColors() { 
function getContinents() {
  var continentValues = get2ndDimensionValues(sheetData, 0);
  continentValues = [...new Set(continentValues)];

  return continentValues;
}

//function getFruits(color) { 
function getCountries(continentValue) {
  let contryValues = filterBy(0, sheetData, continentValue); //continent
  //  contryValues(thisFormItem, continentValues)
  contryValues = get2ndDimensionValues(contryValues, 1);
  contryValues = [...new Set(contryValues)];
  return contryValues
}

function AddRecord(name, color, fruit) {
  var url = 'https://docs.google.com/spreadsheets/d/1v8dCxh6MFM9huUkTbqfSX9anSnqNoQ3WZ_DApLMODLo/';   //URL OF GOOGLE SHEET;
  var ss = SpreadsheetApp.openByUrl(url);
  var dataSheet = ss.getSheetByName("html-responses");
  dataSheet.appendRow([name, color, fruit, new Date()]);
}

function getUrl() {
  var url = ScriptApp.getService().getUrl();
  Logger.log(`URL: ${url}`);
  return url;
}
