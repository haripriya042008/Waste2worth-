const jwt = require('jsonwebtoken');
const User = require('../models/User');

let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  // Socket.io JWT authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'waste2worth_secret_2026');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.user.name} (${socket.user.role}) [ID: ${socket.id}]`);

    // Join personal user room
    socket.join(`user:${socket.user._id.toString()}`);

    // Join role-based room (e.g., 'role:admin', 'role:charity', 'role:donor')
    socket.join(`role:${socket.user.role}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.user.name} [ID: ${socket.id}]`);
    });
  });
};

const getIO = () => ioInstance;

module.exports = {
  initSocket,
  getIO
};
