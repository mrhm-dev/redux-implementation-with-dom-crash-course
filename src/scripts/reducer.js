const init = [
    {
        id: 'abcsedwd23d2',
        name: 'facebook.com',
        url: 'https://facebook.com',
        isFavorite: false
    }
]

const reducer = (state = init, action) => {
    switch (action.type) {
        case 'ADD_BOOKMARK': { 
            let bookmarks = state.concat(action.payload)
            return bookmarks
        }
        case 'REMOVE_BOOKMARK': {
            let bookmarks = state.filter(bookmark => bookmark.id !== action.payload)
            return bookmarks
        }
        case "TOGGLE_FAVORITE": {
            let bookmarks = state.map(bookmark => {
                if (bookmark.id === action.payload) {
                    bookmark.isFavorite = !bookmark.isFavorite
                }
                return bookmark
            })
            return bookmarks
        }
        default: return state
    }
}

export default reducer