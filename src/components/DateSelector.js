import React, { Component } from 'react';

import dayjs from 'dayjs';

class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.callback(event.target.value);
  }

  render() {
    let options = [];
    let current = dayjs(this.props.from);
    let to = dayjs();
    while (!current.isAfter(to)) {
      let key = current.format('YYYY-MM-DD');
      let option = (
        <option value={key} key={key}>
          {current.format('DD MMM, YYYY')}
        </option>
      );
      options.push(option);
      current = current.add(1, 'd');
    }

    let selector = (
      <select onChange={this.onChange} value={this.props.current}>
        {options}
      </select>
    );
    return selector;
  }
}

export default DateSelector;
