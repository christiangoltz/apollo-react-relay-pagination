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

function mergeEdges(property, previousProperty, reload) {
    const newEdges = property.edges;
    const pageInfo = property.pageInfo;
    let edges = [];

    if (reload) {
        edges = [ ...newEdges ];
    } else {
        if (previousProperty) {
            edges = [ ...previousProperty.edges, ...newEdges ];
        } else {
            edges = newEdges;
        }
    }
    return Object.assign({}, previousProperty, {
        ...property,
        edges: edges,
        pageInfo: pageInfo
    });
}

export function mergeResults(previousParent, parent, reload) {
    let result = {};
    if (typeof parent === 'object') {
        for (let property of _.keys(parent)) {
            if (property === 'edges') {
                return mergeEdges(parent, previousParent, reload);
            } else {
                result[property] = mergeResults(previousParent[property], parent[property]);
            }
        }
    } else {
        return parent;
    }

    return Object.assign({}, previousParent, result);
}