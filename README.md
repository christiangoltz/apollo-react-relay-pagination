# apollo-react-relay-pagination

This library provides an abstraction for relay style pagination for apollo and react.

# Usage

## Wrapping the whole component
This should be your preferred method of integration. Just enhance your component using `relayPagination` and then use the `loadMore` method from the props as shown below.

```
import { relayPagination } from "../helpers/ApolloRelayPagination";


class ItemsBase extends React.Component {
    render() {
        ...
    }

    // call this whenever you want to load more elements (e.g. from componentDidUpdate)
    load (reload) {
        if (!this.state.loadingMore) {
            if (reload || (this.props.dataReady && this.props.data.viewer.items.pageInfo.hasNextPage)) {
                this.setState(previousState => ({...previousState, loadingMore: true}));
                this.props.loadMore(reload, { after: reload ? null: this.props.data.items.pageInfo.endCursor});
                this.setState(previousState => ({...previousState, loadingMore: false}));
            }
        }
    }
}

const ItemsWithPagination = relayPagination(ItemsQuery, ItemsBase);
const ItemsWithData = graphql(ItemsQuery)(ItemsWithPagination);
```

## Using the merge function directly
The library additionally provides the function `mergeResults` that merges a new response containing a paginated list into a previous version of the same answer. You can use this to have more flexibility.
```
import { relayPagination } from "../helpers/ApolloRelayPagination";


class ItemsBase extends React.Component {
    render() {
        ...
    }
}

export function getProps(props) {
    props.loadMore = (reload) => {
        let variables = ...;
        if (!reload) {
            variables.after = props.data.viewer.profile.groups.pageInfo.endCursor;
        }

        return props.data.fetchMore({
            query: ItemsQuery,
            variables,
            updateQuery: (previousResult, { fetchMoreResult }) => {
                return mergeResults(previousResult, fetchMoreResult, reload)
            },
        });
    };
    return props;
}

const ItemsWithData = graphql(ItemsQuery, {
    props: getProps,
})(ItemsWithPagination);
```

## Exported functions

### relayPagination(query, Component)
Returns a HOC that should be wrapped with `graphql` itself and will provide a `loadMore` method as property to the defined `Component`.

- query: the query to use for the `loadMore` method
- Component: the component to wrap

### mergeResults(previous, current, reload)
Merges two objects by overwriting all the values from `previous` with the ones from `current` besides the children that are named `edges`, which will be merged. If `reload` is true, then all edges from `previous` are discarded.