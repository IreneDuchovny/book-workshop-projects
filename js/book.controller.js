'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    const headerHtml = `<th>ID </th> <th>Book Name </th>  <th> Price </th> <th> Actions </th>`

    var strHtmls = books.map(book => `
    <tr><td>${book.id}</td> <td>${book.name}</td> <td><b>${book.price}</b> ₪</td> <td>
    
    <button class="read-button" onclick="onReadBook('${book.id}')">Read</button>
    <button class="update-button" onclick="onUpdateBook('${book.id}')">Update</button>
    <button class="delete-button" onclick="onRemoveBook('${book.id}')">Delete</button>
    </td> </tr>  `)
    //   console.log('strHtmls', strHtmls)
    document.querySelector('.books-list').innerHTML = strHtmls.join('')
    document.querySelector('.book-header').innerHTML = headerHtml
    // console.log('strHtmls', strHtmls.join(''))
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elBookModalH3 = document.querySelector('.read-modal h3')
    elBookModalH3.innerText = book.name
    var elBookModalImg = document.querySelector('.book-img')
    elBookModalImg.innerHTML = `<img src="${book.imgUrl}">`
    var elBookModal = document.querySelector('.read-modal')
    var elRateBtn = document.querySelector('.rate-buttons')
    elRateBtn.innerHTML = `Book rating: <button class="rate-button" onclick="onRateChange('${book.id}',-1)">-</button>
    <span>  ${book.rate}  </span><button class="rate-button" onclick="onRateChange('${book.id}',1)">+</button>`
    elBookModal.classList.add('open')
}

function onRateChange(bookId, diff) {
    // console.log('rateChange', rateChange)

    rateChange(bookId, diff)
    onReadBook(bookId)

}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onCloseBookModal() {
    document.querySelector('.read-modal').classList.remove('open')
}

function onAddBook() {
    const bookName = prompt('Add a Book Name')
    const bookPrice = +prompt('Add a book Price')
    if (bookName && bookPrice) {
        addBook(bookName, bookPrice)
        renderBooks()
    }

}

function onUpdateBook(bookId) {
    const bookPrice = +prompt('Update the book Price')
    if (bookPrice && bookPrice !== getBookById(bookId).price) {
        updateBook(bookId, bookPrice)
        renderBooks()
        console.log('bookPrice', bookPrice)
    }
}

function onSetFilterBy(filterBy) {
    console.log('filterBy', filterBy)
    setFilterBy(filterBy)
    renderBooks()

    var queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    if (filterBy.search) queryStringParams += `&search=${filterBy.search}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}


function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 400,
        minRate: +queryStringParams.get('minRate') || 0,
        search: queryStringParams.get('search') || ''
    }

    if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.search) return

    console.log('no return')
    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    document.querySelector('.search-input').value = filterBy.search

    setFilterBy(filterBy)
}

function onNextPage() {

    if (nextPage() === -1) {
        var elnextPageBtn = document.querySelector('.next-page')
        elnextPageBtn.disabled = true
    } else {
        var elprevPageBtn = document.querySelector('.previous-page')
        elprevPageBtn.disabled = false
    }
    renderBooks()
}

function onPrevPage() {
    if (prevPage() === -1) {
        var elprevPageBtn = document.querySelector('.previous-page')
        elprevPageBtn.disabled = true
    }
    else {
        var elnextPageBtn = document.querySelector('.next-page')
        elnextPageBtn.disabled = false
    }
    renderBooks()
}