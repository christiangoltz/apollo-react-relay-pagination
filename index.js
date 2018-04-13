import _ from 'lodash';
import React from 'react';

export function relayPagination(query, Component) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            console.log('component', Component)
        }

        loadMore = (reload, variables) => {
            return this.props.data.fetchMore({
                query,
                variables: Object.assign({}, this.props.data.variables, variables),
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    return mergeResults(previousResult, fetchMoreResult, reload);
                },
            });
        };

        render() {
            return <Component {...this.props} loadMore={this.loadMore}/>;
        }
    };
}

function mergeEdges(previous, current, reload) {
    const newEdges = current.edges;
    const pageInfo = current.pageInfo;
    let edges = [];

    if (reload) {
        edges = [ ...newEdges ];
    } else {
        if (previous) {
            edges = [ ...previous.edges, ...newEdges ];
        } else {
            edges = newEdges;
        }
    }
    return Object.assign({}, previous, {
        ...current,
        edges: edges,
        pageInfo: pageInfo
    });
}

export function mergeResults(previous, current, reload) {
    let result = {};

    if (previous === null || current === null) {
        return current;
    } else if (Array.isArray(current) || Array.isArray(previous)) {
        return current;
    } else if (typeof current === 'object') {
        for (let property of _.keys(current)) {
            if (property === 'edges') {
                return mergeEdges(previous, current, reload);
            } else {
                result[property] = mergeResults(previous[property], current[property], reload);
            }
        }
    } else {
        return current;
    }

    return Object.assign({}, previous, result);
}
