$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  $('#bookShelf').on('click', '.deleteBook', deleteHandler)

  $('#bookShelf').on('click', '.markRead', markReadHandler)

  // TODO - Add code for edit & delete buttons
}

function markReadHandler (){
  // console.log('clicked mark as read');
  markAsRead($(this).data("id"), $(this).data("read"));
  // console.log('is data working?', $(this).data("read"));
}

function markAsRead (bookId, readStatus){
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}`,
    data: {
      readStatus: readStatus
    }
  }).then (response => {
    console.log('marked as read');
    refreshBooks();
  }).catch (err => {
    console.log('you have not read this', err);
    alert('there was a problem marking book as read');
  });
}

function deleteHandler(){
  console.log('clicked delete');
  deleteBook($(this).data("id"));
}

function deleteBook (bookId){
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`
  }).then (response => {
    console.log('deleted song');
    refreshBooks();
  }).catch( err => {
    alert('there was a problem deleting that book. try again.', err);
  });
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="markRead" data-id="${book.id}" data-read="${book.isRead}">Mark as Read</button></td>
        <td><button class="deleteBook" data-id="${book.id}">Delete Book</button></td>
      </tr>
    `);
    // console.log('is read info', book.isRead);
  }
}
