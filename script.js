// script.js - Crypto Price Tracker
// Uses CoinGecko public API to fetch live prices for selected cryptocurrencies
// Handles errors and refreshes data every 5 seconds

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const COINS = ['bitcoin', 'ethereum', 'cardano', 'solana', 'dogecoin']; // Add more coins as needed
const VS_CURRENCY = 'usd';
const REFRESH_INTERVAL = 5000; // 5 seconds

const tableBody = document.querySelector('#crypto-table tbody');
const errorMessage = document.getElementById('error-message');

// Fetches data from CoinGecko API and updates the table
async function fetchCryptoData() {
    try {
        // Build API URL with selected coins
        const url = `${API_URL}?vs_currency=${VS_CURRENCY}&ids=${COINS.join(',')}&order=market_cap_desc&per_page=5&page=1&sparkline=false`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        updateTable(data);
        hideError();
    } catch (error) {
        // Verbose error handling: show user-friendly message
        showError('Failed to fetch data. Please check your internet connection.');
        console.error('Fetch error:', error);
    }
}

// Updates the table with fetched data
function updateTable(data) {
    tableBody.innerHTML = '';
    data.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${coin.image}" alt="${coin.name}" style="width:24px;vertical-align:middle;margin-right:8px;">
                <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
            </td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td style="color:${coin.price_change_percentage_24h >= 0 ? '#4caf50' : '#ff6b6b'};">
                ${coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
            </td>
            <td>$${coin.total_volume.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Shows error message in the UI
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Hides error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Initial fetch and set interval for auto-refresh
fetchCryptoData();
setInterval(fetchCryptoData, REFRESH_INTERVAL);

// Comments:
// - API integration: Uses fetch() to call CoinGecko's /coins/markets endpoint for selected coins.
// - Error handling: Catches network/API errors and displays a clear message to the user.
// - Refresh logic: Updates prices every 5 seconds using setInterval.
// - Responsive UI: Table layout adapts to desktop and mobile via CSS.
