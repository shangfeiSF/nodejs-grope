module.exports = {
  v: ["--version"],

  s: ["--loglevel", "silent"],

  silent: ["--loglevel", "silent"],

  d: ["--loglevel", "info"],
  dd: ["--loglevel", "verbose"],

  verbose: ["--loglevel", "verbose"],

  ddd: ["--loglevel", "silly"],
  reg: ["--registry"],
  noreg: ["--no-registry"],

  "no-reg": ["--no-registry"],
  h: ["--usage"],
  H: ["--usage"],
  "?": ["--usage"],
  help: ["--usage"],

  f: ["--force"],
  l: ["--long"],

  desc: ["--description"],
  "no-desc": ["--no-description"],

  p: ["--parseable"],
  porcelain: ["--parseable"],

  g: ["--global"],
  local: ["--no-global"]
}