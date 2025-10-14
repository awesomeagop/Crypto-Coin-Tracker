// script.js - Enhanced Crypto Price Tracker
// Configuration and state management
const config = {
    API_BASE_URL: 'https://api.coingecko.com/api/v3',
    REFRESH_INTERVAL: 5000,
    DEFAULT_CURRENCY: 'usd',
    DEFAULT_LANGUAGE: 'en',
    CHART_OPTIONS: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
    }
};

// State management
const state = {
    selectedCoins: new Set(['bitcoin', 'ethereum', 'cardano', 'solana', 'dogecoin']),
    favorites: new Set(JSON.parse(localStorage.getItem('favorites') || '[]')),
    currency: localStorage.getItem('currency') || config.DEFAULT_CURRENCY,
    language: localStorage.getItem('language') || config.DEFAULT_LANGUAGE,
    theme: localStorage.getItem('theme') || 'dark',
    alerts: new Map(JSON.parse(localStorage.getItem('alerts') || '[]')),
    lastData: null,
    isOnline: navigator.onLine
};

// DOM Elements
const elements = {
    tableBody: document.querySelector('#crypto-table tbody'),
    errorMessage: document.getElementById('error-message'),
    offlineBanner: document.getElementById('offline-banner'),
    themeToggle: document.getElementById('theme-toggle'),
    currencySelect: document.getElementById('currency-select'),
    languageSelect: document.getElementById('language-select'),
    coinSearch: document.getElementById('coin-search-input'),
    addCoinBtn: document.getElementById('add-coin'),
    selectedCoinsContainer: document.getElementById('selected-coins'),
    showFavoritesBtn: document.getElementById('show-favorites'),
    showAllBtn: document.getElementById('show-all'),
    historyModal: document.getElementById('history-modal'),
    alertsModal: document.getElementById('alerts-modal'),
    historyChart: document.getElementById('history-chart')
};

// Initialize theme
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    elements.themeToggle.innerHTML = state.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Initialize currency selector
function initCurrency() {
    elements.currencySelect.value = state.currency;
}

// Initialize language
function initLanguage() {
    elements.languageSelect.value = state.language;
}

// Fetch available coins for search
async function fetchAvailableCoins() {
    try {
        const response = await fetch(`${config.API_BASE_URL}/coins/list`);
        const coins = await response.json();
        return coins;
    } catch (error) {
        console.error('Error fetching available coins:', error);
        return [];
    }
}

// Fetch crypto data
async function fetchCryptoData() {
    try {
        const params = new URLSearchParams({
            vs_currency: state.currency,
            ids: Array.from(state.selectedCoins).join(','),
            order: 'market_cap_desc',
            sparkline: 'true',
            price_change_percentage: '24h'
        });

        const url = `${config.API_BASE_URL}/coins/markets?${params}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        state.lastData = data;
        localStorage.setItem('lastData', JSON.stringify(data));
        updateTable(data);
        hideError();
        checkPriceAlerts(data);
    } catch (error) {
        if (!navigator.onLine) {
            showOfflineData();
        } else {
            showError('Failed to fetch data. Please check your internet connection.');
            console.error('Fetch error:', error);
        }
    }
}

// Update table with data
function updateTable(data) {
    elements.tableBody.innerHTML = '';
    const showOnlyFavorites = document.querySelector('#show-favorites').classList.contains('active');
    
    data.forEach(coin => {
        if (showOnlyFavorites && !state.favorites.has(coin.id)) return;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button class="favorite-btn ${state.favorites.has(coin.id) ? 'active' : ''}" 
                        data-coin-id="${coin.id}">
                    <i class="fas fa-star"></i>
                </button>
            </td>
            <td>
                <img src="${coin.image}" alt="${coin.name}" style="width:24px;vertical-align:middle;margin-right:8px;">
                <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
            </td>
            <td>${formatCurrency(coin.current_price)}</td>
            <td>
                <canvas class="sparkline" data-prices="${coin.sparkline_in_7d.price.join(',')}"></canvas>
            </td>
            <td>${formatCurrency(coin.market_cap)}</td>
            <td style="color:${coin.price_change_percentage_24h >= 0 ? 'var(--success-color)' : 'var(--error-color)'};">
                ${coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
            </td>
            <td>${formatCurrency(coin.total_volume)}</td>
            <td>
                <button class="action-btn" onclick="showHistoricalData('${coin.id}')" aria-label="Show historical data">
                    <i class="fas fa-chart-line"></i>
                </button>
                <button class="action-btn" onclick="showAlertModal('${coin.id}')" aria-label="Set price alert">
                    <i class="fas fa-bell"></i>
                </button>
            </td>
        `;
        elements.tableBody.appendChild(row);
    });

    // Initialize sparklines
    document.querySelectorAll('.sparkline').forEach(canvas => {
        const prices = canvas.dataset.prices.split(',').map(Number);
        drawSparkline(canvas, prices);
    });
}

