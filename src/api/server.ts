import express from 'express';
import { config } from '../config';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', env: config.env });
});

import userRoutes from './routes/users';
import socialRoutes from './routes/social';
import authRoutes from './routes/auth';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/social', socialRoutes);

// Error Handling
app.use(errorHandler);

const PORT = config.port;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} in ${config.env} mode`);
    });
}

export default app;
