/* eslint-disable */

import React from 'react';
import { RefreshControl, ActivityIndicator, ListView } from 'antd-mobile';
import View from './View';
import Text from './Text';
import Styles from './style.scss';

/**
 * 合并对象支持数组
 * @update xlc
 * @date 16/12/08
 */
function MergeRecursive(obj1, obj2) {
  for (var p in obj2) {
    try {
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else if ( obj2[p].constructor==Array) {   //add
        obj1[p] = obj1[p].concat(obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}


/**
 * 组件来自can-yin-quan
 * 原内部使用的组件改为 antd-mobile，具体API 参考下面两个链接
 * https://mobile.ant.design/components/list-view/
 * https://mobile.ant.design/components/refresh-control/
 */

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

var GiftedListView = React.createClass({

  getDefaultProps() {
    return {
      initialListSize: 10,
      firstLoader: true,
      pagination: true,
      refreshable: true,
      renderRefreshControl: null,
      headerView: null,
      sectionHeaderView: null,
      withSections: false,
      onFetch(page, callback, options) { callback([]); },

      paginationFetchingView: null,
      paginationAllLoadedView: null,
      paginationWaitingView: null,
      emptyView: null,
      renderSeparator: null,

      pullDistance : 5,     // 底部加载距离
      infiniteLoading : false, // 无限滚动
      pageSize: 5,
      scrollRenderAheadDistance: 500,
      scrollEventThrottle: 20,
 
      // WEB 平台新增AP
      useBodyScroll: false,  // 使用 html 的 body 作为滚动容器
      stickyHeader: false, // 固定区块标题到页面顶部 (注意: 设置后会自动使用 html 的 body 作为滚动容器)
      // renderBodyComponent: null, // 自定义 body 的包裹组件
      // renderSectionBodyWrapper: null, // (function, (sectionID: any) => React.Element) - 渲染自定义的区块包裹组件
      useZscroller: false, // 使用 zscroller 来模拟实现滚动容器 (可用于一些低端 Android 机上) 注意：开启后useBodyScroll和stickyHeader设置会自动被忽略
    };
  },

  propTypes: {
    initialListSize: React.PropTypes.number,
    firstLoader: React.PropTypes.bool,
    pagination: React.PropTypes.bool,
    refreshable: React.PropTypes.bool,
    renderRefreshControl: React.PropTypes.func,
    headerView: React.PropTypes.func,
    sectionHeaderView: React.PropTypes.func,
    withSections: React.PropTypes.bool,
    onFetch: React.PropTypes.func,

    paginationFetchingView: React.PropTypes.func,
    paginationAllLoadedView: React.PropTypes.func,
    paginationWaitingView: React.PropTypes.func,
    emptyView: React.PropTypes.func,
    renderSeparator: React.PropTypes.func,

    pullDistance : React.PropTypes.number,
    infiniteLoading : React.PropTypes.bool,
    pageSize: React.PropTypes.number,

    // WEB 平台新增AP
    useBodyScroll: React.PropTypes.bool,
    stickyHeader: React.PropTypes.bool,
    renderBodyComponent: React.PropTypes.func,
    renderSectionBodyWrapper: React.PropTypes.func,
    useZscroller: React.PropTypes.bool,
  },

  _setPage(page) { this._page = page; },
  _getPage() { return this._page; },
  _setRows(rows) { this._rows = rows; },
  _getRows() { return this._rows; },


  paginationFetchingView() {
    if (this.props.paginationFetchingView) {
      return this.props.paginationFetchingView();
    }

    return (
      <View style={this.defaultStyles.paginationView}>
        <ActivityIndicator animating />
      </View>
    );
  },
  paginationAllLoadedView() {
    if (this.props.paginationAllLoadedView) {
      return this.props.paginationAllLoadedView();
    }

    return (
      <View style={this.defaultStyles.paginationView}>
        <Text style={this.defaultStyles.actionsLabel}>
          ~
        </Text>
      </View>
    );
  },
  paginationWaitingView(paginateCallback) {
    if (this.props.paginationWaitingView) {
      return this.props.paginationWaitingView(paginateCallback);
    }

    return (
      <div
        onClick={paginateCallback}
        style={this.defaultStyles.paginationView}
      >
        <Text style={this.defaultStyles.actionsLabel}>
          Load more
        </Text>
      </div>
    );
  },
  _headerView() {
    if (this.state.paginationStatus === 'firstLoad' || !this.props.headerView){
      return null;
    }
    return this.props.headerView();
  },
  emptyView(refreshCallback) {
    if (this.props.emptyView) {
      return this.props.emptyView(refreshCallback);
    }

    return (
      <View style={this.defaultStyles.defaultView}>
        <Text style={this.defaultStyles.defaultViewTitle}>
          Sorry, there is no content to display
        </Text>

        <div
          onClick={refreshCallback}
        >
          <Text>
            ↻
          </Text>
        </div>
      </View>
    );
  },
  _renderSeparator(sectionID, rowID) {
    if (this.props.renderSeparator) {
      return this.props.renderSeparator();
    }

    return (
      <View key={`separator_${rowID}`} style={this.defaultStyles.separator} />
    );
  },

  getInitialState() {
    this._setPage(1);
    this._setRows([]);

    var ds = null;
    if (this.props.withSections === true) {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
      });
      return {
        dataSource: ds.cloneWithRowsAndSections(this._getRows()),
        isRefreshing: false,
        paginationStatus: 'firstLoad',
      };
    } else {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      return {
        dataSource: ds.cloneWithRows(this._getRows()),
        isRefreshing: false,
        paginationStatus: 'firstLoad',
      };
    }
  },

  componentDidMount() {
    this.props.onFetch(this._getPage(), this._postRefresh, {firstLoad: true});
  },

  setNativeProps(props) {
    this.refs.listview.setNativeProps(props);
  },
  scrollTo(...args) {
    // this.refs.listview.refs.listview.refs.listviewscroll.domScroller.scroller.scrollTo(...args);
    this.refs.listview.refs.listview.scrollTo(...args);
  },
  refresh() {
    this._onRefresh({external: true}, 'noFetch');
  },

  _onRefresh(options = {}, noFetch) {
    if (this.isMounted()) {
      this.setState({
        isRefreshing: true,
      });
      if(noFetch !== 'noFetch') {
        this._setPage(1);
        this.props.onFetch(this._getPage(), this._postRefresh, options);
      }
    }
  },

  _postRefresh(rows = [], options = {}) {
    if (this.isMounted()) {
      this._updateRows(rows, options);
    }
  },

  _onPaginate() {
    if(this.state.paginationStatus==='allLoaded'){
      return null
    }else {
      this.setState({
        paginationStatus: 'fetching',
      });
      this.props.onFetch(this._getPage() + 1, this._postPaginate, {});
    }
  },

  _postPaginate(rows = [], options = {}) {
    this._setPage(this._getPage() + 1);
    var mergedRows = null;
    if (this.props.withSections === true) {
      mergedRows = MergeRecursive(this._getRows(), rows);
    } else {
      mergedRows = this._getRows().concat(rows);
    }
    this._updateRows(mergedRows, options);
  },

  _updateRows(rows = [], options = {}) {
    if (rows !== null) {
      this._setRows(rows);
      if (this.props.withSections === true) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(rows),
          isRefreshing: false,
          paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
        }, () => {
          if (options.callback) options.callback();
        });
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
          isRefreshing: false,
          paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
        }, () => {
          if (options.callback) options.callback();
        });
      }
    } else {
      this.setState({
        isRefreshing: false,
        paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
      }, () => {
        if (options.callback) options.callback();
      });
    }
  },

  _renderPaginationView() {
    if ((this.state.paginationStatus === 'fetching' && this.props.pagination === true) || (this.state.paginationStatus === 'firstLoad' && this.props.firstLoader === true)) {
      return this.paginationFetchingView();
    } else if (this.state.paginationStatus === 'waiting' && this.props.pagination === true && (this.props.withSections === true || this._getRows().length > 0)) {
      return this.paginationWaitingView(this._onPaginate);
    } else if (this.state.paginationStatus === 'allLoaded' && this.props.pagination === true) {
      return this.paginationAllLoadedView();
    } else if (this._getRows().length === 0) {
      return this.emptyView(this._onRefresh);
    } else {
      return null;
    }
  },
 
  getPaginationStatus() {
    return this.state.paginationStatus;
  },

  renderRefreshControl() {
    if (this.props.renderRefreshControl) {
      return this.props.renderRefreshControl({ onRefresh: this._onRefresh });
    }
    return (
      <RefreshControl
        onRefresh={this._onRefresh}
        refreshing={this.state.isRefreshing}
      />
    );
  },
  _onEndReached() {  // 无限加载
    if (this.props.infiniteLoading
      && this.state.paginationStatus !== 'allLoaded'
      && this.state.paginationStatus === 'waiting'
      && this.props.pagination === true
      && (this.props.withSections === true || this._getRows().length > 0)) {
      this._onPaginate();
    }
  },
  render() {
    let className = `${Styles.listview} `;
    if(this.props.headerView == null){
      className += ` ${Styles.noheader}`;
    }
    const { renderSeparator, ...otherProps } = this.props;
    return (
      <ListView
        ref="listview"
        dataSource={this.state.dataSource}
        renderRow={this.props.rowView}
        renderSectionHeader={this.props.sectionHeaderView}
        renderHeader={(...params) => this._headerView(...params)}
        renderFooter={(...params) => this._renderPaginationView(...params)}
        renderSeparator={(...params) => this._renderSeparator(...params)}

        automaticallyAdjustContentInsets={false}
        canCancelContentTouches
        refreshControl={this.props.refreshable === true ? this.renderRefreshControl() : null}

        onEndReached={(...params) => this._onEndReached(...params)}
        onEndReachedThreshold={this.props.pullDistance}
        renderBodyComponent={() => <MyBody />}        
        {...otherProps}
        className={className}
        style={this.props.style}
      />
    );
  },

  defaultStyles: {
    separator: {
      backgroundColor: '#E6E8EB',
      height: 15,
    },
    actionsLabel: {
      // fontSize: 20,
    },
    paginationView: {
      height: 88,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5F5F9'
    },
    defaultView: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    defaultViewTitle: {
      fontWeight: 'bold',
      marginBottom: 15,
    },
  },
});


export default GiftedListView;
