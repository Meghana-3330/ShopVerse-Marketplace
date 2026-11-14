const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true
    }
  });

  // Socket middleware for authentication
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        // Allow unauthenticated connection for public broadcasts
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dev_jwt_secret_shopverse_2024_secure_key'
      );
      socket.user = decoded;
      return next();
    } catch (err) {
      console.warn('Socket authentication warning:', err.message);
      // Proceed without authenticated user
      socket.user = null;
      return next();
    }
  });

  io.on('connection', (socket) => {
    if (socket.user && socket.user.id) {
      const userId = socket.user.id;
      const role = socket.user.role;

      // Join user specific room
      socket.join(`user_${userId}`);

      if (role === 'vendor') {
        socket.join(`vendor_${userId}`);
      }

      if (role === 'admin') {
        socket.join('role_admin');
      }

      console.log(`[Socket.IO] Authenticated user connected: ${socket.user.email} (${role}) [Socket ID: ${socket.id}]`);
    } else {
      console.log(`[Socket.IO] Guest connected [Socket ID: ${socket.id}]`);
    }

    socket.on('disconnect', () => {
      // Disconnected
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

const emitToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(`user_${userId.toString()}`).emit(event, data);
  }
};

const emitToVendor = (vendorId, event, data) => {
  if (io && vendorId) {
    io.to(`vendor_${vendorId.toString()}`).emit(event, data);
  }
};

const emitToAdmin = (event, data) => {
  if (io) {
    io.to('role_admin').emit(event, data);
  }
};

const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToVendor,
  emitToAdmin,
  emitToAll
};
