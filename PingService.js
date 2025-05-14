class PingService {
  constructor() {
    this.socket = null;
    this.subscribers = [];
    this.currentStatuses = {};
  }

  connect() {
    // Replace with your server URL
    this.socket = new WebSocket(`ws://${window.location.hostname}:5000`);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PING_UPDATE') {
        this.currentStatuses[data.data.ip] = data.data;
        this.notifySubscribers();
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentStatuses));
  }

  async getCurrentStatuses() {
    try {
      const response = await fetch('/api/device-status');
      const data = await response.json();
      this.currentStatuses = data.reduce((acc, device) => {
        acc[device.ip_address] = device;
        return acc;
      }, {});
      return this.currentStatuses;
    } catch (error) {
      console.error('Error fetching device statuses:', error);
      return {};
    }
  }

  async pingDevice(ip) {
    try {
      const response = await fetch('/api/ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error pinging device:', error);
      return { ip, status: 'offline', responseTime: 0 };
    }
  }
}

export const pingService = new PingService();