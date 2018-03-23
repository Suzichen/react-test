import React, { Component } from 'react';
import Button from 'material-ui/Button';

import Table from './Table';
import Search from './Search';

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
        <Search 
          value={serachItem}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
        搜索
        </Search>
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
              <br/>
              <div className="interactions">
                <Button 
                  variant="raised" color="primary"
                  onClick={() => this.fetchSearchTopStories(serachItem, page + 1)}
                >
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
export default List;