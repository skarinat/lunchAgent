# 🥗 Lunch Agent — Automated Lunch Planner with Google Apps Script & Gemini AI

> **Workshop Guide v2** — Build a smart daily lunch planner that picks a meal, generates a grocery list using AI, and emails it to you automatically.

---

## 📋 Overview

This workshop automates the daily *"What's for lunch?"* dilemma using **Google Sheets** and **Google Apps Script**. You will build a system that:

- 🎲 **Selects** a meal from your custom list
- 🤖 **Analyzes** the meal using Gemini AI to create a mobile-friendly grocery list
- 📧 **Delivers** the suggestion via a daily email to your inbox

---

## ✅ Prerequisites

- A Google Account (Gmail) — use a test or secondary account for this workshop
- Basic familiarity with Google Sheets is helpful but not required

> 💡 **New to Google?** Create a free account at [accounts.google.com/signup](https://accounts.google.com/signup)

---

## Step 1: Connect to Wi-Fi

Connect to the workshop guest Wi-Fi (or your personal hotspot) before proceeding.

---

## Step 2: Create Your Lunch Database Using Gemini AI

Instead of downloading a file, you will use **Gemini AI** to generate your lunch database and export it directly into a Google Sheet in one step. No file uploads or downloads needed.

### 2a — Open Gemini

Go to [gemini.google.com](https://gemini.google.com) and sign in with your Google account.

### 2b — Copy and run this prompt

Copy the entire prompt below, paste it into Gemini, and press **Enter**:

```
Role: You are a meal planning and logistics assistant.

Task: Generate a comprehensive nut-free, high-protein lunch plan and export it
as a Google Spreadsheet with two tabs.

Tab 1 — Name it exactly: Sheet1
Columns: Category | Main Dish | Fruit / Snack | Afternoon Treat
Content: 20 unique kid-friendly lunch ideas.
Category must be one of: Rice & Grains, Pasta & Western, Sandwiches & Wraps,
Indian & Asian, Soups & Salads, Quick Bites.

Tab 2 — Name it exactly: Ingredients
Columns: # | Ingredient
Content: All ingredients needed for the above meals, one per row, numbered from 1.

CRITICAL RULES:
1. Strictly nut-free — no peanuts, tree nuts, or nut-based sauces.
2. Every main dish must include a clear protein source
   (chicken, eggs, paneer, tofu, tuna, beans, cheese, or lentils).
3. Fruit / Snack must be a fresh fruit or raw vegetable only.
4. Afternoon Treat must be a packaged snack under 150 calories
   (granola bar, yogurt cup, rice cake, fruit pouch, oat cookie, rice crispy bar).
5. Export directly as a Google Spreadsheet using the Export to Sheets button.
6. Name the file exactly: LunchAgentDataBase
7. Name the Tab 1 — Name it exactly: Sheet1
8. Tab 2 — Name it exactly: Ingredients
9. Ingredient should be in Tab 2
```

### 2c — Export to Google Sheets

Once Gemini generates the data:

1. Look for the **Google Sheets icon** or **"Export to Sheets"** button at the top-right of the Gemini response table
2. Click it — Gemini will create the spreadsheet directly in your Google Drive and open it automatically

> 💡 **Don't see the Export button?** Click the **3-dot menu (⋮)** on the Gemini response and select **"Export to Google Sheets"**. If Gemini shows the data as plain text instead of a table, type `"Show this as a table"` and try the export button again.

### 2d — Rename and verify the file

1. Once the sheet opens, confirm the filename at the top reads **`LunchAgentDataBase`**
2. If not, click the filename and rename it
3. Confirm you have exactly two tabs at the bottom: **`Sheet1`** and **`Ingredients`**

### ✅ Verify the Spreadsheet Structure

The scripts depend on these exact column positions — confirm before continuing:

**Sheet1 tab** (your meal list):

| Column | Content |
|--------|---------|
| A | Category (e.g. `Rice & Grains`, `Quick Bites`) |
| B | Main Dish — **this is what gets emailed daily** |
| C | Fruit / Snack |
| D | Afternoon Treat |

**Ingredients tab** (your pantry staples):

| Column | Content |
|--------|---------|
| A | Row number (`#`) |
| B | Ingredient name — one per row |

> ⚠️ **If the columns are in the wrong order**, drag the column headers in Sheets to match the structure above before moving to Step 3. The scripts read by column position, not by header name.

### 2e — Troubleshooting: Only One Tab?

If Gemini exported everything into a single tab instead of two, your meal data and ingredients list are stacked in the same sheet. Fix it in a few steps:

1. Scroll down in your sheet until you find the **Ingredients table** — it will start with a `#` and `Ingredient` header row below your meal data
2. Click the row number of the `#` header to select that entire row, then hold **Shift** and click the last row of ingredients to select all ingredient rows
3. Right-click the selection and choose **Cut**
4. At the bottom of the screen, click the **"+"** icon to add a new tab
5. Double-click the new tab name and rename it to exactly: `Ingredients`
6. Click cell **A1** in the new Ingredients tab and press **Ctrl+V** (or **Cmd+V** on Mac) to paste
7. Go back to **Sheet1** and confirm it now contains only the meal rows with no leftover ingredient data below

> 💡 **Quick check:** Sheet1 should have 4 columns (Category, Main Dish, Fruit / Snack, Afternoon Treat). The Ingredients tab should have 2 columns (# and Ingredient). If either tab has extra blank rows at the bottom left over from the cut, select them and press **Delete** to clear them.

> 💡 **Want to add more meals later?** Run `generateMealsWithAI()` from `Setup.gs` — it calls Gemini automatically and appends new meals directly to your sheet without any copy-pasting.

---

## Step 3: Open the Apps Script Editor

Google Apps Script is the free, cloud-based scripting platform built into Google Workspace — no installs required.

1. Open your `LunchAgentDataBase` Google Sheet
2. Click **Extensions > Apps Script** — a new browser tab opens
3. Click **"Untitled project"** at the top-left and rename it to: `LunchAgent_Workshop`
4. In the left sidebar, click the **"+"** icon and select **Script** to add a new script file

> 💡 Each `.gs` file in the project is a separate script. You will create two (or three) files below.

---

## Security First: Configure the App Manifest

The `appsscript.json` manifest controls which Google services your script can access. Restricting permissions is good practice.

1. Click the **⚙️ gear icon** (Project Settings) in the left sidebar
2. Check the box: **"Show 'appsscript.json' manifest file in editor"**
3. Go back to the Editor view (the `< >` brackets icon)
4. Click on **`appsscript.json`** in the file list
5. Replace its contents with the manifest from this repo: [`appscript.json`](./appscript.json)

> 💡 The manifest restricts your script to only the scopes it needs: Gmail sending, Sheets access, and Drive reading.

---

## Step 4: Add the Script Files

Copy each script from this repository into your Apps Script project.

### Script A — Daily Lunch Email Generator

**File:** [`DailyLunchGenerator.gs`](./DailyLunchGenerator.gs)

1. In Apps Script, click **"+" > Script** and name it exactly: `DailyLunchGenerator.gs`
2. Copy the code from [`DailyLunchGenerator.gs`](./DailyLunchGenerator.gs) and paste it in
3. Find line ~35 and insert your email address:
   ```javascript
   // Before:
   var emailRecipient = "**** INSERT YOUR EMAIL *****";

   // After:
   var emailRecipient = "you@gmail.com";
   ```
4. Click 💾 **Save**, then click **Run**. Accept the permissions dialog when prompted.

> ⚠️ **Important:** The script reads columns B, C, and D. It skips rows where Column B is empty and rows where Column A contains the word `Options`. Make sure your data rows are populated correctly.

---

### Script B — Weekly Grocery List Generator

**File:** [`GroceryList.gs`](./GroceryList.gs)

1. Click **"+" > Script** and name it: `GroceryList.gs`
2. Copy the code from [`GroceryList.gs`](./GroceryList.gs) and paste it in
3. **Get your Gemini API key** — you need this before you can fill in the next line:
   1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in with your Google account
   2. Click **"Get API key"** in the left sidebar
   3. Click **"Create API key in new project"** (top-left)
   4. Name the key: `LunchGenerator` | Project name: `LunchGenerator`
   5. Click **Create**, then click the **Copy** icon next to your new key

   > ⚠️ **Keep your API key private.** Do not share it or commit it to GitHub.

4. Back in Apps Script, on line 7, paste your copied API key:
   ```javascript
   const GEMINI_API_KEY = "*** INSERT YOUR KEY HERE *****";
   ```
5. On line 8, set the recipient email:
   ```javascript
   const RECIPIENT_EMAIL = "*** INSERT EMAIL ***";
   ```
6. Confirm your spreadsheet has both **Sheet1** and **Ingredients** tabs — or edit the `getSheetByName()` calls to match your tab names
7. Click **Save**, then click **Run**

> ℹ️ **How it works:** The script calls the **Gemini 2.5 Flash** model (`gemini-2.5-flash`). It reads your Ingredients sheet and asks AI for a trending nut-free snack to include in the weekly email.

---

### Bonus Script — Photo / Receipt Lunch Agent

**File:** [`PhotoLunchGenerator.gs`](./PhotoLunchGenerator.gs)

1. Click **"+" > Script** and name it: `PhotoLunchGenerator.gs`
2. Copy the code from [`PhotoLunchGenerator.gs`](./PhotoLunchGenerator.gs) and paste it in
3. **Get your Google Drive Folder ID** — this is the folder where you will upload fridge or receipt photos for the agent to analyse:
   1. Go to [drive.google.com](https://drive.google.com) and sign in
   2. Click **New > New folder**, name it `LunchAgentPhotos`, and click **Create**
   3. Open the folder by double-clicking it
   4. Look at the browser address bar — the URL will look like this:
      ```
      https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J
      ```
   5. Copy the long string of letters and numbers at the very end — that is your **Folder ID** (e.g. `1A2B3C4D5E6F7G8H9I0J`)
4. Back in Apps Script, on **line 12**, replace the placeholder with your Folder ID:
   ```javascript
   // Before:
   var folderId = "*** INSERT YOUR FOLDER ID HERE ***";

   // After:
   var folderId = "1A2B3C4D5E6F7G8H9I0J"; // ← paste your actual Folder ID here
   ```
5. Set the **recipient email address** on the email line:
   ```javascript
   var emailRecipient = "you@gmail.com";
   ```
6. Click 💾 **Save**, then click **Run**

> 💡 **How to use it:** Upload a photo of your fridge or a grocery receipt into your `LunchAgentPhotos` folder in Google Drive, then run the script. If it detects a **fridge photo**, it suggests 3 high-protein kid-friendly lunches. If it detects a **grocery receipt**, it compares items against your spreadsheet favorites.

> 💡 **Tip:** You can upload photos directly from your phone — open Google Drive on your phone, navigate to the `LunchAgentPhotos` folder, and tap **"+"** to upload from your camera roll.

---

## Step 5: Set Up Automated Triggers

Triggers let your scripts run automatically on a schedule — no manual clicking needed.

1. In your Apps Script project, click the **⏰ Triggers icon** in the left sidebar
2. Click **+ Add Trigger** (bottom-right)
3. Configure the trigger:

   | Setting | Value |
   |---------|-------|
   | Function to run | `sendDailyLunchEmail` (daily) or `sendWeeklyPrepEmail` (weekly) |
   | Event source | Time-driven |
   | Type | Day timer (daily) or Week timer (weekly) |
   | Time of day | 8am – 9am |

4. Click **Save**

> 💡 Google may ask you to re-authorize permissions when saving a trigger. Click **Review Permissions** and allow.

---

## 🎉 Conclusion

You now have a functional AI-powered Lunch Agent! It reads your meal database, picks a random lunch, and emails it to your family every morning — automatically.

**Ways to extend it:**
- Add more meal categories or dietary filters to your spreadsheet
- Send to multiple recipients (comma-separate addresses in `emailRecipient`)
- Swap Gemini 2.5 Flash for a different model by updating the model name in the API URL
- Integrate with Google Calendar to avoid repeating the same meal twice in a week

---

## 📎 Appendix: Useful AI Prompts

Use these prompts in [Gemini](https://gemini.google.com) or [ChatGPT](https://chatgpt.com) to generate or extend your scripts.

### 1. Generate Your Spreadsheet Data

```
Role: You are a meal planning and logistics assistant.
Task: Generate a comprehensive nut-free, high-protein meal plan for the week and a structured inventory list.
Requirements:

One Single Google Spreadsheet (File) with Two Specific Tabs:
Tab 1 Name: "Meal Plan"
Structure: Category, Main Dish, Fruit / Snack, Afternoon Treat
Content: 20 unique lunch ideas.
Categories: Rice & Grains, Pasta & Western, Sandwiches & Wraps, Indian & Asian, Soups & Salads, or Quick Bites.
Tab 2 Name: "Inventory"
Structure: Section, Item
Content: All ingredients/items needed for the above meals.
Sections: Produce, Protein, Pantry, Dairy, or Frozen.
CRITICAL:

Strict Output Format: You MUST return one single Google Spreadsheet containing both requested tabs. Do not create two separate files.
No Markdown or Text: Provide only the spreadsheet. No markdown fences, no introductory prose, and no conversational filler.
Dietary Constraints: All meals must be strictly nut-free and prioritize high protein.
```

### 2. Generate the Daily Lunch Script

```
Act as a Senior Google Apps Script developer.
Write a script called sendDailyLunchEmail() that:
- Reads a Google Sheet named 'Sheet1'
- Skips the header row and any row where Column B is empty
- Picks a random valid row
- Emails Column B (Main Dish), Column C (Fruit/Snack), Column D (Afternoon Treat)
  to a configurable email address
- Uses a friendly subject line with today's date
- Includes a try/catch with a helpful error message if anything fails.
```

### 3. Generate the Grocery List from Your Sheet

```
Role: You are a Professional Meal Planning Assistant.

Task:
1. Access the Google Sheet at this link: [INSERT YOUR GOOGLE SHEET URL HERE]
2. Identify the lunch menu items listed in Sheet1.
3. Deconstruct those meals into a consolidated Master Grocery List.
4. Group items into three categories: Produce, Meat/Dairy, and Pantry.
5. Format output as a simple Markdown Table (Columns: Section, Item).

Constraint: Keep the response concise and mobile-friendly for parents shopping on the go.
```

### 4. Photo / Receipt Agent

```
I want to build a Google Apps Script 'Lunch Agent' for my family.
Act as a Senior Software Engineer and write a script with the following requirements:

The script must:
- Get the latest image from a specified Google Drive Folder ID
- Get meal data from the current spreadsheet
- Use Gemini AI to identify if the photo is a Fridge
  (suggest 3 high-protein Indian kid-lunches) or a Receipt
  (list new items vs. spreadsheet favorites)
- Email the results to a configurable address
- Include a friendly error message if the Gemini API call fails
```

---

## 📁 Repository Files

| File | Description |
|------|-------------|
| `DailyLunchGenerator.gs` | Picks a random lunch from your sheet and emails it daily |
| `GroceryList.gs` | Generates a weekly grocery list using Gemini AI |
| `PhotoLunchGenerator.gs` | Analyzes a fridge/receipt photo and suggests lunches |
| `Setup.gs` | Populates your sheet with sample data + AI meal generator |
| `appscript.json` | Manifest file — restricts script permissions to required scopes |
| `LunchAgentDataBase.xlsx` | Starter spreadsheet with sample meal data |

---

*Built with ❤️ using Google Apps Script and Gemini AI*
