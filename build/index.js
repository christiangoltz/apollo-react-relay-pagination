var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import _ from 'lodash';
import React from 'react';

export function relayPagination(query, Component) {
    return class extends React.Component {
        constructor(props) {
            var _this;

            _this = super(props);

            this.loadMore = function (reload, variables) {
                return _this.props.data.fetchMore({
                    query,
                    variables: Object.assign({}, _this.props.data.variables, variables),
                    updateQuery: function (previousResult, { fetchMoreResult }) {
                        return mergeResults(previousResult, fetchMoreResult, reload);
                    }
                });
            };

            console.log('component', Component);
        }

        render() {
            return React.createElement(Component, _extends({}, this.props, { loadMore: this.loadMore }));
        }
    };
}

function mergeEdges(previous, current, reload) {
    const newEdges = current.edges;
    const pageInfo = current.pageInfo;
    let edges = [];

    if (reload) {
        edges = [...newEdges];
    } else {
        if (previous) {
            edges = [...previous.edges, ...newEdges];
        } else {
            edges = newEdges;
        }
    }
    return Object.assign({}, previous, _extends({}, current, {
        edges: edges,
        pageInfo: pageInfo
    }));
}

export function mergeResults(previous, current, reload) {
    let result = {};
    if (typeof current === 'object') {
        for (let property of _.keys(current)) {
            if (property === 'edges') {
                return mergeEdges(previous, current, reload);
            } else {
                result[property] = mergeResults(previous[property], current[property]);
            }
        }
    } else {
        return current;
    }

    return Object.assign({}, previous, result);
}