/*!
 * cnso v1.0.0 (https://github.com/alireza-molaee/cnso)
 * circle nested options to select  
 * Copyright 2017-2017 alireza molaee
 * Licensed under MIT (https://github.com/alireza-molaee/cnso/blob/master/LICENSE)
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cnso = function () {
  function Cnso(_ref) {
    var _this = this;

    var _ref$container = _ref.container,
        container = _ref$container === undefined ? "my-cnso" : _ref$container,
        data = _ref.data;

    _classCallCheck(this, Cnso);

    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.data = data;
    setTimeout(function () {
      _this.setup();
    }, 100);
    window.addEventListener('resize', this.onResize.bind(this));
  }

  _createClass(Cnso, [{
    key: 'setup',
    value: function setup() {
      this.calculateDistance();
      this.stage = new Konva.Stage({
        container: this.container,
        width: this.width,
        height: this.height
      });
      this.optionLayers = [];
      this.lineLayer = new Konva.Layer();
      this.stage.add(this.lineLayer);
      this.itrateOnData(this.data);
    }
  }, {
    key: 'itrateOnData',
    value: function itrateOnData(data) {
      var _this2 = this;

      var keys = Object.keys(data);
      if (keys.length !== 1) {
        throw new Error("data structure is not correct!");
      }
      this.renderOption(keys[0], this.stage.getWidth() / 2, this.stage.getHeight() / 2, this.minDistance / 12);
      var options = Object.entries(data[keys[0]]);
      var radianPerOption = Math.PI * 2 / options.length;
      var circleRadiusLayout = this.minDistance / 3;
      var maxRForOption = (circleRadiusLayout * Math.sin(radianPerOption / 2) * 2 - 10) / 2;
      var radius = this.minDistance / 12 <= maxRForOption ? this.minDistance / 12 : maxRForOption;
      options.forEach(function (element, index) {
        _this2.renderOption(element[0], _this2.stage.getWidth() / 2 + Math.cos(index * radianPerOption) * circleRadiusLayout, _this2.stage.getHeight() / 2 + Math.sin(index * radianPerOption) * circleRadiusLayout, radius);
      });
    }
  }, {
    key: 'renderOption',
    value: function renderOption(label, x, y, r) {
      var labelObj = new Konva.Text({
        x: x,
        y: y,
        text: label,
        fontSize: 15,
        fontFamily: 'Calibri',
        fill: 'black'
      });
      labelObj.offsetX(labelObj.width() / 2);
      labelObj.offsetY(labelObj.height() / 2);
      var circleObj = new Konva.Circle({
        x: x,
        y: y,
        radius: r,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
      });
      var layer = new Konva.Layer();
      layer.add(circleObj, labelObj);
      this.stage.add(layer);
    }
  }, {
    key: 'onResize',
    value: function onResize(event) {
      this.calculateDistance();
    }
  }, {
    key: 'calculateDistance',
    value: function calculateDistance() {
      this.height = this.container.offsetHeight;
      this.width = this.container.offsetWidth;
      this.minDistance = this.height <= this.width ? this.height : this.width;
    }
  }]);

  return Cnso;
}();

exports.default = Cnso;


window["Cnso"] = Cnso;

},{}]},{},[1]);
