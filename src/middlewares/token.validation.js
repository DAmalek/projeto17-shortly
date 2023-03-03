import connection from "../database/database.js";

export async function tokenValidation(req, res, next) {
  const { url } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("invalid token");
  try {
    const check_session = connection.query(
      "SELECT * FROM sessions WHERE token = $1",
      [token]
    );
    if ((await check_session).rowCount !== 1)
      return res.status(401).send("need to signIn");

    const user_id = check_session.rows[0].user_id;

    res.locals.userId = user_id;
    res.locals.url = url;

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }

  next();
}
