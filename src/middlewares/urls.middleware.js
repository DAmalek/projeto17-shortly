import connection from "../database/database.js";

export async function redirectValidation(req, res, next) {
  const { shortUrl } = req.params;

  try {
    const urlExist = await connection.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1;`,
      [shortUrl]
    );

    if (!shortUrl || urlExist.rowCount === 0) {
      return res.status(404).send("Url not found");
    }

    res.locals.url = urlExist.rows[0];
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
}
export async function uservalidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Token unauthorazed");
  }

  try {
    const sessionExist = await connection.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );

    if (sessionExist.rowCount === 0) {
      return res.status(401).send("need to signIn");
    }

    return (res.locals.userSession = sessionExist.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
}
export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);

  try {
    const session = await connection.query(
      "SELECT * FROM sessions WHERE token=$1",
      [token]
    );
    if (session.rowCount === 0) return res.sendStatus(401);

    res.locals.session = session.rows[0];

    next();
  } catch (error) {
    res.status(500).send(error);
  }
}
