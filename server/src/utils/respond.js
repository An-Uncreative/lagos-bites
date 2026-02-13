// src/utils/respond.js

export function ok(res, data = null, meta = null) {
  return res.json({ success: true, data, meta });
}

export function created(res, data) {
  return res.status(201).json({ success: true, data });
}

export function noContent(res) {
  return res.status(204).send();
}
