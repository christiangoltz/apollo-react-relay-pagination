'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.relayPagination = relayPagination;
exports.mergeResults = mergeResults;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function relayPagination(query, Component) {
    return function (_React$Component) {
        _inherits(_class2, _React$Component);

        function _class2(props) {
            _classCallCheck(this, _class2);

            var _this = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props));

            _this.loadMore = function (reload, variables) {
                return _this.props.data.fetchMore({
                    query: query,
                    variables: Object.assign({}, _this.props.data.variables, variables),
                    updateQuery: function updateQuery(previousResult, _ref) {
                        var fetchMoreResult = _ref.fetchMoreResult;

                        return mergeResults(previousResult, fetchMoreResult, reload);
                    }
                });
            };

            console.log('component', Component);
            return _this;
        }

        _createClass(_class2, [{
            key: 'render',
            value: function render() {
                return _react2.default.createElement(Component, _extends({}, this.props, { loadMore: this.loadMore }));
            }
        }]);

        return _class2;
    }(_react2.default.Component);
}

function mergeEdges(previous, current, reload) {
    var newEdges = current.edges;
    var pageInfo = current.pageInfo;
    var edges = [];

    if (reload) {
        edges = [].concat(_toConsumableArray(newEdges));
    } else {
        if (previous) {
            edges = [].concat(_toConsumableArray(previous.edges), _toConsumableArray(newEdges));
        } else {
            edges = newEdges;
        }
    }
    return Object.assign({}, previous, _extends({}, current, {
        edges: edges,
        pageInfo: pageInfo
    }));
}

function mergeResults(previous, current, reload) {
    var result = {};
    if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _lodash2.default.keys(current)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var property = _step.value;

                if (property === 'edges') {
                    return mergeEdges(previous, current, reload);
                } else {
                    result[property] = mergeResults(previous[property], current[property], reload);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    } else {
        return current;
    }

    return Object.assign({}, previous, result);
}