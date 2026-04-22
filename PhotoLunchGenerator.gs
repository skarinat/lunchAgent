const GEMINI_API_KEY = " *** INSERT YOUR KEY HERE *****";
function onEdit(e) {
  const range = e.range;
  // Only run if the edited cell is E1 and it's checked (true)
  if (range.getA1Notation() === "E1" && range.getValue() === true) {
    runLunchAgent(); // Call your agent
    range.setValue(false); // Uncheck it automatically for next time
  }
}
function runLunchAgent() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Sheet1");
  const folderId = " *** INSERT YOUR FOLDER ID HERE **** ";
  
  // 1. Get Spreadsheet Data (Context)
  // We grab the display values to see exactly what you've typed
  const sheetData = sheet.getDataRange().getDisplayValues();
  const mealInventory = JSON.stringify(sheetData);

  // 2. Get the most recent fridge photo
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  
  if (!files.hasNext()) {
    Logger.log("No images found in the fridge folder.");
    return;
  }
  
  const file = files.next();
  const blob = file.getBlob();
  const base64Image = Utilities.base64Encode(blob.getBytes());

  // 3. Construct the prompt with Spreadsheet context
  const modelId = "gemini-3-flash-preview"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `You are a helpful Lunch Agent. I am providing you with two things:
    1. A list of our favorite lunch meals and ingredients from my spreadsheet: ${mealInventory}
    2. A photo of my current fridge contents.
    
    TASK: 
    - Identify what ingredients are visible in the photo.
    - Compare these ingredients to the meal list from the spreadsheet.
    - Suggest 3 high-protein lunch ideas (with a focus on Indian finger foods) that I can ACTUALLY make right now based on what you see in the fridge.
    - Keep it safe for a 4-year-old and a 6-year-old.
    - If I am missing one key ingredient for a spreadsheet meal but have the rest, let me know!`;

  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: "image/jpeg", data: base64Image } }
      ]
    }]
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  // 4. Execute and Email
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  
  if (response.getResponseCode() === 200) {
    const aiResponse = result.candidates[0].content.parts[0].text;
    MailApp.sendEmail("rohunni23@gmail.com", "Lunch Agent: Fridge vs. Spreadsheet Analysis", aiResponse);
  } else {
    Logger.log("Error: " + response.getContentText());
  }
}
