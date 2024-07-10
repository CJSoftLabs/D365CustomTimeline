import * as React from 'react';
import * as moment from 'moment';
import { DateRangeProps, MonthGroup } from "../../Interfaces/Common";
import { Checkbox, ILabelStyles, IStackTokens, IconButton, Label, PrimaryButton, Stack, mergeStyles } from "@fluentui/react";

export class DateFilterPanel extends React.Component<DateRangeProps, DateRangeProps> {
    constructor(props: DateRangeProps) {
        super(props);
        this.state = {
            StartDate: this.props.StartDate,
            EndDate: this.props.EndDate,
            SelectedMonths: this.props.SelectedMonths,
            CollapsedYears: {},
            UseCalendarMonth: this.props.UseCalendarMonth,
            UpdateSelectedMonths: this.props.UpdateSelectedMonths
        };

        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.ToggleYearCollapse = this.ToggleYearCollapse.bind(this);
        this.ApplyDateFilter = this.ApplyDateFilter.bind(this);
    }

    GenerateMonthGroups(startDate: Date, endDate: Date): MonthGroup[] {
        const start = moment(startDate).startOf('month');
        const end = moment(endDate).endOf('month');
    
        const monthGroups: MonthGroup[] = [];
    
        let current = start.clone();
    
        while (current.isBefore(end)) {
          const year = current.year();
          const month = current.format('MMMM');
    
          let yearGroup = monthGroups.find((group) => group.year === year);
    
          if (!yearGroup) {
            yearGroup = { year, months: [] };
            monthGroups.push(yearGroup);
          }
    
          yearGroup.months.push(month);
    
          current.add(1, 'month');
        }
    
        return monthGroups;
    }

    onCheckboxChange = (month: string, year: number, checked: boolean) => {
      const key = `${year}-${month}`;
      this.setState((prevState) => ({
        StartDate: prevState.StartDate,
        EndDate: prevState.EndDate,
        SelectedMonths: {
          ...prevState.SelectedMonths,
          [key]: checked,
        },
        CollapsedYears: {
          ...prevState.CollapsedYears
        },
      }));
    };

    ToggleYearCollapse = (year: number) => {
      this.setState((prevState) => ({
        StartDate: prevState.StartDate,
        EndDate: prevState.EndDate,
        SelectedMonths: {
          ...prevState.SelectedMonths,
        },
        CollapsedYears: {
          ...prevState.CollapsedYears,
          [year]: !prevState.CollapsedYears?.[year],
        },
      }));
    };

    ApplyDateFilter = () => {
      // const SelectedMonths = Object.keys(this.state.SelectedMonths).filter(key => this.state.SelectedMonths[key] === true);
      // if(SelectedMonths.length > 0) {
        this.state.UpdateSelectedMonths?.(this.state.SelectedMonths);
      // }
    }

    componentDidUpdate(prevProps: DateRangeProps) {
      if ((prevProps.StartDate !== this.props.StartDate) || (prevProps.EndDate !== this.props.EndDate)) {
        this.setState(() => ({
          StartDate: this.props.StartDate,
          EndDate: this.props.EndDate,
          SelectedMonths: {},
          CollapsedYears: {},
        }));
      }
    }

    stackTokens: IStackTokens = { childrenGap: 10 };
    labelStyles: Partial<ILabelStyles> = {root: { fontSize: 14, fontWeight: 'bold' },};
    
    contentStyles = mergeStyles({
      flex: 1,
      overflowY: 'auto',
    });    

    render() {
        const monthGroups = this.GenerateMonthGroups(this.state.StartDate, this.state.EndDate);

        return(
            <Stack tokens={this.stackTokens} className={this.contentStyles}>
              <Stack grow className={this.contentStyles}>
            {monthGroups.map((group) => (
              <Stack key={group.year}>
                <Stack horizontal verticalAlign="center">
                  <IconButton
                    iconProps={{ iconName: this.state.CollapsedYears?.[group.year] ? 'ChevronRight' : 'ChevronDown'} }
                    onClick={() => this.ToggleYearCollapse(group.year)}
                  />
                  <Label styles={this.labelStyles}>{group.year}</Label>
                </Stack>
                {!this.state.CollapsedYears?.[group.year] && (
                  <Stack tokens={this.stackTokens}>
                    {group.months.map((month) => (
                      <Checkbox
                        key={`${group.year}-${month}`}
                        label={month}
                        checked={this.state.SelectedMonths?.[`${group.year}-${month}`] || false}
                        onChange={(e, checked) => this.onCheckboxChange(month, group.year, !!checked)}
                        className={mergeStyles({ paddingLeft: 20 })}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            ))}
            </Stack>            
              <Stack verticalAlign="baseline" tokens={this.stackTokens}>
                <PrimaryButton text="Apply" onClick={ this.ApplyDateFilter } />
              </Stack>
          </Stack>
        );
    }
}