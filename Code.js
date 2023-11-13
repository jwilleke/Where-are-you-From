
/**
 * demonstartion on how to populate form questions from a sheet
 * stole some code from  Amit Agarwal (MIT License) and others
*/

const GOOGLE_DATA_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1_5ccwbyCSPJVupW20Ju0K4LKiLlaXNhywIV9oJI02Hs/'; // sheet to fill in form data
const GOOGLE_DATA_SHEET_NAME = 'World-cities'; //<<Put your Google Sheet Name here>>'
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/1nwQvktsJHG1uuGnK3AO4JaLKF0ZJh2eixDzVVnLkG1Q/edit';
const GOOGLE_FORM_ID = '1nwQvktsJHG1uuGnK3AO4JaLKF0ZJh2eixDzVVnLkG1Q'; //<<Put your Google Form ID here>>';
const GOOGLE_DATA_SHEET_NAMED = 'AllCities'; // sheet to fill in form data
let form = FormApp.openByUrl(GOOGLE_FORM_URL);
const ss = SpreadsheetApp.openByUrl(GOOGLE_DATA_SHEET_URL);
// headers is a single Arraya of values from the first line
// sheetData is an Array of row values from every row in sheet
const [headers, ...sheetData] = ss.getSheetByName(GOOGLE_DATA_SHEET_NAME).getDataRange().getDisplayValues(); // @NIFTY breaks headers and sheetData into seperate arrays


function myTestFunction() {
  Logger.log(`headers: ${headers}`);
  Logger.log(`sheetData[3]: ${sheetData[3]}`);
  Logger.log(`sheetData: ${sheetData}`);
}

/**
 * Populates a form with multiple questions based on data from GOOGLE_DATA_SHEET_URL
 * createConditonalForm(form, title, itemType, isRequired, itemValues)
 */
function myFunction() {
  var isRequired = true;
  //const ss = SpreadsheetApp.openByUrl(GOOGLE_DATA_SHEET_URL);
  //const [header, ...sheetData] = ss.getSheetByName(GOOGLE_DATA_SHEET_NAME).getDataRange().getDisplayValues(); // breaks headers and sheetData into seperate arrays
  resetForm(form);
  createStaticFormQuestions(form, "What is your Name?", FormApp.ItemType.PARAGRAPH_TEXT, isRequired, "");
  var continentValues = get2ndDimensionValues(sheetData, 0);
  continentValues = [...new Set(continentValues)];
  createConditonalForm(form, headers[0], FormApp.ItemType.MULTIPLE_CHOICE, isRequired, continentValues);
  Logger.log(` continentValues => Done???`);
  let contryValues = filterBy(0, sheetData, "Asia"); //continent
  //  contryValues(thisFormItem, continentValues)
  contryValues = get2ndDimensionValues(contryValues, 1);
  contryValues = [...new Set(contryValues)];
  createConditonalForm(form, headers[1], FormApp.ItemType.MULTIPLE_CHOICE, isRequired, contryValues);
  Logger.log(` contryValues => Done???`);
  const cityDimenion = 4;
  let cityValues = filterBy(1, sheetData, "Japan"); //continent
  //  contryValues(thisFormItem, continentValues)
  //let bigCityValues = get2ndDimensionValues(cityValues, cityDimenion);
  cityValues = [...new Set(cityValues)];
  Logger.log(`cityValues[${0}] ${cityValues[0]}`);
  if (cityValues.length >= 900) {
    Logger.log(`cityValues has ${cityValues.length} items`);
    // 8 is the dimension in 
    //var citySortedby = sortByNthElementSecondDimension(cityValues, 8);
    //citySortedby = [...new Set(citySortedby)];
    const slicedArray = cityValues.slice(0, 100);
    let finalCityValues = get2ndDimensionValues(slicedArray, cityDimenion);
    Logger.log(`finalCityValues[${0}] ${finalCityValues[0]}`);
    createConditonalForm(form, headers[2], FormApp.ItemType.LIST, isRequired, finalCityValues);
  } else {
    createConditonalForm(form, headers[2], FormApp.ItemType.LIST, isRequired, cityValues);
  }
  Logger.log(` cityValues => Done???`);
}

function getFormData() {
  const ss = SpreadsheetApp.openByUrl(GOOGLE_DATA_SHEET_URL);
  const [header, ...data] = ss.getSheetByName(GOOGLE_DATA_SHEET_NAME).getDataRange().getDisplayValues();

  const choices = {};
  header.forEach((title, i) => {
    choices[title] = data.map((d) => d[i]).filter((e) => e);
  });

  Logger.log(`header: ${header}`);
  const formItems = FormApp.openById(GOOGLE_FORM_ID).getItems();
  formItems.forEach((item) => {
    Logger.log(`item.getTitle() : ${item.getTitle()}`);
    Logger.log(`item.getId() : ${item.getId()}`);
    Logger.log(`item.getType() : ${item.getType()}`);
  });
}

/**
 * Populate a form with string values
 * 
 */
function updateFormValues(item, values) {

  switch (item.getType()) {
    case FormApp.ItemType.CHECKBOX:
      item.asCheckboxItem().setChoiceValues(values);
      break;
    case FormApp.ItemType.LIST:
      item.asListItem().setChoiceValues(values);
      break;
    case FormApp.ItemType.MULTIPLE_CHOICE:
      item.asMultipleChoiceItem().setChoiceValues(values);
      break;
    default:
    // ignore item
  }

}


