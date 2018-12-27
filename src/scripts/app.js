import createStore from './createStore'
import reducer from './reducer'

let init = []

if (localStorage.getItem('bookmarks')) {
    init = JSON.parse(localStorage.getItem('bookmarks'))
}

const store = createStore(reducer, init)

const createBookmarkListItem = data => {
    const li = document.createElement('li')
    li.className = 'list-group-item d-flex'

    const img = document.createElement('img')
    img.src = `//logo.clearbit.com/${data.name}`
    img.alt = data.name
    img.className = 'avatar'

    const text = document.createElement('p')
    text.className = 'lead ml-4'
    text.innerHTML = data.name
    text.style.cursor = 'pointer'
    text.onclick = function () {
        window.open(data.url, '_blank')
    }

    const icons = document.createElement('div')
    icons.className = 'ml-auto'

    const fav = document.createElement('span')
    const i = document.createElement('i')
    i.className = `${data.isFavorite ? 'fas' : 'far'} fa-heart`
    fav.appendChild(i)
    fav.onclick = function () {
        store.dispatch({
            type: 'TOGGLE_FAVORITE',
            payload: data.id
        })
        localStorage.setItem('bookmarks', JSON.stringify(store.getState()))
    }

    const remove = document.createElement('span')
    remove.className = 'mx-3'
    remove.innerHTML = `<i class="fas fa-trash"></i>`
    remove.onclick = function () {
        store.dispatch({
            type: 'REMOVE_BOOKMARK',
            payload: data.id
        })
        localStorage.setItem('bookmarks', JSON.stringify(store.getState()))
    }

    icons.append(fav, remove)

    li.append(img, text, icons)

    return li
}

window.onload = function () {
    const favUL = document.getElementById('favoriteUL')
    const bookmarksUL = document.getElementById('bookmarksUL')
    const favCount = document.getElementById('favCount')
    const allCount = document.getElementById('allCount')

    // Check if there some data
    if (store.getState().length > 0) {
        store.getState().forEach(bookmark => {
            let li = createBookmarkListItem(bookmark)
            bookmarksUL.appendChild(li)
        })

        store.getState().forEach(bookmark => {
            if (bookmark.isFavorite) {
                let li = createBookmarkListItem(bookmark)
                favUL.appendChild(li)
            }
        })

        let favItems = store.getState().filter(bookmark => bookmark.isFavorite)
        favCount.innerHTML = favItems.length

        allCount.innerHTML = store.getState().length
    }

    const inp = document.getElementById('urlInput')
    inp.onkeypress = function (event) {
        if (event.key === 'Enter') {
            store.dispatch({
                type: 'ADD_BOOKMARK',
                payload: {
                    id: UUID(),
                    name: nameFromUrl(event.target.value),
                    url: event.target.value,
                    isFavorite: false
                }
            })
            localStorage.setItem('bookmarks', JSON.stringify(store.getState()))
            event.target.value = ''
        }
    }

    store.subscribe(() => {
        bookmarksUL.innerHTML = null
        store.getState().forEach(bookmark => {
            let li = createBookmarkListItem(bookmark)
            bookmarksUL.appendChild(li)
        })
    })

    store.subscribe(() => {
        favUL.innerHTML = null
        store.getState().forEach(bookmark => {
            if (bookmark.isFavorite) {
                let li = createBookmarkListItem(bookmark)
                favUL.appendChild(li)
            }
        })
    })

    store.subscribe(() => {
        let favItems = store.getState().filter(bookmark => bookmark.isFavorite)
        favCount.innerHTML = favItems.length
    })

    store.subscribe(() => {
        allCount.innerHTML = store.getState().length
    })
}



function UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function nameFromUrl(url) {
    return url.match(/:\/\/(.[^/]+)/)[1]
}