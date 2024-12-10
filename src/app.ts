import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const clients = new Map<string, Response[]>(); // Store connected SSE clients

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.render('layout', {
        title: 'Notification App',
        content: `<%- include('index') %>`,
    });
});

app.get('/sse', (req: Request, res: Response) => {
    const userId = req.query.userId as string; // Get user ID from query params
    if (!userId) {
        res.status(400).send('User ID is required');
        return;
    }

    console.log(`User ${userId} connected`);

    // Set headers for SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });

    // Add client to the map
    if (!clients.has(userId)) {
        clients.set(userId, []);
    }
    clients.get(userId)!.push(res);

    // Log current clients
    console.log('Current clients:', [...clients.keys()]);

    // Handle connection close
    req.on('close', () => {
        console.log(`User ${userId} disconnected`);
        const userConnections = clients.get(userId);
        if (userConnections) {
            const index = userConnections.indexOf(res);
            if (index !== -1) {
                userConnections.splice(index, 1);
            }
            if (userConnections.length === 0) {
                clients.delete(userId);
            }
        }
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ message: 'Connected to SSE' })}\n\n`);
});

// Endpoint to broadcast notifications
app.post('/notify', (req: Request, res: Response) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res
            .status(400)
            .json({ error: 'userId and message are required' });
    }

    const userConnections = clients.get(userId);
    if (userConnections && userConnections.length > 0) {
        userConnections.forEach((client) => {
            client.write(`data: ${JSON.stringify({ message })}\n\n`);
        });
        res.status(200).json({ success: true });
    } else {
        res.status(404).json({ error: 'User not connected' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
