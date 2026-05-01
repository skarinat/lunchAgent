// 1. GLOBAL SETTINGS
const RECIPIENT_EMAIL = " *** INSERT EMAIL *** ";

function sendDailyLunchEmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  var data = sheet.getDataRange().getDisplayValues();
  
  var today = new Date();
  var dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
  
  // Default values if no data is found
  var mainProtein = "Check Spreadsheet";
  var fruitSnack = "Check Spreadsheet";
  var afternoonTreat = "Check Spreadsheet";
  
  // Logic: Map the day of the week to a row in your spreadsheet
  // We skip header (index 0) and start with Monday as index 1
// This picks a random row, excluding the header (index 0)
// var rowIndex = Math.floor(Math.random() * (data.length - 1)) + 1;

// 1. Filter the data to only include rows that actually have a 'Main Dish' (Column B)
var validRows = data.filter(function(row, index) {
  // Skip header and ensure Column B (index 1) isn't empty and isn't a Category Header
  return index > 0 && row[1] !== "" && !row[0].includes("Options");
});

// 2. Pick a random row from the valid list
var randomSelection = validRows[Math.floor(Math.random() * validRows.length)];

// 3. Assign the values
mainProtein = randomSelection[1]; // Column B
fruitSnack = randomSelection[2];  // Column C
afternoonTreat = randomSelection[3]; // Column D



  //var emailRecipient = "**** INSERT YOUR EMAIL *****";
  var subject = "Daily Lunch Mission: " + Utilities.formatDate(today, Session.getScriptTimeZone(), "EEEE, MMMM d");
  
  var body = "Daily Lunch Mission: " + subject + "\n\n" +
             "High-protein configuration selected for the kids:\n\n" +
             "Main Protein:\n- " + mainProtein + "\n\n" +
             "Fruit Snack:\n- " + fruitSnack + "\n\n" +
             "Afternoon Treat:\n- " + afternoonTreat;

  MailApp.sendEmail(RECIPIENT_EMAIL, subject, body);
}