// Draw sparkline chart
function drawSparkline(canvas, prices) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 30);
    gradient.addColorStop(0, 'rgba(52, 152, 219, 0.2)');
    gradient.addColorStop(1, 'rgba(52, 152, 219, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(prices.length).fill(''),
            datasets: [{
                data: prices,
                borderColor: '#3498db',
                borderWidth: 1,
                fill: true,
                backgroundColor: gradient,
                pointRadius: 0
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Format currency based on user's selection
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: state.currency.toUpperCase()
    }).format(value);
}

// Show historical data
async function showHistoricalData(coinId) {
    try {
        const response = await fetch(`${config.API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=${state.currency}&days=30`);
        const data = await response.json();
        
        const prices = data.prices.map(price => ({
            x: new Date(price[0]),
            y: price[1]
        }));

        const ctx = elements.historyChart.getContext('2d');
        if (window.historyChart) {
            window.historyChart.destroy();
        }

        window.historyChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Price',
                    data: prices,
                    borderColor: '#3498db',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                ...config.CHART_OPTIONS,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });

        elements.historyModal.style.display = 'block';
    } catch (error) {
        showError('Failed to fetch historical data');
        console.error('Historical data error:', error);
    }
}

// Price alerts
function showAlertModal(coinId) {
    const currentAlert = state.alerts.get(coinId);
    if (currentAlert) {
        document.getElementById('alert-price').value = currentAlert.price;
        document.getElementById('alert-condition').value = currentAlert.condition;
    }
    
    document.getElementById('alert-form').onsubmit = (e) => {
        e.preventDefault();
        const price = document.getElementById('alert-price').value;
        const condition = document.getElementById('alert-condition').value;
        
        state.alerts.set(coinId, { price, condition });
        localStorage.setItem('alerts', JSON.stringify(Array.from(state.alerts)));
        elements.alertsModal.style.display = 'none';
    };
    
    elements.alertsModal.style.display = 'block';
}

// Check price alerts
function checkPriceAlerts(data) {
    data.forEach(coin => {
        const alert = state.alerts.get(coin.id);
        if (alert) {
            const triggered = (alert.condition === 'above' && coin.current_price > alert.price) ||
                            (alert.condition === 'below' && coin.current_price < alert.price);
            
            if (triggered) {
                const notification = new Notification(`Price Alert: ${coin.name}`, {
                    body: `Price is now ${alert.condition} ${formatCurrency(alert.price)}`,
                    icon: coin.image
                });
                
                state.alerts.delete(coin.id);
                localStorage.setItem('alerts', JSON.stringify(Array.from(state.alerts)));
            }
        }
    });
}

// Offline support
function showOfflineData() {
    elements.offlineBanner.style.display = 'block';
    const cachedData = JSON.parse(localStorage.getItem('lastData'));
    if (cachedData) {
        updateTable(cachedData);
    }
}

// Error handling
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCurrency();
    initLanguage();
    fetchCryptoData();
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', state.theme);
        initTheme();
    });

    // Currency selection
    elements.currencySelect.addEventListener('change', (e) => {
        state.currency = e.target.value;
        localStorage.setItem('currency', state.currency);
        fetchCryptoData();
    });

    // Favorites toggle
    elements.showFavoritesBtn.addEventListener('click', () => {
        elements.showFavoritesBtn.classList.add('active');
        elements.showAllBtn.classList.remove('active');
        updateTable(state.lastData);
    });

    elements.showAllBtn.addEventListener('click', () => {
        elements.showAllBtn.classList.add('active');
        elements.showFavoritesBtn.classList.remove('active');
        updateTable(state.lastData);
    });

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            elements.historyModal.style.display = 'none';
            elements.alertsModal.style.display = 'none';
        });
    });

    // Offline detection
    window.addEventListener('online', () => {
        state.isOnline = true;
        elements.offlineBanner.style.display = 'none';
        fetchCryptoData();
    });

    window.addEventListener('offline', () => {
        state.isOnline = false;
        showOfflineData();
    });

    // Notification permission
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// Auto-refresh
setInterval(fetchCryptoData, config.REFRESH_INTERVAL);
