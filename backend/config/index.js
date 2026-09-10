module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 5,
  roles: ['admin', 'pharmacist', 'staff'],
  paymentMethods: ['cash', 'card', 'evc_plus', 'zaad', 'sahal', 'bank_transfer'],
  currencies: ['USD', 'SOS'],
};
