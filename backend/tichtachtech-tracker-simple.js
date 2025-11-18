/**
 * TichTachTech Tracker - Simple HTML/JS Version
 * 
 * Bruk denne hvis du ikke bruker React eller build tools.
 * Bare inkluder denne filen i din HTML.
 */

(function() {
  'use strict';

  window.TichTachTechTracker = function(config) {
    this.apiUrl = config.apiUrl || 'http://localhost:3001/api';
    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
    this.sessionId = this.generateSessionId();
    this.pageViews = 0;
    this.sessionStart = Date.now();
    
    // Auto-track if enabled
    if (config.autoTrack !== false) {
      this.trackPageView();
      var self = this;
      window.addEventListener('beforeunload', function() {
        self.sendSession();
      });
    }
  };

  TichTachTechTracker.prototype.generateSessionId = function() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  TichTachTechTracker.prototype.trackPageView = function(pagePath) {
    this.pageViews++;
    this.sendEvent({
      type: 'pageview',
      path: pagePath || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  };

  TichTachTechTracker.prototype.trackEvent = function(eventName, eventData) {
    this.sendEvent({
      type: 'event',
      name: eventName,
      data: eventData || {},
    });
  };

  TichTachTechTracker.prototype.trackConversion = function(conversionData) {
    var value = conversionData.value;
    var currency = conversionData.currency || 'USD';
    var type = conversionData.type;
    
    this.sendEvent({
      type: 'conversion',
      conversionType: type,
      value: value,
      currency: currency,
    });
    
    if (type === 'payment' && value) {
      this.trackPayment(value, currency);
    }
  };

  TichTachTechTracker.prototype.trackPayment = function(amount, currency) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.apiUrl + '/webhooks/payment', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-API-Key', this.apiKey);
    xhr.send(JSON.stringify({
      projectId: this.projectId,
      amount: amount,
      currency: currency || 'USD',
      timestamp: new Date().toISOString(),
    }));
  };

  TichTachTechTracker.prototype.sendSession = function() {
    var sessionDuration = Date.now() - this.sessionStart;
    var data = JSON.stringify({
      projectId: this.projectId,
      visits: 1,
      uniqueVisitors: 1,
      sessionDuration: Math.round(sessionDuration / 1000),
      pageViews: this.pageViews,
      timestamp: new Date().toISOString(),
    });
    
    if (navigator.sendBeacon) {
      var blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(this.apiUrl + '/webhooks/analytics', blob);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.apiUrl + '/webhooks/analytics', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-API-Key', this.apiKey);
      xhr.send(data);
    }
  };

  TichTachTechTracker.prototype.sendEvent = function(eventData) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.apiUrl + '/webhooks/analytics', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-API-Key', this.apiKey);
    xhr.send(JSON.stringify({
      projectId: this.projectId,
      event: eventData,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: window.screen.width + 'x' + window.screen.height,
    }));
  };

})();

/* 
USAGE EXAMPLE:

<!DOCTYPE html>
<html>
<head>
  <title>My Project</title>
  <script src="tichtachtech-tracker-simple.js"></script>
</head>
<body>
  <h1>My AI App</h1>
  <button id="generate-btn">Generate Description</button>
  
  <script>
    // Initialize tracker
    var tracker = new TichTachTechTracker({
      apiUrl: 'http://localhost:3001/api',
      apiKey: 'your-api-key',
      projectId: 'your-project-id',
      autoTrack: true
    });
    
    // Track custom events
    document.getElementById('generate-btn').addEventListener('click', function() {
      // Your generate logic...
      
      // Track the event
      tracker.trackEvent('button_clicked', {
        button: 'generate'
      });
    });
    
    // Track purchases
    function onPurchaseSuccess(amount) {
      tracker.trackConversion({
        type: 'payment',
        value: amount,
        currency: 'USD'
      });
    }
  </script>
</body>
</html>
*/
