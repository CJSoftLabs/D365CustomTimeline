import * as React from 'react';
import { Stack, DatePicker, DayOfWeek, IStackTokens, IStackStyles, IDatePickerStyles } from '@fluentui/react';
import './DateRangePicker.css'
import { DateRangeProps } from '../../Interfaces/AppTypes';

export class DateRangePicker extends React.Component<DateRangeProps, DateRangeProps> {
  // Define tokens for spacing
  stackTokens: IStackTokens = { childrenGap: 20 };

  // Define styles for setting css attributes
  stackStyles: IStackStyles = { root: { width: '100%' } };
  datePickerStyles: IDatePickerStyles = {
    textField: { selectors: { 'input': { paddingRight: '50px' }, }, },
    root: {},
    callout: {},
    icon: {}
  };

  constructor(props: DateRangeProps) {
    super(props);
    this.state = {
      StartDate: this.props.StartDate,
      EndDate: this.props.EndDate,
      UpdateDateFields: this.props.UpdateDateFields,
    };
  }

  // Helper function to handle date changes
  private onDateChange = (date: Date | null | undefined, setDate: string) => {
    this.setState(
      (prevState) => ({ [setDate]: date } as unknown as Pick<DateRangeProps, keyof DateRangeProps>),
      () => {
          // This callback function is called after the state has been updated
          this.state.UpdateDateFields?.(this.state.StartDate, this.state.EndDate);
      }
  );
  };

  render() {
    const currentDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(currentDate.getFullYear() - 3);

    return (
      <Stack horizontal tokens={this.stackTokens} styles={ this.stackStyles }>
        <DatePicker
          styles={ this.datePickerStyles }
          label="Start Date"
          firstDayOfWeek={DayOfWeek.Sunday}
          placeholder="Select a start date..."
          ariaLabel="Select a start date"
          value={this.state.StartDate as Date}
          onSelectDate={(date) => this.onDateChange(date, 'StartDate')}
          minDate={ minDate }
          maxDate={ currentDate }
        />
        <DatePicker
          styles={ this.datePickerStyles }
          label="End Date"
          firstDayOfWeek={DayOfWeek.Sunday}
          placeholder="Select an end date..."
          ariaLabel="Select an end date"
          value={this.state.EndDate as Date}
          onSelectDate={(date) => this.onDateChange(date, 'EndDate')}
          minDate={ minDate }
          maxDate={ currentDate }
        />
      </Stack>
    );
  }
}
