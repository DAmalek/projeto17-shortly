import connection from "../database/database.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const emailExists = connection.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (emailExists.rowCount !== 0) return res.sendStatus(409);

  try {
    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await connection.query(
      `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3);
    `,
      [name, email, passwordHash]
    );

    return res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Algo deu errado no servidor!");
  }
}
