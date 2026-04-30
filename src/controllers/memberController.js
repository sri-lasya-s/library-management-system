const { Member } = require('../models');

exports.getAllMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Member.findAndCountAll({
      limit: parseInt(limit), offset: parseInt(offset)
    });
    res.json({ total: count, page: parseInt(page), totalPages: Math.ceil(count / limit), data: rows });
  } catch (err) { next(err); }
};

exports.getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) { next(err); }
};

exports.createMember = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
    const member = await Member.create({ name, email, phone });
    res.status(201).json(member);
  } catch (err) { next(err); }
};

exports.updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    const { name, email, phone } = req.body;
    await member.update({ name, email, phone });
    res.json(member);
  } catch (err) { next(err); }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    await member.destroy();
    res.json({ message: 'Member deleted successfully' });
  } catch (err) { next(err); }
};