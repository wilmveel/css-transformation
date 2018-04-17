const css = require('css')

function transform(rule, matches) {
  if(rule.type === "keyframes"){
    return rule
  }

  return Object.keys(matches)
    .filter(match => rule.type === "media" || rule.selectors.reduce((acc, cur) => {
      const regex = new RegExp(match);
      return acc ? acc : cur.match(regex);
    }, false))
    .map(match => {
      const replace = matches[match];
      const regex = new RegExp(match);
      return {
        type: rule.type,
        media: rule.media,
        selectors: rule.selectors ? rule.selectors.map(selector => {
          return selector.replace(regex, replace);
        }) : null,
        declarations: rule.declarations,
        rules: rule.rules ? rule.rules.map(x => transform(x, matches)).reduce((acc, cur) => acc.concat(cur), []) : null
      }
    })
    .reduce((acc, cur) => acc.concat(cur), []);
}

module.exports = function (content, config, options) {

  const parse = css.parse(content.toString())
  return Object.keys(config)
    .map(chunk => {

      const mapping = config[chunk];
      const types = Array.isArray(mapping.types) ? mapping.types : [mapping.types];
      const matches = !mapping.matches ? {"(.*)": "$1"} : mapping.matches;

      return {
        key: chunk,
        value: parse.stylesheet.rules
          .filter(rule => rule.type === "media" || types.includes(rule.type))
          .map(rule => transform(rule, matches))
          .reduce((acc, cur) => acc.concat(cur), [])
      }
    })
    .reduce((acc, cur) => {
      const value = {
        stylesheet: {
          rules: cur.value
        }
      };
      acc[cur.key] = css.stringify(value);
      return acc
    }, {})
};