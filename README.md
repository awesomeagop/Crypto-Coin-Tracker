# Crypto-Coin-Tracker

A feature-rich, real-time cryptocurrency price tracker web application built with vanilla JavaScript. Runs entirely in your browser with no server or API key required. Features dark/light mode, customizable alerts, offline support, and interactive charts.

## ✨ Features

### Core Functionality
- 🔄 Real-time price updates every 5 seconds
- 📊 Live data for multiple cryptocurrencies
- 📱 Responsive design for desktop and mobile
- 🌐 No server or API key required

### Advanced Features
- 🎨 **Theme Customization**
  - Toggle between dark and light modes
  - Persistent theme preference
  - Modern, clean interface

- 💱 **Multiple Currencies**
  - Support for USD, EUR, GBP
  - Real-time currency conversion
  - Formatted currency display

- 🔍 **Coin Management**
  - Search and add any supported cryptocurrency
  - Remove unwanted coins from tracking
  - Star favorite coins for quick access
  - Filter view by favorites

- 📈 **Price Visualization**
  - Mini sparkline charts for quick trend view
  - Detailed 30-day price history charts
  - Interactive chart tooltips
  - Responsive chart sizing

- 🔔 **Price Alerts**
  - Set custom price thresholds
  - Above/below price notifications
  - Browser notifications support
  - Persistent alert settings

- 🌐 **Offline Support**
  - Automatic data caching
  - Offline mode indicator
  - Resume sync when back online
  - Persistent data storage

- ♿ **Accessibility**
  - ARIA labels for screen readers
  - Keyboard navigation support
  - High contrast mode compatibility
  - Semantic HTML structure

## 🚀 Getting Started

1. **Download the Project**
   ```bash
   git clone https://github.com/your-username/crypto-coin-tracker.git
   cd crypto-coin-tracker
   ```

2. **Launch the Application**
   - Simply open `index.html` in your web browser
   - No build process or server required

## 📁 Project Structure

```
crypto-coin-tracker/
├── index.html      # Main application structure
├── styles.css      # Responsive styling and themes
├── script.js       # Application logic and API integration
└── README.md       # Project documentation
```

## 🛠️ Technical Details

### API Integration
- Uses CoinGecko's public API (v3)
- Endpoints used:
  - `/coins/markets` - Current price data
  - `/coins/{id}/market_chart` - Historical data
  - `/coins/list` - Available coins list

### Local Storage
- Theme preference
- Favorite coins
- Currency selection
- Price alerts
- Cached data for offline mode

### Browser Features
- `localStorage` for data persistence
- `Notifications API` for price alerts
- `Canvas API` for charts
- `Fetch API` for data retrieval

## 🎨 Customization

### Adding New Coins
```javascript
// In script.js
state.selectedCoins.add('your-coin-id');
```

### Changing Update Frequency
```javascript
// In script.js
config.REFRESH_INTERVAL = 10000; // 10 seconds
```

### Adding New Currencies
```javascript
// Add to currency selector in index.html
<option value="jpy">JPY</option>
```

## 🌐 Offline Support

The application caches:
- Last fetched price data
- User preferences
- Favorite coins
- Active price alerts

## ⌨️ Keyboard Shortcuts

- `Tab`: Navigate through interactive elements
- `Space/Enter`: Activate buttons and controls
- `Esc`: Close modals

## 🚨 Error Handling

- Network connectivity issues
- API rate limiting
- Invalid data responses
- Offline mode transitions

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Crypto-Coin-Tracker** — Professional-grade cryptocurrency tracking in your browser.
