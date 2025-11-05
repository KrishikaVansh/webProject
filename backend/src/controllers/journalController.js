const knex = require('../db/knex');

const listForUser = async (req, res) => {
  const rows = await knex('journal_entries').where({ user_id: req.user.id }).orderBy('created_at', 'desc');
  res.json(rows);
};

const create = async (req, res) => {
  const { title, content } = req.body;
  const user_id = req.user.id;
  const [id] = await knex('journal_entries').insert({ user_id, title, content });
  const row = await knex('journal_entries').where({ id }).first();
  res.status(201).json(row);
};

const get = async (req, res) => {
  const { id } = req.params;
  const row = await knex('journal_entries').where({ id }).first();
  if (!row) return res.status(404).json({});
  if (row.user_id !== req.user.id && req.user.role !== 'therapist') return res.status(403).json({});
  res.json(row);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const row = await knex('journal_entries').where({ id }).first();
  if (!row) return res.status(404).json({});
  if (row.user_id !== req.user.id) return res.status(403).json({});
  await knex('journal_entries').where({ id }).update({ title, content });
  res.json({ message: 'Updated' });
};

const remove = async (req, res) => {
  const { id } = req.params;
  const row = await knex('journal_entries').where({ id }).first();
  if (!row) return res.status(404).json({});
  if (row.user_id !== req.user.id) return res.status(403).json({});
  await knex('journal_entries').where({ id }).del();
  res.json({ message: 'Deleted' });
};

const listForClient = async (req, res) => {
  const clientId = req.params.clientId;
  const rows = await knex('journal_entries').where({ user_id: clientId }).orderBy('created_at', 'desc');
  res.json(rows);
};

module.exports = { listForUser, create, get, update, remove, listForClient };
