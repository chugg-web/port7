const fs = require('fs');
const path = require('path');
const assert = require('assert');

const FILE = path.join(__dirname, 'tasks.json');

const tasks = [
  { id: 1, title: 'Сделать домашнее задание', done: false, tags: ['учёба', 'JSON'] },
  { id: 2, title: 'Купить продукты', done: true, tags: [] },
  { id: 3, title: 'Загрузить проект на GitHub', done: false, tags: ['git'] },
];

function serialize(data) {
  return JSON.stringify(data, null, 2);
}

function deserialize(jsonString) {
  return JSON.parse(jsonString);
}

function saveToFile(data, file = FILE) {
  fs.writeFileSync(file, serialize(data), 'utf8');
}

function loadFromFile(file = FILE) {
  return deserialize(fs.readFileSync(file, 'utf8'));
}

if (require.main === module) {
  const jsonString = serialize(tasks);
  console.log('JSON-строка:\n' + jsonString);

  const fromString = deserialize(jsonString);
  assert.deepStrictEqual(fromString, tasks);
  console.log('\n✔ Чтение из переменной: данные совпали');

  saveToFile(tasks);
  console.log('✔ Сохранено в файл:', FILE);
  const fromFile = loadFromFile();
  assert.deepStrictEqual(fromFile, tasks);
  console.log('✔ Чтение из файла: данные совпали');
  console.log('\nПрочитанные задачи:');
  fromFile.forEach(t => console.log(`  [${t.done ? 'x' : ' '}] #${t.id} ${t.title}`));
}

module.exports = { serialize, deserialize, saveToFile, loadFromFile };
