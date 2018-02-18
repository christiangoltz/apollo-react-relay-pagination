import relayPagination, { mergeResults } from "../";

it('merge single list', () => {
    const previousResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: '1' },
                    { id: '2' },
                    { id: '3' },
                ],
                pageInfo: {
                    endCursor: '3',
                    hasNextPage: 1
                }
            },
            name: 'asdf',
        }
    };

    const fetchMoreResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: '4' },
                    { id: '5' },
                    { id: '6' },
                ],
                pageInfo: {
                    endCursor: '6',
                    hasNextPage: 0
                }
            },
            name: 'asdf',
        }
    };

    const expectedResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: '1' },
                    { id: '2' },
                    { id: '3' },
                    { id: '4' },
                    { id: '5' },
                    { id: '6' },
                ],
                pageInfo: {
                    endCursor: '6',
                    hasNextPage: 0
                }
            },
            name: 'asdf',
        }
    };

    const result = mergeResults(previousResult, fetchMoreResult);

    expect(result).toEqual(expectedResult);
});


it('merge single list', () => {
    const previousResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: 'p1' },
                    { id: 'p2' },
                    { id: 'p3' },
                ],
                pageInfo: {
                    endCursor: 'p3',
                    hasNextPage: 1
                }
            },
            profile: {
                addresses: {
                    edges: [
                        {id: 'a1'},
                        {id: 'a2'},
                    ],
                    pageInfo: {
                        endCursor: 'a2',
                        hasNextPage: 1
                    }
                }
            },
            name: 'asdf',
        }
    };

    const fetchMoreResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: 'p4' },
                    { id: 'p5' },
                ],
                pageInfo: {
                    endCursor: 'p5',
                    hasNextPage: 0
                }
            },
            profile: {
                addresses: {
                    edges: [
                        {id: 'a3'},
                        {id: 'a4'},
                        {id: 'a5'},
                    ],
                    pageInfo: {
                        endCursor: 'a5',
                        hasNextPage: 0
                    }
                }
            },
            name: 'asdf',
        }
    };

    const expectedResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: 'p1' },
                    { id: 'p2' },
                    { id: 'p3' },
                    { id: 'p4' },
                    { id: 'p5' },
                ],
                pageInfo: {
                    endCursor: 'p5',
                    hasNextPage: 0
                }
            },
            profile: {
                addresses: {
                    edges: [
                        {id: 'a1'},
                        {id: 'a2'},
                        {id: 'a3'},
                        {id: 'a4'},
                        {id: 'a5'},
                    ],
                    pageInfo: {
                        endCursor: 'a5',
                        hasNextPage: 0
                    }
                }
            },
            name: 'asdf',
        }
    };

    const result = mergeResults(previousResult, fetchMoreResult);

    expect(result).toEqual(expectedResult);
});

it('merge new list', () => {
    const previousResult = {
        viewer: {
            id: '123',
            posts: null,
            name: 'asdf',
        }
    };

    const fetchMoreResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: '4' },
                    { id: '5' },
                    { id: '6' },
                ],
                pageInfo: {
                    endCursor: '6',
                    hasNextPage: 0
                }
            },
            name: 'asdf',
        }
    };

    const expectedResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: '4' },
                    { id: '5' },
                    { id: '6' },
                ],
                pageInfo: {
                    endCursor: '6',
                    hasNextPage: 0
                }
            },
            name: 'asdf',
        }
    };

    const result = mergeResults(previousResult, fetchMoreResult);

    expect(result).toEqual(expectedResult);
});


it('merge list missing in fetchMore', () => {
    const previousResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: '1' },
                    { id: '2' },
                    { id: '3' },
                ],
                pageInfo: {
                    endCursor: '3',
                    hasNextPage: 0
                }
            },
            name: 'asdf',
        }
    };

    const fetchMoreResult = {
        viewer: {
            id: '123',
            posts: null,
            name: 'asdf',
        }
    };

    const expectedResult = {
        viewer: {
            id: '123',
            posts: {
                edges: [
                    { id: '1' },
                    { id: '2' },
                    { id: '3' },
                ],
                pageInfo: {
                    endCursor: '3',
                    hasNextPage: 0
                }
            },
            name: 'asdf',
        }
    };

    const result = mergeResults(previousResult, fetchMoreResult);

    expect(result).toEqual(expectedResult);
});