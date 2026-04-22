# lunchAgent
Build Your Own Automated Lunch Planner Agent

Workshop: Build Your Own Automated Lunch Planner Agent V2

Overview
This workshop is designed to help parents automate the daily "What's for lunch?" dilemma using Google Sheets and Google Apps Script. Participants will create a smart system that randomly selects healthy meal options from their own customized list and delivers a suggestion at the click of a button.
Prerequisites
A Google Account (Gmail). Recommended to use Not so important email account / Test email 
A Google Sheet uploaded to your drive containing lunch categories (e.g., Rice, Pasta, Sandwiches, Tacos) along with ingredients.
Step 1: Preparing Your Lunch Database
First, we need a place to store our meal ideas. Create a Google Sheet with your favorite categories. For example, your spreadsheet might have columns or separate sheets for:

Category
Example Dishes
Rice Options
Chicken Rice, Dal Khichdi, Veggie Fried Rice
Pasta / Western
Mac and Cheese, Veggie Pasta, Pizza Sticks
Quick Bites
Cheese Sandwiches, Quesadillas, Egg Rolls


For Ingredients you could use the below prompt : 
Role: You are a Professional Meal Planning Assistant.
Task: > 1. Access the Google Sheet at this link: [INSERT YOUR GOOGLE SHEET URL HERE] 2. Identify the lunch menu items listed in the primary sheet (usually Sheet1). 3. Deconstruct those meals into a consolidated Master Grocery List. 4. Group the items into three categories: Produce, Meat/Dairy, and Pantry. 5. Format the output as a simple Markdown Table (Columns: Section, Item) so it can be easily copied back into a spreadsheet.
Constraint: Keep the response concise and mobile-friendly for parents shopping on the go.

Step 2: Setting Up Gemini AI (API Key)
To enable advanced features like automated grocery list generation or photo analysis, our agent needs access to Gemini AI. Follow these steps to get your key:
Go to the Google AI Studio (aistudio.google.com). - Use the free tier 
Sign in with your Google account.
Click on the "Get API key" button on the left sidebar.
Select "Create API key in new project."
Copy your API key and keep it safe. You will need to paste this into your script code later.
Step 3: Accessing the Script Editor 
Google App Script : This is completely free to use. You don't need to install any software or manage servers. You just click Extensions > Apps Script in your sheet and start writing. Everything runs on Google's servers in the cloud 
Inside your Google Sheet, navigate to the Extensions menu and select Apps Script. This opens a new tab where we will write the "brain" of our Lunch Agent.
Name Your Project: By default, the project is called "Untitled project." Click on the text "Untitled project" at the top left and rename it to something recognizable, like LunchAgent_Workshop

Step 4: Writing the Generator Script
Replace the default code in the editor with a script that performs the following actions:
Accesses the active spreadsheet.
Target the specific sheet where your lunch list is stored.
Uses a randomization function to pick one item.
// Global constant for your API Key
const GEMINI_API_KEY = "PASTE_YOUR_API_KEY_HERE";

function generateLunchIdea() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("YourSheetName"); // Replace with your sheet name
  var data = sheet.getDataRange().getValues();
  
  var randomIndex = Math.floor(Math.random() * (data.length - 1)) + 1;
  var selection = data[randomIndex][0];
  
  SpreadsheetApp.getUi().alert("Today's Lunch Suggestion: " + selection);
}


Step 5: Creating a Custom Menu
To make the agent easy to use, we will add a button directly to the Google Sheets toolbar. Add this code to your script:
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Lunch Agent')
      .addItem('Pick My Lunch!', 'generateLunchIdea')
      .addToUi();
}


Step 6: Authorizing and Testing
Click the Save icon (floppy disk) and name your project "Lunch Planner Agent".
Refresh your Google Sheet. You should see a new menu item called "Lunch Agent".
Click Lunch Agent > Pick My Lunch!.
Google will ask for permission to run the script. Click "Review Permissions," select your account, and allow access.
Conclusion
You now have a functional AI Agent! By integrating your Gemini API key, you can now expand the script to generate grocery lists based on the ingredients needed for the selected lunch.



