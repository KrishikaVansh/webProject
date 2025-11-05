const knex = require('../db/knex');

const listForUser = async (req, res) => {
  const rows = await knex('mood_entries').where({ user_id: req.user.id }).orderBy('entry_date', 'desc');
  res.json(rows);
};

const create = async (req, res) => {
  const { mood_rating, notes, entry_date } = req.body;
  const user_id = req.user.id;
  const [id] = await knex('mood_entries').insert({ user_id, mood_rating, notes, entry_date });
  const row = await knex('mood_entries').where({ id }).first();
  res.status(201).json(row);
};

const listForClient = async (req, res) => {
  const clientId = req.params.clientId;
  const rows = await knex('mood_entries').where({ user_id: clientId }).orderBy('entry_date', 'desc');
  res.json(rows);
};

module.exports = { listForUser, create, listForClient };
