const USER_SCHEMA = {
  id:    { type: 'integer', required: true },
  email: { type: 'string', required: true, format: 'email' },
  roles: { type: 'array', required: true, itemType: 'string' },
  name:  { type: 'string', required: false },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function matchesType(value, type) {
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeOf(value) === type;
}

function validateObject(obj, schema, prefix = '') {
  const errors = [];
  if (typeOf(obj) !== 'object') {
    return [`${prefix || 'значение'}: ожидался объект, получено ${typeOf(obj)}`];
  }
  for (const [field, rule] of Object.entries(schema)) {
    const where = prefix + field;
    if (!(field in obj)) {
      if (rule.required) errors.push(`${where}: обязательное поле отсутствует`);
      continue;
    }
    const value = obj[field];
    if (!matchesType(value, rule.type)) {
      errors.push(`${where}: ожидался тип ${rule.type}, получено ${typeOf(value)}`);
      continue;
    }
    if (rule.format === 'email' && !EMAIL_RE.test(value)) {
      errors.push(`${where}: некорректный email "${value}"`);
    }
    if (rule.type === 'array' && rule.itemType) {
      value.forEach((item, i) => {
        if (!matchesType(item, rule.itemType)) {
          errors.push(`${where}[${i}]: ожидался тип ${rule.itemType}, получено ${typeOf(item)}`);
        }
      });
    }
  }
  return errors;
}

function validateJson(jsonString, schema = USER_SCHEMA) {
  if (typeof jsonString !== 'string') {
    return { valid: false, errors: ['Вход должен быть строкой JSON'], data: null };
  }
  if (jsonString.trim() === '') {
    return { valid: false, errors: ['Пустая строка'], data: null };
  }

  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    return { valid: false, errors: [`Некорректный JSON: ${e.message}`], data: null };
  }

  const errors = [];
  if (Array.isArray(data)) {
    data.forEach((item, i) => errors.push(...validateObject(item, schema, `[${i}].`)));
  } else {
    errors.push(...validateObject(data, schema));
  }

  return { valid: errors.length === 0, errors, data: errors.length === 0 ? data : null };
}

module.exports = { validateJson, validateObject, USER_SCHEMA };
