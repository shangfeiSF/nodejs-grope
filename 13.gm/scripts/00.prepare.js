var path = require('path')
module.exports = function (images, relative) {
  var base = relative ?
    '../imgs' :
    path.join(__dirname, '../imgs')

  var result = {}

  for (var prop in images) {
    if (!images.hasOwnProperty(prop)) continue

    var dirs = prop.split('_')

    result[prop] = images[prop].map(function (filename) {
      var scope = dirs.concat(filename)

      return scope.reduce(function (prev, cur) {
        return path.join(prev, cur)
      }, base)
    })

  }
  return result
}