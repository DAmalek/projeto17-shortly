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
    const getUrl = await connection.query(`SELECT * FROM urls WHERE id = $1;`, [
      id,
    ]);

    if (getUrl.rowCount !== 1) {
      return res.sendStatus(404);
    }

    const url = getUrl.rows[0];

    const body = {
      id: url.id,
      shortUrl: url.shortUrl,
      url: url.url,
    };

    return res.status(200).send(body);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export async function openUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const response = await db.query('SELECT * FROM urls WHERE "shortUrl"=$1', [
      shortUrl,
    ]);
    if (response.rowCount === 0) return res.sendStatus(404);

    await db.query('UPDATE urls SET "visitCount"=$1 WHERE id=$2;', [
      response.rows[0].visitCount + 1,
      response.rows[0].id,
    ]);

    res.redirect(response.rows[0].url);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
export async function getUserData(req, res) {
  const user = res.locals.session;

  try {
    const query = await db.query(
      `SELECT users.id, users.name, CAST(COALESCE(SUM(urls."visitCount"), 0) AS INTEGER) as "visitCount",
      CASE
        WHEN COUNT(urls.id) = 0 THEN json_build_array()
        ELSE json_agg(
          json_build_object(
            'id', urls.id,
            'shortUrl', urls."shortUrl",
            'url', urls.url,
            'visitCount', urls."visitCount"
          )
        )
      END as "shortenedUrls"
    FROM users
    LEFT JOIN urls ON users.id = urls."userId"
    WHERE users.id = $1
    GROUP BY users.id;`,
      [user.userId]
    );

    res.status(200).send(query.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

export async function destroyUrl(req, res) {
  const { id } = req.params;
  const user = res.locals.session;
  try {
    const query = await db.query("SELECT * FROM urls WHERE id=$1", [id]);
    if (query.rowCount === 0) return res.sendStatus(404);

    if (user.id !== query.rows[0].userId) return res.sendStatus(401);

    await db.query("DELETE FROM urls WHERE id=$1;", [id]);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
