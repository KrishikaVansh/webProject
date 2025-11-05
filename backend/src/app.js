require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const therapistRoutes = require('./routes/therapists');
const appointmentRoutes = require('./routes/appointments');
const moodRoutes = require('./routes/mood');
const journalRoutes = require('./routes/journal');
const resourceRoutes = require('./routes/resources');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.set('trust proxy', 1);

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
