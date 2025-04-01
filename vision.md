# GUESS WHO: MUTUALS EDITION

A simple, web-based two-player game based on the classic "Guess Who" — but the board is made up of real people you and a friend both follow on Instagram.

This is a vibe-first project focused on building understanding through real-time iteration. MVP first, polish later.

---

## 🎯 CORE IDEA

> Each player selects a secret mutual Instagram follow from a shared visual grid.  
> You take turns asking each other yes/no questions — out loud — to eliminate options.  
> You click faces to blur them as you eliminate suspects.  
> First to guess the other’s secret wins.

---

## ✅ CURRENT PROGRESS

- [x] Grid layout built using HTML + CSS  
- [x] Custom profile pics used for prototype  
- [x] Hover effect on each image  
- [x] Click-to-blur functionality added

---

## 🛠 NEXT STEPS

### 🔹 Phase 1: Functional MVP (no backend)

- [ ] Add "select your secret person" mechanic
  - Click to highlight your pick (visually marked for you only)
  - Simply show who you selected by putting a border around their image

### 🔹 Phase 2: Load data from JSON

- [ ] Replace hardcoded people with dynamic data from a JSON file
- [ ] Create a `mutuals.json` file with name + image path
- [ ] Loop through JSON in JS to populate the grid

### 🔹 Phase 3: Real data (optional)

- [ ] Build/import mutuals list from Instagram (via scraping or auth)
- [ ] Replace dummy images with real mutual profile pics

---

## 🔮 FUTURE / STRETCH IDEAS

- Shared turn-tracking / light UI polish  
- Victory screen when player guesses right  
- AI-powered version for solo play  
- Click-to-reveal both players’ picks at the end

---

## 🧠 DESIGN PHILOSOPHY

- MVP-first: functional is better than fancy  
- Real people = real stakes = real fun  
- Build with understanding: code you can explain  
- No unnecessary features — only what serves the experience

---

## 🤘 TOOLS

- HTML/CSS/JS only (no framework needed yet)  
- Placeholder images → then real data  