/**
 * LUNCH AI AGENT - MASTER STAPLES VERSION
 * Focus: A weekly consolidated list covering the ENTIRE menu.
 */

// 1. GLOBAL SETTINGS
const GEMINI_API_KEY = " *** INSERT YOUR KEY HERE *****";
//const RECIPIENT_EMAIL = " *** INSERT EMAIL *** ";        

/**
 * Main function: Reads your sheet and adds AI snack research.
 */
function sendWeeklyPrepEmail() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Update these names to match your actual sheet names
  const lunchSheet = ss.getSheetByName("Sheet1");
  const ingredientSheet = ss.getSheetByName("Ingredients"); 
  
  if (!lunchSheet || !ingredientSheet) {
    Logger.log("Error: Missing one or more sheets.");
    showSafeAlert("Error: Make sure 'Sheet 1' and 'Ingredients' sheets exist.");
    return;
  }

  // 1. Pull your manual Ingredients list from the sheet
  // This assumes your ingredients are in Column A of the 'Ingredients' sheet
  const ingredientData = ingredientSheet.getDataRange().getValues();
  
  // Skip the first row (headers) and grab only Column B (the actual ingredients)
  // We use .slice(1) to skip the header and .map(row => row[1]) for the second column
  const myIngredients = ingredientData
    .slice(1) 
    .map(row => row[1]) // Change this to row[0] if your ingredients are in Column A
    .filter(item => item && item.toString().trim() !== "") // Remove empty rows
    .join("\n• "); // Format as a bulleted list for the email
  
  // 2. AI Research for the "Snack of the Week"
  const aiSnackReport = fetchAISnackSuggestion();

  // 3. Compose Email
  const today = Utilities.formatDate(new Date(), "GMT", "MMMM dd, yyyy");
  const subject = `🛒 Weekly Grocery List & AI Snack Spotlight: ${today}`;
  
  const emailBody = `
Hello! Here is your grocery list and this week's special snack discovery.

--------------------------------------------------
📝 YOUR MASTER INGREDIENT LIST:
--------------------------------------------------
${myIngredients}

--------------------------------------------------
🌟 NUT-FREE SNACK SPOTLIGHT:
--------------------------------------------------
${aiSnackReport}

--------------------------------------------------
💡 PRO-TIP: 
Check your pantry for these staples before heading to Trader Joe's or Costco.

Sent by your Lunch AI Agent.
  `;

  // 4. Send the Email & Handle UI
  try {
    MailApp.sendEmail(RECIPIENT_EMAIL, subject, emailBody);
    Logger.log("Email sent successfully!");
    showSafeAlert("Success! Your list and AI snack idea are in your inbox.");
  } catch (e) {
    Logger.log("Email failed: " + e.toString());
    showSafeAlert("Email failed. Check the execution log.");
  }
}

/**
 * Helper: Only shows an alert if the script is run manually.
 */
function showSafeAlert(message) {
  try {
    const ui = SpreadsheetApp.getUi();
    if (ui) { ui.alert(message); }
  } catch (e) {
    Logger.log("Trigger Run: " + message);
  }
}

function fetchAISnackSuggestion() {
  // Updated to the current stable 2.5 model
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const promptText = `
    Find one trending, nut-free kids snack for 2026 at Trader Joe's or Costco.
    Output ONLY the store name in brackets and the product name. 
    Do include the ingredients of the snack 
    Do NOT include descriptions, bullet points, or reasons why.
    Example: [Trader Joe's] Organic Apple Fruit Bars - Ingredients Apple, wheat , Sugar, Honey 
  `;

  const payload = { 
    "contents": [{ "parts": [{ "text": promptText }] }] 
  };
  
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true 
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (statusCode === 200) {
      const json = JSON.parse(responseText);
      return json.candidates[0].content.parts[0].text;
    } else {
      // Log the error but don't break the email
      Logger.log("AI Research failed. Status: " + statusCode + " Response: " + responseText);
      return "No new snack discovery this week. Check back next Sunday!";
    }
    
  } catch (e) {
    return "AI Researcher is offline. Stick to your staples list!";
  }
}
