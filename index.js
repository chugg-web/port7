const { validateJson } = require('./validator');
require('child_process').execFileSync('node',[require('path').join(__dirname,'todo.js')],{stdio:'inherit'});

console.log('\n==== ВАЛИДАТОР JSON ====');

const cases = {
  'Корректный объект': '{"id":1,"email":"max@example.com","roles":["admin","user"]}',
  'Массив корректных объектов': '[{"id":1,"email":"a@b.com","roles":["user"]},{"id":2,"email":"c@d.org","roles":[]}]',
  'Нет поля email': '{"id":1,"roles":["user"]}',
  'Неверный тип id': '{"id":"1","email":"a@b.com","roles":["user"]}',
  'roles не массив': '{"id":1,"email":"a@b.com","roles":"admin"}',
  'Неверный email': '{"id":1,"email":"not-an-email","roles":["user"]}',
  'Неверный элемент roles': '{"id":1,"email":"a@b.com","roles":["user",5]}',
  'Битый JSON': '{"id":1,"email":',
  'Пустая строка': '',
};

for (const [name, json] of Object.entries(cases)) {
  const r = validateJson(json);
  console.log(`\n${r.valid ? '✔' : '✘'} ${name}`);
  r.errors.forEach(e => console.log('   -', e));
}
