import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Search from './components/SearchBooks'
import List from './components/ListBooks'
import NotFoundPage from './components/PageNotFound'
import * as BooksAPI from './BooksAPI'

class BooksApp extends React.Component {
    state = {
        shelfs: {
            currentlyReading: {
                label: 'Currently Reading'
            },
            wantToRead: {
                label: 'Want to Read'
            },
            read: {
                label: 'Read'
            }
        },
        books: [],
        search: {
            query: null,
            books: [],
        },
        bookShelf: {},
        myRequestComplete: false
    }

    BookList = () => {
        this.setState({
            myRequestComplete: false,
            books: []
        })

        BooksAPI.getAll()
            .then((data) => {
                this.setState({
                    books: data,
                    myRequestComplete: true
                })
                this.updateBookShelf(data);
            });
    }

    updateBookShelf(books) {
        let bookShelf = {};
        books.forEach((book) => {
            bookShelf[book.id] = book.shelf
        });

        this.setState({ bookShelf });

        this.onSearchUpdate(
            this.state.search.query,
            this.state.search.books
        );
    }

    onBookMove = (book, targetShelf) => {

        return BooksAPI.update(book, targetShelf)
            .then(() => this.BookList())

    }

    onSearchUpdate = (query, books) => {

        books.forEach((book) => {
            book.shelf = (this.state.bookShelf[book.id])
                ? this.state.bookShelf[book.id]
                : 'none';
        })

        let state = this.state;

        state.search = {
            query: query,
            books: books
        }

        this.setState(state);

    }

    componentDidMount() {
        this.BookList()
    }


    render() {
        return (<div className="app">
            <Switch>
                <Route exact path="/search" render={() => (
                    <Search
                        shelfs={this.state.shelfs}
                        books={this.state.search.books}
                        onBookMove={this.onBookMove}
                        onSearchUpdate={this.onSearchUpdate} />
                )} />
                <Route exact path="/" render={() => (
                    <List
                        myRequestComplete={this.state.myRequestComplete}
                        shelfs={this.state.shelfs}
                        books={this.state.books}
                        onBookMove={this.onBookMove} />
                )} />
                <Route component={NotFoundPage} />
            </Switch>
        </div>)
    }
}

export default BooksApp
