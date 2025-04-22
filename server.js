// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import NodeMediaServer from 'node-media-server';
import cors from 'cors';

import connectDB from './config/db.config.js';
import nmsConfig from './nms.js';
import authRoutes from './routes/auth.routes.js';
import streamRoutes from './routes/stream.routes.js';
// import paymentRoutes from './routes/payment.routes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/streams', streamRoutes);
// app.use('/api/payments', paymentRoutes);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('chatMessage', ({ roomId, message }) => {
    io.to(roomId).emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Node-Media-Server setup
const nms = new NodeMediaServer(nmsConfig);
nms.run();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
