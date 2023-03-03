import connection from "../database/database.js";

export async function createShorten(req, res) {
  const { url } = res.locals.url;
  const user_id = res.locals.userId;
  const shortenUrl = nanoid(8);

  try {
    const InsertShortenUrl = await connection.query(
      `INSERT INTO urls ("shortenUrl", url, "userId") VALUES ($1, $2, $3);`,
      [shortenUrl, url, user_id]
    );

    const getUrlId = await connection.query(
      `SELECT * FROM urls WHERE "shortenUrl" = $1;`,
      [shortenUrl]
    );
    const url_id = getUrlId[0].id;

    const body = {
      id: url_id,
      shortUrl: shortenUrl,
    };

    res.status(201).send(body);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
