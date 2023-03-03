import connection from "../database/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const emailExists = await connection.query(
    `SELECT * FROM users WHERE email = $1;`,
    [email]
  );

  if (emailExists.rowCount !== 0) return res.sendStatus(409);

  try {
    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await connection.query(
      `
    INSERT INTO users (name, email, password, "createdAt") 
    VALUES ($1, $2, $3,$4);
    `,
      [name, email, passwordHash, new Date()]
    );

    return res.status(201).send("Cadastrado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Algo deu errado no servidor!");
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  console.log();
  try {
    const userExists = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userExists.rowCount !== 1) return res.sendStatus(401);

    const user = userExists.rows[0];

    const passwordExists = bcrypt.compareSync(password, user.password);

    if (!passwordExists)
      return res.status(401).send("check again user or password");

    const token = uuid();

    await connection.query(
      `INSERT INTO sessions (user_id, token, "createdAt") VALUES ($1,$2,$3);`,
      [user.id, token, new Date()]
    );

    return res.status(200).send({ token: token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
