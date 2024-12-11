# Notification App

## Overview
The Notification App is a real-time notification system built with Node.js and Express. It utilizes Server-Sent Events (SSE) to push notifications to connected clients. The app allows users to connect, receive notifications, and send notifications through a simple API.

## Features
- Real-time notifications using Server-Sent Events (SSE)
- Simple REST API for sending notifications
- EJS templating for dynamic content rendering
- Basic client-side JavaScript for handling notifications

## Technologies Used
- Node.js
- Express
- EJS (Embedded JavaScript)
- Body-parser
- SSE (Server-Sent Events)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Steps to Install
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/notification-app.git
   cd notification-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

## Usage

### Connecting to SSE
To connect to the Server-Sent Events endpoint, you can use the following JavaScript code in your client-side application:

```javascript
const userId = prompt("Enter your User ID:"); // Prompt for user ID
const eventSource = new EventSource(`/sse?userId=${userId}`);

eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("New notification:", data.message);
    // Handle the notification (e.g., display it on the UI)
};
```

### Sending Notifications
You can send notifications using the `/notify` API endpoint. Here’s an example using `fetch`:

```javascript
const userId = 'exampleUserId'; // Replace with the actual user ID
const message = 'Hello, this is a notification!';

fetch('/notify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, message }),
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log('Notification sent successfully:', data);
})
.catch(error => {
    console.error('Error sending notification:', error);
});
```

## API Endpoints

### 1. GET `/`
- **Description:** Renders the main layout of the application.
- **Response:** HTML page with the notification app interface.

### 2. GET `/sse`
- **Description:** Establishes a connection for Server-Sent Events.
- **Query Parameters:**
  - `userId` (string): The ID of the user connecting to receive notifications.
- **Response:** Streams notifications to the connected client.

### 3. POST `/notify`
- **Description:** Sends a notification to a specific user.
- **Request Body:**
  - `userId` (string): The ID of the user to send the notification to.
  - `message` (string): The notification message to send.
- **Response:**
  - **200 OK:** Notification sent successfully.
  - **400 Bad Request:** If `userId` or `message` is missing.
  - **404 Not Found:** If the user is not connected.

## Error Handling
- Ensure to handle errors gracefully in your client-side code, especially when sending notifications. Check for network issues and provide user feedback accordingly.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the contributors and the open-source community for their support and resources.
