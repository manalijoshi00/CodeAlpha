// Book constructor
function Book(title, author, isbn, category) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
  this.category = category;
  this.borrowed = false;
  this.borrowedBy = null;
  this.borrowedOn = null;
}

// Get books from localStorage or set an empty array if none found
let library = JSON.parse(localStorage.getItem('library')) || [];

// Add book to the library and save to localStorage
function addBookToLibrary(book) {
  library.push(book);
  localStorage.setItem('library', JSON.stringify(library));
  displayBooks(); // Update the book list display
}

// Update the displayBooks function to include return functionality
function displayBooks() {
  const bookTableBody = document.getElementById('book-table-body');
  bookTableBody.innerHTML = ''; // Clear the table body
  library.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.category}</td>
      <td>${book.borrowed ? `Borrowed by ${book.borrowedBy}` : 'Available'}</td>
      <td>
        ${book.borrowed ? `<button class="return-btn" onclick="returnBook('${book.isbn}')">Return</button>` : `<button class="borrow-btn"onclick="borrowBook('${book.isbn}')">Borrow</button>`}
        <button class="delete-btn"onclick="deleteBook('${book.isbn}')">Delete</button>
      </td>
    `;
    bookTableBody.appendChild(row);
  });
}

// Function to handle book borrowing with prompt for borrower's name
function borrowBook(isbn) {
  const borrower = prompt("Please enter the borrower's name:");
  if (borrower) {
    const book = library.find(book => book.isbn === isbn);
    if (book && !book.borrowed) {
      book.borrowed = true;
      book.borrowedBy = borrower;
      book.borrowedOn = new Date().toLocaleDateString();
      console.log(`Book borrowed: ${book.title} by ${borrower} on ${book.borrowedOn}`);
      localStorage.setItem('library', JSON.stringify(library));
      displayBooks(); // Update the book list display
      displayBorrowingHistory(); // Update the borrowing history display
    } else {
      console.error('This book is already borrowed.');
      alert('This book is already borrowed.');
    }
  }
}

// Function to handle book returning
function returnBook(isbn) {
  const book = library.find(book => book.isbn === isbn);
  if (book && book.borrowed) {
    book.borrowed = false;
    book.borrowedBy = null;
    book.borrowedOn = null;
    localStorage.setItem('library', JSON.stringify(library));
    displayBooks(); // Update the book list display
    displayBorrowingHistory(); // Update the borrowing history display
  }
}

// Display borrowing history in the borrowing history table
function displayBorrowingHistory() {
  const borrowingHistoryBody = document.getElementById('borrowing-history-body');
  borrowingHistoryBody.innerHTML = ''; // Clear the table body

  library.filter(book => book.borrowed).forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.borrowedBy}</td>
      <td>${book.borrowedOn}</td>
    `;
    borrowingHistoryBody.appendChild(row);
  });
}

// Function to delete a book from the library
function deleteBook(isbn) {
  // Find the index of the book with the given ISBN
  const bookIndex = library.findIndex(book => book.isbn === isbn);
  
  // If the book is found, remove it from the array
  if (bookIndex !== -1) {
    library.splice(bookIndex, 1);
    localStorage.setItem('library', JSON.stringify(library)); // Update localStorage
    displayBooks(); // Update the book list display
    displayBorrowingHistory(); // Update the borrowing history display if necessary
  } else {
    alert('Book not found.');
  }
}

// Event listener for the book form submission
document.getElementById('book-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  const category = document.getElementById('category').value;

  // Instantiate a new book
  const newBook = new Book(title, author, isbn, category);

  // Add book to library and display it
  addBookToLibrary(newBook);
});

// Function to search books
function searchBooks() {
  const searchValue = document.getElementById('searchBox').value.toLowerCase();
  const filteredBooks = library.filter(book =>
    book.title.toLowerCase().includes(searchValue) ||
    book.author.toLowerCase().includes(searchValue) ||
    book.isbn.toLowerCase().includes(searchValue)
  );
  displayBooks(filteredBooks); // Update the book list display with search results
}

// Initial display of books and borrowing history
displayBooks();
displayBorrowingHistory();