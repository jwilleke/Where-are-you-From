



function xdoGet(e) {
  var htmlOutput =  HtmlService.createTemplateFromFile('DependentSelect');
  var colors = getColors();
  htmlOutput.message = '';
  htmlOutput.colors = colors;
  return htmlOutput.evaluate();
}

function xdoPost(e) {
  
  Logger.log(JSON.stringify(e));
  
  var name = e.parameters.name.toString();
  var color = e.parameters.color.toString();
  var fruit = e.parameters.fruit.toString();
  
  AddRecord(name, color, fruit);
  
  var htmlOutput =  HtmlService.createTemplateFromFile('DependentSelect');
  var colors = getColors();
  htmlOutput.message = 'Record Added';
  htmlOutput.colors = colors;
  return htmlOutput.evaluate(); 
  
}

function xgetColors() { 
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var lovSheet = ss.getSheetByName("LOV"); 
  var getLastRow = lovSheet.getLastRow();
  var return_array = [];
  for(var i = 2; i <= getLastRow; i++)
  {
      if(return_array.indexOf(lovSheet.getRange(i, 1).getValue()) === -1) {
        return_array.push(lovSheet.getRange(i, 1).getValue());
      }
  }


  return return_array;  
}

function xgetFruits(color) { 
  var ss= SpreadsheetApp.getActiveSpreadsheet();
  var lovSheet = ss.getSheetByName("LOV"); 
  var getLastRow = lovSheet.getLastRow();
  var return_array = [];
  for(var i = 2; i <= getLastRow; i++)
  {
      if(lovSheet.getRange(i, 1).getValue() === color) {
        return_array.push(lovSheet.getRange(i, 2).getValue());
      }
  }


  return return_array;  
}

function xAddRecord(name, color, fruit) {
  var url = '';   //URL OF GOOGLE SHEET;
  var ss= SpreadsheetApp.openByUrl(url);
  var dataSheet = ss.getSheetByName("DATA");
  dataSheet.appendRow([name, color, fruit, new Date()]);
}

function xgetUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}
