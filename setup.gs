// ============================================================================
// Setup.gs — LunchAgent Database Setup
// Run setupLunchDatabase() once to populate your spreadsheet.
// Run generateMealsWithAI() to get a prompt that produces more meals
// in the exact right format to paste back into your sheet.
// ============================================================================


// ── STEP 1: Run this first ───────────────────────────────────────────────────
function setupLunchDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();


  // ── Sheet1: Meal List ──────────────────────────────────────────────────────
  var sheet1 = ss.getSheetByName("LunchAgentDataBase") || ss.insertSheet("LunchAgentDataBase");
  sheet1.clearContents();

  var meals = [
    // Header row
    ["Category", "Main Dish", "Fruit / Snack", "Afternoon Treat"],

    // ── Rice & Grains ──────────────────────────────────────────────────────
    ["Rice & Grains",    "Chicken Rice with Steamed Broccoli",   "Apple slices",          "Rice crispy bar"       ],
    ["Rice & Grains",    "Egg Fried Rice",                        "Mandarin orange",       "Yogurt cup"            ],
    ["Rice & Grains",    "Teriyaki Salmon Rice Bowl",             "Grapes",                "Oat cookie"            ],
    ["Rice & Grains",    "Vegetable Biryani",                     "Watermelon cubes",      "Granola bar"           ],
    ["Rice & Grains",    "Chicken Congee",                        "Strawberries",          "Fruit pouch"           ],
    ["Rice & Grains",    "Brown Rice with Stir-fry Tofu",         "Blueberries",           "Rice cake"             ],
    ["Rice & Grains",    "Quinoa Chicken Bowl",                   "Kiwi slices",           "Nut-free energy ball"  ],

    // ── Pasta & Western ───────────────────────────────────────────────────
    ["Pasta & Western",  "Mac and Cheese",                        "Orange wedges",         "Granola bar"           ],
    ["Pasta & Western",  "Spaghetti Bolognese",                   "Cherry tomatoes",       "Yogurt tube"           ],
    ["Pasta & Western",  "Pasta Primavera",                       "Apple slices",          "Oat cookie"            ],
    ["Pasta & Western",  "Baked Ziti with Veggie Sauce",          "Grapes",                "Fruit leather"         ],
    ["Pasta & Western",  "Chicken Pesto Pasta",                   "Cucumber sticks",       "Rice crispy bar"       ],
    ["Pasta & Western",  "Tuna Pasta Salad",                      "Mandarin orange",       "Sunflower seed bar"    ],
    ["Pasta & Western",  "Creamy Mushroom Pasta",                 "Blueberries",           "Granola bar"           ],

    // ── Sandwiches & Wraps ────────────────────────────────────────────────
    ["Sandwiches & Wraps", "Cheese & Veggie Sandwich",            "Banana",                "Fruit pouch"           ],
    ["Sandwiches & Wraps", "Chicken Caesar Wrap",                 "Apple slices",          "Oat cookie"            ],
    ["Sandwiches & Wraps", "Hummus & Roasted Veg Wrap",           "Carrot sticks",         "Granola bar"           ],
    ["Sandwiches & Wraps", "Egg Salad Sandwich",                  "Grapes",                "Rice cake"             ],
    ["Sandwiches & Wraps", "Turkey & Avocado Wrap",               "Cherry tomatoes",       "Yogurt cup"            ],
    ["Sandwiches & Wraps", "Grilled Chicken Sandwich",            "Watermelon cubes",      "Sunflower seed bar"    ],
    ["Sandwiches & Wraps", "BLT Sandwich (Turkey Bacon)",         "Orange wedges",         "Fruit leather"         ],

    // ── Indian & Asian ────────────────────────────────────────────────────
    ["Indian & Asian",   "Dal & Rice",                            "Mango slices",          "Yogurt cup"            ],
    ["Indian & Asian",   "Chicken Tikka with Chapati",            "Apple slices",          "Coconut laddoo"        ],
    ["Indian & Asian",   "Aloo Paratha with Curd",                "Grapes",                "Fruit pouch"           ],
    ["Indian & Asian",   "Paneer Butter Masala with Rice",        "Watermelon cubes",      "Rice cake"             ],
    ["Indian & Asian",   "Idli with Sambar & Coconut Chutney",   "Banana",                "Granola bar"           ],
    ["Indian & Asian",   "Chana Masala with Rice",                "Strawberries",          "Oat cookie"            ],
    ["Indian & Asian",   "Vegetable Fried Rice (Indo-Chinese)",   "Orange wedges",         "Nut-free energy ball"  ],

    // ── Soups & Salads ────────────────────────────────────────────────────
    ["Soups & Salads",   "Chicken Noodle Soup with Bread Roll",  "Apple slices",          "Granola bar"           ],
    ["Soups & Salads",   "Tomato Soup with Grilled Cheese",       "Grapes",                "Yogurt cup"            ],
    ["Soups & Salads",   "Lentil Soup with Pita",                 "Carrot sticks",         "Fruit leather"         ],
    ["Soups & Salads",   "Greek Salad with Grilled Chicken",      "Watermelon cubes",      "Rice crispy bar"       ],
    ["Soups & Salads",   "Minestrone Soup with Bread",            "Blueberries",           "Oat cookie"            ],

    // ── Quick Bites ───────────────────────────────────────────────────────
    ["Quick Bites",      "Cheese Quesadilla",                     "Mango slices",          "Fruit pouch"           ],
    ["Quick Bites",      "Mini Veggie Frittata",                  "Cherry tomatoes",       "Yogurt tube"           ],
    ["Quick Bites",      "Baked Chicken Nuggets with Rice",       "Apple slices",          "Granola bar"           ],
    ["Quick Bites",      "Bean & Cheese Burrito",                 "Orange wedges",         "Rice cake"             ],
    ["Quick Bites",      "Scrambled Eggs on Toast",               "Strawberries",          "Sunflower seed bar"    ],
    ["Quick Bites",      "Veggie Fried Egg Rice",                 "Banana",                "Oat cookie"            ],
  ];

  sheet1.getRange(1, 1, meals.length, 4).setValues(meals);

  // Bold & freeze the header row
  sheet1.getRange(1, 1, 1, 4).setFontWeight("bold");
  sheet1.setFrozenRows(1);
  sheet1.autoResizeColumns(1, 4);


  // ── Ingredients tab ────────────────────────────────────────────────────────
  var ingSheet = ss.getSheetByName("Ingredients") || ss.insertSheet("Ingredients");
  ingSheet.clearContents();

  var ingredients = [
    ["#",  "Ingredient"          ],
    [1,    "Chicken breast"      ],
    [2,    "Eggs"                ],
    [3,    "White rice"          ],
    [4,    "Brown rice"          ],
    [5,    "Pasta (assorted)"    ],
    [6,    "Whole wheat bread"   ],
    [7,    "Whole wheat wraps"   ],
    [8,    "Chapati / Roti"      ],
    [9,    "Cheddar cheese"      ],
    [10,   "Paneer"              ],
    [11,   "Tofu"                ],
    [12,   "Canned tuna"         ],
    [13,   "Canned chickpeas"    ],
    [14,   "Red lentils (dal)"   ],
    [15,   "Hummus"              ],
    [16,   "Tomato pasta sauce"  ],
    [17,   "Coconut milk"        ],
    [18,   "Soy sauce"           ],
    [19,   "Olive oil"           ],
    [20,   "Apple"               ],
    [21,   "Banana"              ],
    [22,   "Grapes"              ],
    [23,   "Strawberries"        ],
    [24,   "Blueberries"         ],
    [25,   "Orange"              ],
    [26,   "Mango"               ],
    [27,   "Watermelon"          ],
    [28,   "Carrot"              ],
    [29,   "Cherry tomatoes"     ],
    [30,   "Cucumber"            ],
    [31,   "Broccoli"            ],
    [32,   "Granola bar"         ],
    [33,   "Rice crispy bar"     ],
    [34,   "Oat cookie"          ],
    [35,   "Yogurt cup"          ],
    [36,   "Fruit pouch"         ],
    [37,   "Rice cake"           ],
    [38,   "Sunflower seed bar"  ],
  ];

  ingSheet.getRange(1, 1, ingredients.length, 2).setValues(ingredients);
  ingSheet.getRange(1, 1, 1, 2).setFontWeight("bold");
  ingSheet.setFrozenRows(1);
  ingSheet.autoResizeColumns(1, 2);


  SpreadsheetApp.getUi().alert(
    "✅ Setup complete!\n\n" +
    "• Sheet1 — " + (meals.length - 1) + " meals across 6 categories\n" +
    "• Ingredients — " + (ingredients.length - 1) + " pantry staples\n\n" +
    "You can now run the other scripts."
  );
}


