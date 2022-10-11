import connection from '../db/pgsql.js';

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await connection.query('SELECT * FROM categories');

    res.status(200).send(categories);
  } catch (error) {
    console.log(error);
    resizeBy.sendStatus(500);
  }
}

export async function createCategory(req, res) {
  try {
    const newCategory = req.body;

    const result = await connection.query('SELECT * FROM categories WHERE name = $1', [
      newCategory.name
    ]);

    if (result.rowCount > 0) {
      return res.sendStatus(409);
    }

    await connection.query('INSERT INTO categories (name) VALUES ($1)', [
      newCategory.name
    ]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    resizeBy.sendStatus(500);
  }
}
