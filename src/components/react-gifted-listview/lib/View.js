import React, { Component } from 'react';

class View extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const customStyles = this.props.style || {};
    const style = {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      ...customStyles
    };
    return (
      <div
        {...this.props}
        style={style}
      >
        {this.props.children}
      </div>
    );
  }
}

export default View;
