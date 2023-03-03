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

    if (sessionExist.rowCount !== 1) {
      return res.status(401).send("need to signIn");
    }

    return (res.locals.userSession = sessionExist.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
}
export async function deleteValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const id_da_url = req.params.id;

  if (!token) {
    return res.status(401).send("token unauthorized");
  }

  try {
    const sessionExist = await connection.query(
      `SELECT * FROM sessions WHERE token = $1;`,
      [token]
    );

    if (sessionExist.rowCount !== 1) {
      return res.status(401).send("need to signIn");
    }

    const userId = sessionExist.rows[0].id;

    const checkUrl = await connection.query(
      `SELECT * FROM urls WHERE id = $1;`,
      [id_da_url]
    );

    if (checkUrl.rowCount === 0) {
      return res.status(404).send("url not found");
    }

    const checkValid = await connection.query(
      `SELECT * FROM urls WHERE "user_id" = $1 AND id = $2;`,
      [userId, id_da_url]
    );

    if (checkValid.rowCount === 0) {
      return res.status(401).send("shortUrl not foudn");
    }

    const objUrl = checkValid.rows[0];

    return (res.locals.url = objUrl);
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
}
