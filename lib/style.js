var Style, path;

path = require("path");

Style = (function() {

  function Style(options) {
    this.selector = options.selector;
    this.pixelRatio = options.pixelRatio || 1;
    if (options.resolveImageSelector) {
      this.resolveImageSelector = options.resolveImageSelector;
    }
  }

  Style.prototype.css = function(selector, attributes) {
    return "" + selector + " {\n" + attributes + ";\n}\n";
  };

  Style.prototype.cssStyle = function(attributes) {
    return attributes.join(";\n");
  };

  Style.prototype.cssComment = function(comment) {
    return "/*\n" + comment + "\n*/";
  };

  Style.prototype.cssSelector = function(selector, image) {
    var all, deepest;
    all = image.name.replace(/__/g, ' ').replace(/--/g, ':').split(' ');
    deepest = [selector, all.pop()].join('.');
    all.push(deepest);
    return all.join(' ');
  };

  Style.prototype.generate = function(options) {
    var attr, css, image, imagePath, images, pixelRatio, relativeImagePath, styles, _i, _len;
    imagePath = options.imagePath, relativeImagePath = options.relativeImagePath, images = options.images, pixelRatio = options.pixelRatio;
    this.pixelRatio = pixelRatio || 1;
    styles = [this.css(this.selector, ["  background: url( '" + relativeImagePath + "' ) no-repeat"])];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      attr = ["  width: " + image.cssw + "px", "  height: " + image.cssh + "px", "  background-position: " + (-image.cssx) + "px " + (-image.cssy) + "px"];
      image.style = this.cssStyle(attr);
      image.selector = this.cssSelector(this.selector, image);
      styles.push(this.css(image.selector, image.style));
    }
    css = styles.join("\n");
    if (pixelRatio > 1) {
      css = this.wrapMediaQuery(css);
    }
    return css;
  };

  Style.prototype.comment = function(comment) {
    return this.cssComment(comment);
  };

  Style.prototype.wrapMediaQuery = function(css) {
    return "@media\n(min--moz-device-pixel-ratio: " + this.pixelRatio + "),\n(-o-min-device-pixel-ratio: " + this.pixelRatio + "/1),\n(-webkit-min-device-pixel-ratio: " + this.pixelRatio + "),\n(min-device-pixel-ratio: " + this.pixelRatio + ") {\n" + css + "}\n";
  };

  return Style;

})();

module.exports = Style;
