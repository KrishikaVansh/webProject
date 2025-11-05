const knex = require('../db/knex');

const listForUser = async (req, res) => {
  const userId = req.user.id;
  const asClient = await knex('appointments').where({ client_id: userId }).orderBy('appointment_time', 'desc');
  const asTherapist = await knex('appointments').where({ therapist_id: userId }).orderBy('appointment_time', 'desc');
  res.json({ asClient, asTherapist });
};

const create = async (req, res) => {
  try {
    const { therapist_id, appointment_time } = req.body;
    const client_id = req.user.id;
    const conflict = await knex('appointments')
      .where('therapist_id', therapist_id)
      .andWhere('status', 'scheduled')
      .andWhere('appointment_time', appointment_time)
      .first();
    if (conflict) return res.status(409).json({ message: 'Slot already booked' });
    const [id] = await knex('appointments').insert({ client_id, therapist_id, appointment_time });
    const appointment = await knex('appointments').where({ id }).first();
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const cancel = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const appt = await knex('appointments').where({ id }).first();
  if (!appt) return res.status(404).json({ message: 'Not found' });
  if (appt.client_id !== userId && appt.therapist_id !== userId && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await knex('appointments').where({ id }).update({ status: 'cancelled' });
  res.json({ message: 'Cancelled' });
};

module.exports = { listForUser, create, cancel };
