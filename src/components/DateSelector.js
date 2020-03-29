import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

function valueToLabel(value) {
  return new Date(value * 1000).toISOString().substring(5,10);
}

class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event, value) {
    const valueWithTimezone = value + new Date().getTimezoneOffset() * 60;
    const dateString = new Date(valueWithTimezone * 1000).toISOString().substring(0,10);
    console.log('1:' + new Date(value * 1000).toISOString().substring(0,10));
    console.log('2:' + dateString);
    this.props.callback(dateString);
  }

  render() {
    const d = new Date();
    d.setHours(0,0,0,0);
    let selector = (
      <div>
        <Typography id="date-selector" gutterBottom>
          Date selector
        </Typography>
        <Slider
          defaultValue={Math.round(d.getTime()/1000) - 86400 + d.getTimezoneOffset() * 60}
          min={this.props.from}
          max={Math.round(d.getTime()/1000)}
          step={86400}
          getAriaValueText={valueToLabel}
          valueLabelDisplay="on"
          valueLabelFormat={valueToLabel}
          onChange={this.onChange}
          aria-labelledby="date-selector"
          style={{ width: '98%' }}
        />
      </div>
    );
    return selector;
  }
}

export default DateSelector;
