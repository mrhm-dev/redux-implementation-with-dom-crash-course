// Basic Implementation of Redux
const createStore = (reducer, initState) => {
    const store = {}
    store.state = initState

    store.listeners = []

    store.getState = () => store.state

    store.subscribe = listener => store.listeners.push(listener)

    store.dispatch = action => {
        store.state = reducer(store.state, action)
        store.listeners.forEach(listener => listener())
    }

    return store
}

// Use of Redux

const reducer = (state, action) => {
    if (action.type === 'ADD') {
        return state + 10
    }

    if (action.type === 'SUB') {
        return state - 5
    }
    return state
}

const store = createStore(reducer, 0)

store.subscribe(() => {
    console.log(store.getState())
})

store.dispatch({ type: 'ADD' })
store.dispatch({ type: 'SUB' })
store.dispatch({ type: 'SUB' })
store.dispatch({ type: 'SUB' })
store.dispatch({ type: 'ADD' })


