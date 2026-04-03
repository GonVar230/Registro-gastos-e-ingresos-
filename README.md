# 💰 Finance Dashboard

![HTML](https://img.shields.io/badge/HTML-14%25-orange?style=flat-square&logo=html5)
![CSS](https://img.shields.io/badge/CSS-31%25-blue?style=flat-square&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-55%25-yellow?style=flat-square&logo=javascript)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

A personal finance dashboard built with HTML, CSS and vanilla JavaScript. Track your monthly income, expenses and savings, visualize your balance in real time, and convert your total balance to other currencies using an external API.

🔗 **Repository:** [github.com/GonVar230/Registro-gastos-e-ingresos-](https://github.com/GonVar230/Registro-gastos-e-ingresos-)

---

## ✨ Features

- Initial setup form to configure name, month, income and savings goal
- Dashboard with real-time display of income, expenses, savings and balance
- Movement tracking with categories (Entertainment, Home, Food, Transport, Unexpected, Health)
- Separate savings history with accumulated counter
- Movement filter by type (Income / Expense / All)
- Reusable modals for adding income, expenses and savings
- Expandable sidebar with hover animation
- Session saving and loading via `localStorage`
- Currency converter that takes the total balance and converts it to other currencies using an external API
- Confirmation modal before deleting all progress
- SweetAlert reminder when starting a new session

---

## 🗂️ Project Structure

```
├── index.html
├── assets/
│   └── logo/
├── styles/
│   └── (CSS files)
└── js/
    ├── main.js         # Core dashboard logic
    └── converter.js    # Currency converter with external API integration
```

---

## 🧩 JavaScript Files

### `main.js`
Contains all the dashboard logic:
- Initial form validation and submission
- Dynamic reusable modal generation (`CrearModal`)
- Functions for registering savings (`crearAhorro`) and income/expenses (`crearIngreso`)
- Real-time balance calculation and update
- Data saving and loading from `localStorage`
- Sidebar control and animations

### `converter.js`
Contains the currency converter integrated with the dashboard balance:
- Reads the total balance calculated in `main.js`
- Makes a request to an exchange rate API to fetch up-to-date rates
- Allows the user to select a target currency and see the equivalent in real time

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [SweetAlert2](https://sweetalert2.github.io/) — modals and visual alerts
- [Bootstrap Icons](https://icons.getbootstrap.com/) — iconography
- Exchange Rate API — currency conversion in `converter.js`
- `localStorage` — data persistence with no backend required

---

## ▶️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/GonVar230/Registro-gastos-e-ingresos-.git
   ```
2. Open `index.html` in your browser — no server or additional dependencies needed.
3. Fill out the initial form with your name, month, income and savings goal.
4. From the dashboard, add movements using the interface buttons.
5. Use the currency converter to see your balance equivalent in other currencies.
6. Press **Save** to persist your data across sessions.

---

## 👤 Author

**GonVar230** — [github.com/GonVar230](https://github.com/GonVar230)
