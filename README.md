# Crypto-Coin-Tracker

A minimalistic, real-time cryptocurrency price tracker web application built with pure HTML, CSS, and JavaScript. Runs locally in your browser—no server or API key required.

## Features

- Fetches live price data for Bitcoin, Ethereum, Cardano, Solana, and Dogecoin using CoinGecko’s free public API
- Displays current price, market cap, 24h price change percentage, and 24h trading volume in USD
- Updates prices every 5 seconds for near real-time tracking
- Minimalistic, dark mode design
- Responsive layout for desktop and mobile
- Verbose error handling with user-friendly messages
- No frameworks or build tools required

## Getting Started

1. **Clone or download this repository**
2. **Open `index.html` in your web browser**
   - No server setup needed—just double-click the file

## File Structure

- `index.html` — Main web page
- `styles.css` — Dark mode, responsive styles
- `script.js` — API integration, refresh logic, error handling
- `README.md` — Project documentation

## API Reference

- [CoinGecko Public API](https://www.coingecko.com/en/api/documentation)
  - Endpoint used: `/coins/markets`
  - No API key required

## Customization

- To track different coins, edit the `COINS` array in `script.js`
- To change refresh rate, adjust `REFRESH_INTERVAL` in `script.js`

## Error Handling

If the app cannot fetch data (e.g., no internet connection), a clear error message is shown at the top of the page.

## License

This project is open source and free to use under the MIT License.

---

**Crypto-Coin-Tracker** — Simple, fast, and private crypto price tracking in your browser.
