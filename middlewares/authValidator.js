import sessionRepository from "../repositories/sessionsRepository.js";
import usersRepository from "../repositories/usersRepository.js";

export async function validateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("No token."); // unauthorized
  }

  try {
    const { rows:sessions } = await sessionRepository.getSessionByToken(token);
    const [session] = sessions;

    if (!session) {
      return res.status(401).send("Session not found."); // unauthorized
    }

    const { rows: users } = await usersRepository.getUserById(session.userId);
    const [user] = users;
    if (!user) {
      return res.status(401).send("User not found."); // unauthorized
    }
  
    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // server error
  }  
}