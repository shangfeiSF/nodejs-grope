var now = new Date()
var today = now.toJSON()
var yesterday = new Date(+new Date() - 24 * 60 * 60 * 1000).toJSON()

module.exports = {
  // short 中的配置参数必须是字符串，否则会报错
  'module': '--name',

  'yes': ['--answer', 'true'],
  'no': ['--answer', 'false'],

  's200': ['--status', '200'],

  'today': ['--time', today],
  'yesterday': ['--time', yesterday],

  'array3': ['--item', '1', '--item', '2', '--item', '3'],
  'cwd': ['--path', './'],
  'github': ['--website', 'https://github.com'],
  // 'l': ['--log'],
  'dinosaurs': ['--deprecated', '1'], // try to set deprecated option again!

  'env-dev': ['--environment', 'develop'],
  'env-dail': ['--environment', 'prepare'],

  'mix-1-null': ['--mix-1', 'null'],
  'mix-2-null': ['--mix-2', 'null'],
  'mix-3-null': ['--mix-3', 'null'],
  'mix-4-null': ['--mix-4', 'null'],
  'mix-5-null': ['--mix-5', 'null'],
  'mix-6-null': ['--mix-6', 'null'],
  'mix-7-null': ['--mix-7', 'null']
}