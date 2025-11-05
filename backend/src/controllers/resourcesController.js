const knex = require('../db/knex');

const list = async (req, res) => {
  const rows = await knex('resources').orderBy('id','desc');
  res.json(rows);
};

const get = async (req, res) => {
  const { id } = req.params;
  const row = await knex('resources').where({ id }).first();
  if (!row) return res.status(404).json({});
  res.json(row);
};

const create = async (req, res) => {
  const { title, description, video_url, category } = req.body;
  const [id] = await knex('resources').insert({ title, description, video_url, category });
  const row = await knex('resources').where({ id }).first();
  res.status(201).json(row);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { title, description, video_url, category } = req.body;
  await knex('resources').where({ id }).update({ title, description, video_url, category });
  res.json({ message: 'Updated' });
};

const remove = async (req, res) => {
  const { id } = req.params;
  await knex('resources').where({ id }).del();
  res.json({ message: 'Deleted' });
};

module.exports = { list, get, create, update, remove };
