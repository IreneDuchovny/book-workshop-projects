'use strict'
const PAGE_SIZE = 5
const gBookNames= [ "Harry potter", "lord of the rings", "JS for dummies","Me vs brain" ]
const STORAGE_KEY = 'booksDB'
const bookImg= [ 'img/Harrypotter.jpg', 'img/lordoftherings.jpg', 'img/JSfordummies.jpg', 'img/Mevsbrain.jpg' ]
var gBooks
var gFilterBy = {maxPrice: 400, minRate: 0}
var gPageIdx = 0


_createBooks()
// Code an app that shows a list of books: id, name, price, imgUrl.

function _createBook(name, price, imgUrl= 'img/book.jpg') {
    return {
        id: makeId(),
        name: name ,
        price: price,
        imgUrl:imgUrl,
        rate: 0
    }
}

function _createBooks() {
var books=  loadFromStorage(STORAGE_KEY)
   // Nothing in storage - generate demo data
   if (!books || !books.length) {
    books = []
    for (let i = 0; i < 3; i++) {
        var demoBook = gBookNames[i]
        books.push(_createBook(demoBook, getRandomIntInclusive(10, 100), bookImg[i]))
        console.log('', demoBook)
    }
}
gBooks = books
saveBooksToStorage()
}

function getBooks(){
    // console.log('gFilterBy', gFilterBy)
    // console.log('gbooks', gBooks)
    const regex = new RegExp(gFilterBy.search, 'ig');
    // return gBooks
    var bookFilter= gBooks.filter((book) => book.price <= gFilterBy.maxPrice &&
     book.rate >= gFilterBy.minRate 
     && (book.name.match(regex) || !gFilterBy.search))
     
     const startIdx = gPageIdx * PAGE_SIZE
     return bookFilter.slice(startIdx, startIdx + PAGE_SIZE)
    
}
function saveBooksToStorage(){
    saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId){
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    saveBooksToStorage()
}
 
function addBook(name, price){
    const book = _createBook(name, price)
    gBooks.unshift(book)
    saveBooksToStorage()
   // return book
}

function updateBook(bookId,bookPrice){
var book= getBookById(bookId)
book.price= bookPrice
saveBooksToStorage()
}

function getBookById(bookId){
    var foundBook= gBooks.find(book => bookId === book.id)
    return foundBook
}

function rateChange(bookId, diff){
    var book= getBookById(bookId) 
    if (book.rate + diff > 10 || book.rate + diff < 0) return
    book.rate +=  diff
    // console.log('book.rate', book.rate)
    saveBooksToStorage()
}


function setFilterBy(filterBy={}){
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.search !== undefined) gFilterBy.search = filterBy.search
    return gFilterBy
}


function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx--
        // console.log('nectgPageIdx',gPageIdx )
        return -1
    }
}

function prevPage() {
    gPageIdx--
    if (gPageIdx < 0) {
        gPageIdx++
        // console.log('prevgPageIdx',gPageIdx )
        return -1
    }
}
