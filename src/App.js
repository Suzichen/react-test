import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="page">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Hello,热更新
        </p>
        <Hot />
        <br />
        <List />
      </div>
    );
  }
}

class Hot extends Component {
  render() {
    return (
      <div>
        这是热更新组件哈哈哈
      </div>
    )
  }
}
/**
 * -------------分割线-----------------
 * **/
// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   }
// ]
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      serachItem: DEFAULT_QUERY,
      error: null
    }

    this.onDissmiss = this.onDissmiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }
  render() {
    const { serachItem, results, searchKey, error } = this.state;
    const page = (
      results && 
      results[searchKey] && 
      results[searchKey].page
    ) || 0;
    const list = (
      results && 
      results[searchKey] && 
      results[searchKey].hits
    ) || [];
    return (
      <div className="interactions">
        <Serach 
          value={serachItem}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
        搜索
        </Serach>
        <br />
        {/* 判断是否存在error */}
        { error
          ? <div className="interactions">
              <p>程序错误，无法显示</p>
            </div>
          : <div>
              <Table 
                list={list}
                  // pattern={serachItem}
                  onDissmiss={this.onDissmiss}
              />
              
              <div className="interactions">
                <Button onClick={() => this.fetchSearchTopStories(serachItem, page + 1)}>
                  获取更多...
                </Button>
              </div>
            </div>
        }
      </div>
    )
  }
  onDissmiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const updatedList = hits.filter(item => {
      return item.objectID !== id;
    });
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedList, page }
      }
    });
  }
  onSearchChange(event) {
    this.setState({
      serachItem: event.target.value
    })
  }
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results} = this.state;

    // searchKey用作键名
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    // 当获取更多之前，page的值是0，hits列表应为空
    // const oldHits = page !== 0
    //   ? this.state.list.hits
    //   : [];
    // 合并新老数组
    const updateHits = [
      ...oldHits,
      ...hits
    ];
    this.setState({ 
      results: {
        ...results,
        [searchKey]: {hits: updateHits, page}
      }
     });
  }
  fetchSearchTopStories(serachItem, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${serachItem}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({ error: e }));
  }
  onSearchSubmit(e) {
    const serachItem = this.state.serachItem;
    this.setState({ searchKey: serachItem });
    if (this.needsToSearchTopStories(serachItem)) {
      this.fetchSearchTopStories(serachItem);
    }
    e.preventDefault();
  }
  needsToSearchTopStories(serachItem) {
    return !this.state.results[serachItem];
  }
  componentDidMount() {
    const serachItem = this.state.serachItem;
    this.setState({searchKey: serachItem});
    this.fetchSearchTopStories(serachItem);
  }
}

const Serach = ({ onChange, onSubmit, value, children }) => {
  return (
    <form onSubmit={onSubmit}>
      <input 
        type="text"
        onChange={onChange}
        value={value}
      />
      <button type="submit">
        {children}
      </button>
    </form>
  );
}

const Table = ({ list, onDissmiss }) => {
  return (
    <div className="table">
      {
        // list.filter(isSerached(pattern))
        //   .map(item => 
          list.map(item =>
            <div key={item.objectID} className="table-row">
              <span style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={{ width: '30%' }}>{item.author}</span>
              <span style={{ width: '10%' }}>{item.num_comments}</span>
              <span style={{ width: '10%' }}>{item.points}</span>
              <span style={{ width: '10%' }}>
                <Button 
                  onClick={() => onDissmiss(item.objectID)} 
                  className="button-inline"
                >
                  删除
                </Button>
              </span>
            </div>
          )
      }
    </div>
  );
}

const Button = ({ onClick, className, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

// const isSerached = searchTerm => {
//   return item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
// }

export default App;
