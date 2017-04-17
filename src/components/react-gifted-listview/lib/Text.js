import React, { Component } from 'react';

class Text extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const customStyles = this.props.style || {};
    const style = {
      display: 'flex',
      flex: 1,
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

export default Text;