/**
 * Auto-populate Question options in Google Forms
 * from values in Google Spreadsheet
 *
 * stole some code from  Amit Agarwal (MIT License)
 *
 **/

/**
 * Gets all the values from sheet we are interested in by a named range of:
 * GOOGLE_DATA_SHEET_NAMED
  */
function getStructuredData() {
  const ss = SpreadsheetApp.openByUrl(GOOGLE_DATA_SHEET_URL);
  const sheetData = ss.getRangeByName(GOOGLE_DATA_SHEET_NAMED).getValues();
  return sheetData;
}

/**
 * Filters getStructuredData() by a row number in a Unique array
 */
function filterBy(rowNumber, data, filterBy) {
  let filtered = [];
  for (let item in data) {
    let row = data[item];
    if (row[rowNumber] == filterBy) {
      filtered.push(row)
    }
  }
  filtered = [...new Set(filtered)]; // @NIFTY trick to eliinate duplicates in an array
  //Logger.log(`filterBy:${filterBy} Data: ${data}`)
  return filtered;
}


function createStaticFormQuestions(form, title, itemType, isRequired, itemValues) {
  var itemQuestion = form.addParagraphTextItem();
  itemQuestion.setTitle('What is your Name?');
  itemQuestion.setRequired(isRequired);
}


/**
 * Creates form Items and sets values
 */
function createConditonalForm(form, title, itemType, isRequired, itemValues) {
  switch (itemType) {
    case FormApp.ItemType.CHECKBOX:
      var itemQuestion = form.addCheckboxItem()
      itemQuestion.setTitle(title);
      itemQuestion.setRequired(isRequired);
      itemQuestion.setChoiceValues(itemValues);
      break;
    case FormApp.ItemType.LIST:
      var itemQuestion = form.addListItem();
      itemQuestion.setTitle(title);
      itemQuestion.setRequired(isRequired);
      itemQuestion.setChoiceValues(itemValues);
      break;
    case FormApp.ItemType.MULTIPLE_CHOICE:
      var itemQuestion = form.addMultipleChoiceItem();
      itemQuestion.setTitle(title);
      itemQuestion.setRequired(isRequired);
      itemQuestion.setChoiceValues(itemValues);
      break;
    default:
      Logger.log(`ERROR!==> createConditonalForm ${itemType}`)
  }
}

/**
 * Reset form by deleting all items
 */
function resetForm(form) {
  let items = form.getItems();
  items.forEach(item => form.deleteItem(item))
}
/**
 * gets the pos of the second dimension of an array  
 */
function get2ndDimensionValues(array, pos) {
  // Create a new, empty array to store the values from the 2nd dimension.
  var secondDimensionValues = [];

  // Iterate over the 2nd dimension of the two-dimensional array, and add each value to the new array.
  for (var i = 0; i < array.length; i++) {
    secondDimensionValues.push(array[i][pos]);
  }

  return secondDimensionValues
}

function sortByNthElementSecondDimension(array, nthElementIndex) {
  return array.sort((row1, row2) => {
    return row1[nthElementIndex][1] < row2[nthElementIndex][1] ? -1 : row1[nthElementIndex][1] > row2[nthElementIndex][1] ? 1 : 0;
  });
}

function sort2dArray(array, secondDimention) {
  array.sort(function (x, y) {
    // in this example I used the secondDimention-th column... 
    var compareArgumentA = x[secondDimention];
    var compareArgumentB = y[secondDimention];
    // eventually do something with these 2 variables, for example Number(x[0]) and Number(y[0]) would do the comparison on numeric values of first column in the array (index0) 
    // another example x[0].toLowerCase() and y[0].toLowerCase() would do the comparison without taking care of letterCase...
    Logger.log('compareArgumentA = ' + compareArgumentA + ' and compareArgumentB = ' + compareArgumentB);
    var result = 0;// initialize return value and then do the comparison : 3 cases
    if (compareArgumentA == compareArgumentB) { return result }; // if equal return 0
    if (compareArgumentA < compareArgumentB) { result = -1; return result }; // if A<B return -1 (you can change this of course and invert the sort order)
    if (compareArgumentA > compareArgumentB) { result = 1; return result }; // if a>B return 1
  });
}

/**
 * Fills a form based on data in a sheet
 * Form Titles and Sheets Headers MUST Match
 */
const populateGoogleForms = () => {

  const ss = SpreadsheetApp.openByUrl(GOOGLE_DATA_SHEET_URL);
  const [header, ...data] = ss.getSheetByName(GOOGLE_DATA_SHEET_NAME).getDataRange().getDisplayValues();

  const choices = {};
  header.forEach((title, i) => {
    choices[title] = data.map((d) => d[i]).filter((e) => e);
  });

  FormApp.openById(GOOGLE_FORM_ID)
    .getItems()
    .map((item) => ({
      item,
      values: choices[item.getTitle()],
    }))
    .filter(({ values }) => values)
    .forEach(({ item, values }) => {
      Logger.log(`item.getType(): ${item.getType()}`);
      switch (item.getType()) {
        case FormApp.ItemType.CHECKBOX:
          item.asCheckboxItem().setChoiceValues(values);
          break;
        case FormApp.ItemType.LIST:
          item.asListItem().setChoiceValues(values);
          break;
        case FormApp.ItemType.MULTIPLE_CHOICE:
          item.asMultipleChoiceItem().setChoiceValues(values);
          break;
        default:
        // ignore item
      }
    });
  ss.toast('Google Form Updated !!');
};