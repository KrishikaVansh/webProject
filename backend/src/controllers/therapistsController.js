const knex = require('../db/knex');

const list = async (req, res) => {
  const therapists = await knex('users').where({ role: 'therapist' }).select('id','name','email');
  res.json(therapists);
};

const availability = async (req, res) => {
  const { id } = req.params;
  const profile = await knex('therapist_profiles').where({ user_id: id }).first();
  if (!profile) return res.json({ availability: [] });
  res.json({ availability: profile.availability || [] });
};

module.exports = { list, availability };
