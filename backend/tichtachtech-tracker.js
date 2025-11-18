/**
 * TichTachTech Analytics Tracker
 * 
 * Legg til denne filen i ditt prosjekt for å sende analytics til TichTachTech Admin
 */

class TichTachTechTracker {
  constructor(config) {
    this.apiUrl = config.apiUrl || 'http://localhost:3001/api';
    this.apiKey = config.apiKey; // Din unike API key
    this.projectId = config.projectId; // Ditt prosjekt ID fra admin
    this.sessionId = this.generateSessionId();
    this.pageViews = 0;
    this.sessionStart = Date.now();
    
    // Auto-track page views
    if (config.autoTrack !== false) {
      this.trackPageView();
      window.addEventListener('beforeunload', () => this.sendSession());
    }
  }
  
  generateSessionId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Track page view
   */
  trackPageView(pagePath = window.location.pathname) {
    this.pageViews++;
    
    this.sendEvent({
      type: 'pageview',
      path: pagePath,
      title: document.title,
      referrer: document.referrer,
    });
  }
  
  /**
   * Track custom event
   */
  trackEvent(eventName, eventData = {}) {
    this.sendEvent({
      type: 'event',
      name: eventName,
      data: eventData,
    });
  }
  
  /**
   * Track conversion (purchase, signup, etc.)
   */
  trackConversion(conversionData) {
    const { value, currency = 'USD', type } = conversionData;
    
    this.sendEvent({
      type: 'conversion',
      conversionType: type,
      value,
      currency,
    });
    
    // Also send to payment webhook if it's a payment
    if (type === 'payment' && value) {
      this.trackPayment(value, currency);
    }
  }
  
  /**
   * Track payment
   */
  trackPayment(amount, currency = 'USD') {
    fetch(`${this.apiUrl}/webhooks/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({
        projectId: this.projectId,
        amount,
        currency,
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error('Payment tracking error:', err));
  }
  
  /**
   * Send session data (automatically called on page unload)
   */
  sendSession() {
    const sessionDuration = Date.now() - this.sessionStart;
    
    // Use sendBeacon for reliable tracking on page unload
    const data = JSON.stringify({
      projectId: this.projectId,
      visits: 1,
      uniqueVisitors: 1, // You might want to use cookies/localStorage for this
      sessionDuration: Math.round(sessionDuration / 1000), // in seconds
      pageViews: this.pageViews,
      timestamp: new Date().toISOString(),
    });
    
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(
        `${this.apiUrl}/webhooks/analytics`,
        blob
      );
    } else {
      // Fallback for older browsers
      fetch(`${this.apiUrl}/webhooks/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: data,
        keepalive: true,
      }).catch(err => console.error('Analytics error:', err));
    }
  }
  
  /**
   * Send event data
   */
  sendEvent(eventData) {
    // Store events and send in batches or immediately
    fetch(`${this.apiUrl}/webhooks/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({
        projectId: this.projectId,
        event: eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      }),
    }).catch(err => console.error('Event tracking error:', err));
  }
}

// Export for use in your project
export default TichTachTechTracker;

// Example usage:
/*
import TichTachTechTracker from './tichtachtech-tracker.js';

const tracker = new TichTachTechTracker({
  apiUrl: 'https://api.tichtachtech.com/api', // Your production API
  apiKey: 'your-api-key-here',
  projectId: 'your-project-id-here',
  autoTrack: true, // Automatically track page views
});

// Track custom events
tracker.trackEvent('button_click', { button: 'generate' });

// Track conversions
tracker.trackConversion({
  type: 'payment',
  value: 9.99,
  currency: 'USD',
});
*/
