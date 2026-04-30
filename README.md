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

## Step 2: Get the Lunch Database Spreadsheet

This repo includes a pre-built spreadsheet (`LunchAgentDataBase.xlsx`) with the correct column structure and sample meal data. Get your own editable copy using one of the options below.

### Option A: Download from GitHub and Upload to Drive *(Recommended)*

1. In this repository, click on **`LunchAgentDataBase.xlsx`** in the file list
2. Click the **Download raw file** button (the ↓ icon on the right side of the toolbar) — the file saves to your computer
3. Go to [drive.google.com](https://drive.google.com) and sign in
4. Click **New > File upload** and select the `LunchAgentDataBase.xlsx` you downloaded
5. Once uploaded, right-click the file and choose **Open with > Google Sheets** — this converts it to a native Google Sheet
6. Then Click File -> Save as Google Sheet
7. Confirm the file is named `LunchAgentDataBase` (no `.xlsx` extension) and has two tabs: **Sheet1** and **Ingredients**

> 💡 **Tip:** After opening with Google Sheets, a separate Sheets version is created. You can delete the original `.xlsx` upload from Drive — the Sheets version is what the scripts use.

### Option B: Import Directly (Advanced)

1. In Google Drive, click **New > Google Sheets** to create a blank sheet
2. Click **File > Import**
3. Select the **Upload** tab and drag in the `LunchAgentDataBase.xlsx` file
4. Choose **Replace spreadsheet** and click **Import data**
5. Rename the file to `LunchAgentDataBase` if needed

### ✅ Verify the Spreadsheet Structure

The scripts depend on these exact column positions — confirm before continuing:

**Sheet1 tab** (your meal list):

| Column | Content |
|--------|---------|
| A | Category (e.g. `Rice Options`, `Quick Bites`) |
| B | Main Dish — **this is what gets emailed daily** |
| C | Fruit / Snack |
| D | Afternoon Treat |

**Ingredients tab** (your pantry staples):

| Column | Content |
|--------|---------|
| Row 1 | Header row (e.g. `#`, `Ingredient`) |
| B | Ingredient names — one per row |

> 💡 **Customize:** Feel free to add your own meals to Sheet1. Just make sure Column A does not end with the word `Options` unless it's a category header — the script uses that to skip headers.

---

## Step 3: Get Your Gemini AI API Key

Your scripts use the Gemini AI API (free tier). You need an API key.

1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in
2. Click **"Get API key"** in the left sidebar
3. Click **"Create API key in new project"** (top-left)
4. Name the key: `LunchGenerator` | Project name: `LunchGenerator`
5. Click **Create** and copy your API key — you'll paste it into the script later

> ⚠️ **Keep your API key private.** Do not share it or commit it to GitHub.

---

## Step 4: Open the Apps Script Editor

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

## Step 5: Add the Script Files

Copy each script from this repository into your Apps Script project.

### Script A — Daily Lunch Email Generator

**File:** [`DailyLunchGenerator.gs`](./DailyLunchGenerator.gs)

1. In Apps Script, click **"+" > Script** and name it exactly: `DailyLunchGenerator.gs`
2. Copy the code from [`DailyLunchGenerator.gs`](./DailyLunchGenerator.gs) and paste it in
3. Find line ~9 and replace the placeholder with your sheet tab name:
   ```javascript
   // Before:
   var sheet = ss.getSheetByName("****Add Sheet Name ***");

   // After:
   var sheet = ss.getSheetByName("Sheet1");
   ```
4. Find line ~35 and insert your email address:
   ```javascript
   // Before:
   var emailRecipient = "**** INSERT YOUR EMAIL *****";

   // After:
   var emailRecipient = "you@gmail.com";
   ```
5. Click 💾 **Save**, then click **Run**. Accept the permissions dialog when prompted.

> ⚠️ **Important:** The script reads columns B, C, and D. It skips rows where Column B is empty and rows where Column A contains the word `Options`. Make sure your data rows are populated correctly.

---

### Script B — Weekly Grocery List Generator

**File:** [`GroceryList.gs`](./GroceryList.gs)

1. Click **"+" > Script** and name it: `GroceryList.gs`
2. Copy the code from [`GroceryList.gs`](./GroceryList.gs) and paste it in
3. On line 7, paste your Gemini API key:
   ```javascript
   const GEMINI_API_KEY = "*** INSERT YOUR KEY HERE *****";
   ```
4. On line 8, set the recipient email:
   ```javascript
   const RECIPIENT_EMAIL = "*** INSERT EMAIL ***";
   ```
5. Confirm your spreadsheet has both **Sheet1** and **Ingredients** tabs — or edit the `getSheetByName()` calls to match your tab names
6. Click **Save**, then click **Run**

> ℹ️ **How it works:** The script calls the **Gemini 2.5 Flash** model (`gemini-2.5-flash`). It reads your Ingredients sheet and asks AI for a trending nut-free snack to include in the weekly email.

---

### Bonus Script — Photo / Receipt Lunch Agent

**File:** [`PhotoLunchGenerator.gs`](./PhotoLunchGenerator.gs)

1. Click **"+" > Script** and name it: `PhotoLunchGenerator.gs`
2. Copy the code from [`PhotoLunchGenerator.gs`](./PhotoLunchGenerator.gs) and paste it in
3. Set your **Google Drive Folder ID** (the folder where you'll upload fridge or receipt photos)
4. Set the **recipient email address**
5. Click **Save**, then click **Run**

> 💡 **What it does:** The Photo Agent inspects the latest image in your Drive folder. If it detects a **fridge photo**, it suggests 3 high-protein kid-friendly lunches. If it detects a **grocery receipt**, it compares items against your spreadsheet favorites.

---

## Step 6: Set Up Automated Triggers

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
I want to build a Google Sheet for a family lunch planner.
Create a table with these columns: Category, Main Dish, Fruit/Snack, Afternoon Treat.
Populate it with 15 rows of healthy, kid-friendly lunches across categories:
Rice Options, Pasta/Western, and Quick Bites.
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
| `appscript.json` | Manifest file — restricts script permissions to required scopes |
| `LunchAgentDataBase.xlsx` | Starter spreadsheet with sample meal data |

---

*Built with ❤️ using Google Apps Script and Gemini AI*
