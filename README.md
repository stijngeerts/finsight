# 2026 Financial Dashboard

A comprehensive financial tracking application built with TypeScript and Vite. Track your savings, income, loans, real
estate, and overall wealth goals for 2026.

## Features

### 🏠 Home Dashboard

- **Current Wealth Overview**: See your total wealth right now
- **Projected Year-End Wealth**: Intelligent projections based on your savings patterns and income
- **Detailed Breakdowns**: Understand exactly where your wealth comes from

### 📊 Savings Tracker

- Set annual savings goals
- Track monthly savings progress
- Visual progress indicators

### 🏠 Real Estate Management

- Track property details and selling prices
- Automatically calculate net proceeds after fees
- Integrated with loan tracking for accurate net value calculations

### 🏦 Loan Tracker

- Track total loaned amount
- Monitor monthly loan balances
- Calculate total repaid amounts
- Integrated into wealth calculations

### 💵 Income Tracker

- Estimate monthly income throughout the year
- Track actual vs. expected income
- Used for intelligent savings projections

### ⚙️ Settings

- Set your total wealth goal
- Configure annual savings targets
- Input current financial status
- Add expected dividends and debt collections
- Configure total loan amount

## Key Calculations

### Current Wealth

Current Wealth = Initial Savings + Savings YTD + (Real Estate Net Proceeds - Current Loan Balance)

### Projected Year-End Wealth

The system intelligently projects your year-end wealth by:

1. Taking your actual savings and income up to today
2. Calculating average monthly rates
3. Adjusting future projections based on:
    - Entered income/savings for future months (if provided)
    - Income-adjusted savings rates (if income is lower, savings projection adjusts down)
4. Adding expected dividends and debt collection
5. Factoring in the net real estate value at year-end

## Technology Stack

- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Vanilla JS**: No framework overhead, pure performance
- **CSS3**: Modern, distinctive design with animations
- **LocalStorage**: Automatic data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:

```bash
cd financial-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Initial Setup

1. Go to the **Settings** tab first
2. Enter your financial parameters:
    - Total Wealth Goal
    - 2026 Savings Goal
    - Current Savings Amount
    - Total Loaned Amount
    - Expected Dividends
    - Expected Debt Collection

### Track Your Progress

1. **Savings Tab**: Enter how much you save each month
2. **Income Tab**: Enter your expected or actual income per month
3. **Loan Tab**: Track your monthly loan balances
4. **Real Estate Tab**: Add property details if applicable

### Monitor Your Wealth

- Visit the **Home** tab anytime to see:
    - Your current total wealth
    - Projected year-end wealth
    - Detailed breakdowns of all components

## Data Management

### Export Data

Click "Export Data" to download a JSON file with all your financial data. This serves as a backup and can be imported
later.

### Import Data

Click "Import Data" to load a previously exported JSON file. This will restore all your data.

### Reset

Click "Reset All" to clear all data and start fresh. **Warning**: This cannot be undone!

## Data Persistence

All data is automatically saved to your browser's localStorage, so your information persists between sessions. No server
or account required!

## Design Philosophy

This dashboard features a distinctive, modern design with:

- Bold typography using Syne and Work Sans fonts
- Ocean-inspired color palette
- Smooth animations and transitions
- Responsive layout for all devices
- Clean, professional interface

## Browser Compatibility

Works on all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Privacy

All data is stored locally in your browser. Nothing is sent to any server. Your financial information stays completely
private.

## License

This project is private and proprietary.