import { registerAs } from '@nestjs/config';

export default registerAs('refresh', () => ({
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '7d', // Exemple: 7 jours pour les tokens refresh
}));