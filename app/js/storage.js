/**
 * Storage Module
 * Handles local storage operations for the application
 */

// Storage keys
const STORAGE_KEYS = {
  API_KEY: 'openai_api_key',
  SETTINGS: 'openai_image_generator_settings',
  HISTORY: 'openai_image_generator_history'
};

// In-memory storage for settings
let inMemorySettings = null;

/**
 * Save API key to local storage
 * @param {string} apiKey - The OpenAI API key
 */
export function saveApiKey(apiKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  }
}

/**
 * Get API key from local storage
 * @returns {string|null} - The stored API key or null if not found
 */
export function getApiKey() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  }
  return null;
}

/**
 * Clear API key from local storage
 */
export function clearApiKey() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  }
}

/**
 * Save settings to in-memory storage
 * @param {Object} settings - The settings object to save
 */
export function saveSettings(settings) {
  inMemorySettings = settings;
}

/**
 * Get settings from in-memory storage
 * @returns {Object|null} - The stored settings or null if not found
 */
export function getSettings() {
  return inMemorySettings;
}

/**
 * Save generation history to local storage
 * @param {Object} historyItem - The history item to save
 */
export function saveToHistory(historyItem) {
  if (typeof window !== 'undefined') {
    const history = getHistory() || [];
    history.unshift(historyItem); // Add to beginning of array
    
    // Limit history size to prevent exceeding localStorage limits
    const limitedHistory = history.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
  }
}

/**
 * Get generation history from local storage
 * @returns {Array|null} - The stored history or null if not found
 */
export function getHistory() {
  if (typeof window !== 'undefined') {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  }
  return [];
}

/**
 * Clear generation history from local storage
 */
export function clearHistory() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }
}

/**
 * Export settings and history as JSON
 * @returns {Object} - The exported settings and history
 */
export function exportData() {
  return {
    settings: getSettings(),
    history: getHistory()
  };
}

/**
 * Import settings and history from JSON
 * @param {Object} data - The data to import
 */
export function importData(data) {
  if (data.settings) {
    saveSettings(data.settings);
  }
  
  if (data.history) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
  }
}