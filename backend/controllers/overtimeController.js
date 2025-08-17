const OvertimeRule = require('backend/models/OvertimeRule.js');
const OvertimeRequest = require('../models/OvertimeRequest');

const createRule = async (req, res) => {
  try {
    const rule = await OvertimeRule.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(rule);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const listRules = async (req, res) => {
  try {
    const rules = await OvertimeRule.find({ createdBy: req.user._id }).sort({ dayOfWeek: 1, startHour: 1 });
    res.json(rules);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateRule = async (req, res) => {
  try {
    const rule = await OvertimeRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: 'Rule not found' });
    if (String(rule.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
    Object.assign(rule, req.body);
    await rule.save();
    res.json(rule);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deleteRule = async (req, res) => {
  try {
    const rule = await OvertimeRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: 'Rule not found' });
    if (String(rule.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
    await rule.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

function pickRule(rules, date, hours) {
  const dow = new Date(date).getDay();
  const hr = new Date(date).getHours();
  return rules.find(r => r.dayOfWeek === dow && hr >= r.startHour && hr < r.endHour && hours >= r.minHours);
}

const createOvertime = async (req, res) => {
  try {
    const { date, hours, reason } = req.body;
    const myRules = await OvertimeRule.find({ createdBy: req.user._id });
    const rule = pickRule(myRules, date, hours);
    const ot = await OvertimeRequest.create({
      employee: req.user._id,
      date, hours, reason,
      appliedRule: rule?._id,
      multiplier: rule?.multiplier || 1.0,
      createdBy: req.user._id,
    });
    res.status(201).json(ot);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const listOvertime = async (req, res) => {
  try {
    const list = await OvertimeRequest.find({ employee: req.user._id })
      .sort({ date: -1 }).populate('appliedRule', 'name multiplier');
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const approveOvertime = async (req, res) => {
  try {
    const ot = await OvertimeRequest.findById(req.params.id);
    if (!ot) return res.status(404).json({ message: 'Overtime request not found' });
    ot.status = 'approved';
    ot.approver = req.user._id;
    await ot.save();
    res.json(ot);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const rejectOvertime = async (req, res) => {
  try {
    const ot = await OvertimeRequest.findById(req.params.id);
    if (!ot) return res.status(404).json({ message: 'Overtime request not found' });
    ot.status = 'rejected';
    ot.approver = req.user._id;
    await ot.save();
    res.json(ot);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

module.exports = {
  createRule, listRules, updateRule, deleteRule,
  createOvertime, listOvertime, approveOvertime, rejectOvertime
};
