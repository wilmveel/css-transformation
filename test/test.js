var fs = require('fs');
var assert = require('assert');

const cssChunks = require('../src/index.js');

describe('Test', function () {

  describe('simple', function () {
    const content = fs.readFileSync(__dirname + '/css/simple.css');

    it('one match', function () {
      const config = {
        "test": {
          "types": [
            "rule"
          ],
          "matches": {
            "^(\.content)$": "::host($1)"
          }
        }
      };
      const res = cssChunks(content, config)
      assert.equal(res.test, "::host(.content) {\n  color: #000;\n}");
    });


    it('no matches', function () {
      const config = {
        "test": {
          "types": [
            "rule"
          ]
        }
      };
      const res = cssChunks(content, config)
      assert.equal(res.test, ".content {\n  color: #000;\n}");

    });

  });

  describe('double', function () {
    const content = fs.readFileSync(__dirname + '/css/double.css');

    it('two matches', function () {
      const config = {
        "test": {
          "types": [
            "rule"
          ],
          "matches": {
            "^(\.main)?$": "::host($1) 1",
            "^(\.content)?$": "::host($1) 2"
          }
        }
      };
      const res = cssChunks(content, config)
      assert.equal(res.test, "::host(.main) 1 {\n  color: #FFF;\n}\n\n::host(.content) 2 {\n  color: #000;\n}");
    });


    it('two rules', function () {
      const config = {
        "test1": {
          "types": [
            "rule"
          ],
          "matches": {
            "^(\.main)?$": "::host($1) 1",
          }
        },
        "test2": {
          "types": [
            "rule"
          ],
          "matches": {
            "^(\.content)?$": "::host($1) 2"
          }
        }
      };
      const res = cssChunks(content, config)
      assert.equal(res.test1, "::host(.main) 1 {\n  color: #FFF;\n}");
      assert.equal(res.test2, "::host(.content) 2 {\n  color: #000;\n}");
    });


    it('no matches', function () {
      const config = {
        "test": {
          "types": [
            "rule"
          ]
        }
      };
      const res = cssChunks(content, config)
      assert.equal(res.test, ".main {\n  color: #FFF;\n}\n\n.content {\n  color: #000;\n}");
    });
  });


  describe('mediatype', function () {
    const content = fs.readFileSync(__dirname + '/css/mediatype.css');

    it('one match', function () {
      const config = {
        "test": {
          "types": [
            "rule"
          ],
          "matches": {
            "^(\.content)$": "::host($1)"
          }
        }
      };
      const res = cssChunks(content, config)
      assert.equal(res.test, "@media (max-width: 600px) {\n  ::host(.content) {\n    color: #000;\n  }\n}");
    });

  });

});
