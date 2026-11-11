const { getIO } = require('../sockets/socketHandler');
const Notification = require('../models/Notification');

/**
 * Emit event to a specific user
 */
const emitToUser = (userId, event, data) => {
  const io = getIO();
  if (io && userId) {
    io.to(`user:${userId.toString()}`).emit(event, data);
  }
};

/**
 * Emit event to all users with a specific role
 */
const emitToRole = (role, event, data) => {
  const io = getIO();
  if (io && role) {
    io.to(`role:${role}`).emit(event, data);
  }
};

/**
 * Emit event to all connected clients
 */
const broadcast = (event, data) => {
  const io = getIO();
  if (io) {
    io.emit(event, data);
  }
};

/**
 * Create a database notification and emit it in real-time
 */
const notifyUser = async ({ userId, title, message, notificationType, relatedDonationId = null }) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      notificationType,
      relatedDonationId
    });

    emitToUser(userId, 'notification', notification);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  emitToUser,
  emitToRole,
  broadcast,
  notifyUser
};
