// src/utils/respond.js

export function ok(res, data = null, meta = null, message = null) {
  const payload = {
    success: true,
  };

  if (message) payload.message = message;
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;

  return res.status(200).json(payload);
}

export function created(res, data = null, message = null) {
  const payload = {
    success: true,
  };

  if (message) payload.message = message;
  if (data !== null) payload.data = data;

  return res.status(201).json(payload);
}

export function noContent(res) {
  return res.status(204).send();
}
