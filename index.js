'use strict';

/* Dependencies. */
var has = require('has');
var toH = require('hast-to-hyperscript');

/* Expose `rehype-react`. */
module.exports = rehype2react;

/* Get React’s `createElement`. */
var globalCreateElement;

try {
  /* eslint-disable import/no-extraneous-dependencies */
  globalCreateElement = require('react').createElement;
} catch (err) {}

/**
 * Attach a react compiler.
 *
 * @param {Unified} processor - Instance.
 * @param {Object?} [options]
 * @param {Object?} [options.components]
 *   - Components.
 * @param {string?} [options.prefix]
 *   - Key prefix.
 * @param {Function?} [options.createElement]
 *   - `h()`.
 */
function rehype2react(processor, options) {
  var settings = options || {};
  var createElement = settings.createElement || globalCreateElement;
  var components = settings.components || {};

  Compiler.prototype.compile = compile;

  processor.Compiler = Compiler;

  return;

  function Compiler() {}

  /* Compile HAST to React. */
  function compile(node) {
    if (node.type === 'root') {
      if (node.children.length === 1 && node.children[0].type === 'element') {
        node = node.children[0];
      } else {
        node = {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: node.children
        };
      }
    }

    return toH(h, node, settings.prefix);
  }

  /* Wrap `createElement` to pass components in. */
  function h(name, props, children) {
    var component = has(components, name) ? components[name] : name;
    return createElement(component, props, children);
  }
}
