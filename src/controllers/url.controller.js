import connection from "../database/database.js";
import { nanoid } from "nanoid";

export async function createShorten(req, res) {
  const url = res.locals.url;
  const user_id = res.locals.userId;
  const shortenUrl = nanoid(8);

  try {
    const InsertShortenUrl = await connection.query(
      `INSERT INTO urls ("shortUrl", url, "user_id","visitCount","createdAt") VALUES ($1, $2, $3, $4, $5);`,
      [shortenUrl, url, user_id, 0, new Date()]
    );

    const getUrlId = await connection.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1;`,
      [shortenUrl]
    );
    const url_id = getUrlId.rows[0].id;

    const body = {
      id: url_id,
      shortUrl: shortenUrl,
    };

    return res.status(201).send(body);
  } catch (error) {
    console.log("controller");
    return res.status(500).send(error.message);
  }
}
export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const getUrl = await db.query(`SELECT * FROM urls WHERE id = $1;`, [id]);

    if (getUrl.rowCount !== 1) {
      return res.sendStatus(404);
    }

    const url = getUrl.rows[0];

    const resBody = {
      id: url.id,
      shortUrl: url.shortUrl,
      url: url.url,
    };

    return res.status(200).send(resBody);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
