/**
 * Shared API helper utilities for NASA API calls.
 * Provides in-memory caching and rate-limit-aware error handling.
 */

// Simple in-memory cache: { key: { data, expiry } }
const cache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() < entry.expiry) {
    return entry.data;
  }
  if (entry) {
    delete cache[key];
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, expiry: Date.now() + CACHE_TTL };
}

/**
 * Extracts detailed error info from an axios error for logging.
 */
function getErrorDetail(error) {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
      retryAfter: error.response.headers?.['retry-after'],
    };
  }
  return { message: error.message };
}

/**
 * Returns true if the error is a rate limit (429) response.
 */
function isRateLimited(error) {
  return error.response?.status === 429;
}

module.exports = { getCached, setCache, getErrorDetail, isRateLimited };
