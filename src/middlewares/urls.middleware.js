import connection from "../database/database.js";

export async function redirectValidation(req, res, next) {
  const { shortUrl } = req.params;

  try {
    const urlExist = await connection.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1;`,
      [shortUrl]
    );

    if (!shortUrl || urlExist.rowCount === 0) {
      return res.status(404).send("Url não encontrada");
    }

    res.locals.url = urlExist.rows[0];
  } catch (error) {
    res.status(500).send(error.message);
  }
  next();
}
