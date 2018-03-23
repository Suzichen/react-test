import React, { Component } from 'react';
import '../App.css';
import List from './List';

class App extends Component {
  render() {
    return (
      <div className="page">
        <List />
      </div>
    );
  }
}



// const isSerached = searchTerm => {
//   return item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
// }

export default App;
