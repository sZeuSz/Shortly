import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import sessionRepository from '../repositories/sessionsRepository.js';
import usersRepository from '../repositories/usersRepository.js';

export async function login(req, res) {
  const { email, password } = req.body;
  const { rows: users } = await usersRepository.getUserByEmail(email);
  const [user] = users;
  if (!user) {
    return res.sendStatus(401); // unauthorized
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    await sessionRepository.createSession(token, user.id);
    return res.send(token);
  }

  res.sendStatus(401); // unauthorized
}