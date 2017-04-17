/* eslint-disable */
import React, { Component } from 'react';
import GiftedListView from './lib/GiftedListView';
import View from './lib/View';
import Text from './lib/Text';

const TIMEOUTMS = 60 * 1000; // 60秒超时
const PAGESIZE = 4;

export default class CommonListView extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    let { onFetch, ...other } = this.props;
    this._propsOther = other;
  }

  componentWillReceiveProps(nextProps) {
    let { onFetch, ...other } = nextProps;
    this._propsOther = other;
  }

  refresh() {
    this._refresh();
  }

  getRows() {
    return this._getRows();
  }

  updateRows(rows, payload) {
    this._updateRows(rows, payload);
  }

  scrollTo(...args) {
    this.refs.giftedlistview.scrollTo(...args);
  }

  _refresh() {
    this.scrollTo(0, 0);
    this.refs.giftedlistview.refresh();
  }

  _getRows() {
    return this.refs.giftedlistview._getRows();
  }

  _updateRows(rows, payload) {
    let options = {};
    if (payload != null) {
      options = payload;
    } else {
      const status = this.refs.giftedlistview.getPaginationStatus();
      if (status == 'allLoaded') { // 已经加载完，更新rows 不触发load more
        options.allLoaded = true;
      }
    }
    this.refs.giftedlistview._updateRows(rows, options);
  }


  _onFetch(page, callback) {
    // 监听请求超时，如果超时返回空数组
    const timeoutId = setTimeout(() => {
      callback([]);
    }, TIMEOUTMS);

    const _callback = (...options) => {
      // 清除请求超时监听
      clearTimeout(timeoutId);

      // 返回数据
      callback(...options);
    };

    this.props.onFetch(page, (rows, options) => {
      let _options = options;
      if (page > 1) {
        const allLoaded = rows == null || rows.length == 0;  // 返回空数据时，不显示加载更多
        _options = { allLoaded, ...options };
      }
      _callback(rows, _options);
    });
  }

  paginationWaitingView(callbask) {
    return (
      <Text
        style={{
          justifyContent: 'center',
          textAlign: 'center',
          marginTop: 8,
          marginBottom: 15,
          color: '#333',
        }}
        onClick={callbask}
      >上滑加载更多</Text>
    );
  }

  paginationAllLoadedView() {
    return (
      <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
        <img style={{ width: 230, height: 140 }} src={require('./nomore.png')} />
      </View>
    );

    // return (
    //   <Text
    //     style={{
    //       textAlign: 'center',
    //       marginTop : 8,
    //       marginBottom : 8,
    //       color : '#ccc',
    //     }}
    //     >亲！没有更多啦</Text>
    // );
  }

  emptyView(refreshCallback, title) {
    return (
      <View style={Styles.defaultView} onClick={refreshCallback}>
        <Text style={Styles.defaultViewTitle} onClick={refreshCallback}>
          {title || '没有数据'}
        </Text>
      </View>
    );
  }

  render() {
    const customStyles = this.props.style || {};
    const style = {
      height: document.documentElement.clientHeight - 10,
      overflow: 'auto',
      border: '1px solid #ddd',
      margin: '0.1rem 0',
      ...customStyles
    }
    return (
      <GiftedListView
        ref={'giftedlistview'}
        onFetch={this._onFetch.bind(this)}
        firstLoader
        pagination
        refreshable
        withSections={false}
        infiniteLoading
        paginationWaitingView={this.paginationWaitingView}
        paginationAllLoadedView={this.paginationAllLoadedView}
        refreshableTintColor="#ccc"
        enableEmptySections
        emptyView={this.emptyView}
        pageSize={PAGESIZE}
        {...this._propsOther}
        style={style}
      />
    );
  }
}


const Styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)'
  },
  background: {
    flex: 1
  },
  defaultView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '.3rem',
    paddingBottom: '.3rem',
    backgroundColor: '#fff'
  },
  defaultViewTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#ccc',
  },
};