// ── STEP 2 (Optional): Generate more meals with AI ───────────────────────────
//
// Run this function, copy the prompt from the alert,
// paste it into Gemini or ChatGPT, then paste the result
// back into your Sheet1 tab starting on the next empty row.
//
function generateMealsWithAI() {

  // Read current meals so the AI knows what already exists
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName("Sheet1");
  var data   = sheet.getDataRange().getValues();
  var existing = data.slice(1).map(function(r){ return r[1]; }).filter(Boolean);
  var existingList = existing.join(", ");

  var prompt =
    "You are a meal planning assistant helping parents pack healthy, nut-free school lunches.\n\n" +

    "Generate 20 NEW lunch ideas that DO NOT include any of the following already-existing meals:\n" +
    existingList + "\n\n" +

    "Rules:\n" +
    "1. Meals must be nut-free (no peanuts, tree nuts, or nut-based ingredients).\n" +
    "2. Meals should be high-protein and kid-friendly.\n" +
    "3. Include a mix of cuisines: Indian, Western, Asian, Mediterranean.\n" +
    "4. Each fruit/snack must be a fresh fruit or vegetable — no chips or candy.\n" +
    "5. Each afternoon treat must be a packaged snack under 150 calories " +
       "(e.g. granola bar, yogurt cup, rice cake, fruit pouch, oat cookie).\n\n" +

    "Output format — return ONLY a plain table with exactly these 4 columns, " +
    "no extra text, no markdown fences, no numbering:\n\n" +
    "Category | Main Dish | Fruit / Snack | Afternoon Treat\n\n" +
    "Use one of these categories exactly as written:\n" +
    "Rice & Grains | Pasta & Western | Sandwiches & Wraps | Indian & Asian | Soups & Salads | Quick Bites\n\n" +
    "Example rows:\n" +
    "Rice & Grains | Chicken Rice with Steamed Broccoli | Apple slices | Rice crispy bar\n" +
    "Indian & Asian | Dal & Rice | Mango slices | Yogurt cup\n" +
    "Quick Bites | Cheese Quesadilla | Mango slices | Fruit pouch";

  // Show the prompt in a dialog so the user can copy it
  var ui = SpreadsheetApp.getUi();
  var htmlOutput = HtmlService
    .createHtmlOutput(
      '<p style="font-family:Arial;font-size:13px;">' +
      'Copy the prompt below and paste it into ' +
      '<a href="https://gemini.google.com" target="_blank">Gemini</a> or ' +
      '<a href="https://chatgpt.com" target="_blank">ChatGPT</a>.<br><br>' +
      'Then paste the result back into your <b>Sheet1</b> tab ' +
      'starting on the next empty row after your existing meals.' +
      '</p>' +
      '<textarea style="width:100%;height:320px;font-size:11px;font-family:monospace;">' +
      prompt +
      '</textarea>'
    )
    .setWidth(600)
    .setHeight(480)
    .setTitle("AI Meal Generator Prompt");

  ui.showModalDialog(htmlOutput, "📋 Copy this prompt → paste into Gemini or ChatGPT");
}
