import connection from '../db/pgsql.js';

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    const params = [];
    let whereClause = '';

    if (name) {
      params.push(`${name}%`);
      whereClause += `WHERE games.name ILIKE $${params.length}`;
    }

    const result = await connection.query(
      `
      SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId"
      ${whereClause}
    `,
      params
    );

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // internal server error
  }
}
export async function createGame(req, res) {
  try {
    const newGame = req.body;

    const result = await connection.query('SELECT * FROM categories WHERE id = $1', [
      newGame.categoryId
    ]);

    if (result.rowCount === 0) {
      return res.sendStatus(400);
    }

    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
      [
        newGame.name,
        newGame.image,
        Number(newGame.stockTotal),
        newGame.categoryId,
        Number(newGame.pricePerDay)
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    resizeBy.sendStatus(500);
  }
}
