import * as React from "react";
import { ChoiceGroup, Dropdown, DropdownMenuItemType, IChoiceGroupOption, IDropdownOption, IStackStyles, IconButton, PrimaryButton, Stack, Text } from '@fluentui/react';
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import { SearchProps } from "../../Interfaces/AppTypes";
import './SearchPanel.css';

export class SearchPanel extends React.Component<SearchProps, SearchProps>{
    constructor(props: SearchProps) {
        super(props);
        this.state = {
            RecordTypes: this.props.RecordTypes,
            SelectedRecordTypes: this.props.SelectedRecordTypes,
            DurationChoices: this.props.DurationChoices,
            SelectedDuration: this.props.SelectedDuration,
            SearchPanelVisible: this.props.SearchPanelVisible,
            DateRange: this.props.DateRange,
            SortDirection: this.props.SortDirection,
            SearchFields: this.props.SearchFields,
        };

        // Bind the event handler to the class instance
        this.onDurationChange = this.onDurationChange.bind(this);
        this.onRecordTypeChange = this.onRecordTypeChange.bind(this);
        this.CloseSearchPanelVisibility = this.CloseSearchPanelVisibility.bind(this);
        this.SearchClick = this.SearchClick.bind(this);
        this.UpdateCustomDates = this.UpdateCustomDates.bind(this);
    }

    // Define styles for setting css attributes
    parentStackStyles: IStackStyles = {root: { border: '1px solid #ccc', padding: '10px', borderRadius: '4px', backgroundColor: '#f9f9f9' }};
    searchTextStyles: IStackStyles = { root: { fontWeight: 'bold', paddingBottom:'5px', fontSize: '12px', fontFamily: '"SegoeUI", "Segoe UI", "Helvetica Neue", "sans-serif"' } };
    recordTypeStackStyles: IStackStyles = { root: { width: '50%' } };
    recordTypeTextStyles: IStackStyles = { root: { fontWeight: 'bold', paddingBottom:'5px', fontSize: '12px', fontFamily: '"SegoeUI", "Segoe UI"' } };
    durationTextStyles: IStackStyles = { root: { fontWeight: 'bold', fontSize: '12px', fontFamily: '"SegoeUI", "Segoe UI"' } };
    recordTypeDropdownStyles: IStackStyles = {root: { marginRight: '50px' } };
    primaryButtonStackStyles: IStackStyles = { root: { paddingTop: '25px' } };

    render() {
        return(
            <Stack styles={ this.parentStackStyles }>
                {/* Used for Debugging */}
                {/* <Stack>
                        <Text>Start Date: {this.state.DateRange.StartDate.toDateString()}</Text>
                        <Text>End Date: {this.state.DateRange.EndDate.toDateString()}</Text>
                        <Text>Selected Duration: {this.state.SelectedDuration}</Text>
                </Stack> */}
                <Stack horizontal>
                    <Stack grow verticalAlign='center'>
                        <Text styles={ this.searchTextStyles }>Search</Text>
                    </Stack>
                    <Stack horizontal horizontalAlign='end'>
                        <IconButton iconProps={{ iconName: 'Cancel' }} title="Close" ariaLabel="Close" onClick={ this.CloseSearchPanelVisibility } />
                    </Stack>
                </Stack>
                <Stack horizontal>
                    <Stack styles={ this.recordTypeStackStyles }>
                        <Text styles={ this.recordTypeTextStyles }>Record Type</Text>
                        <Dropdown multiSelect placeholder='Select Record type for search' styles={ this.recordTypeDropdownStyles } options={this.state.RecordTypes}
                        selectedKeys={this.state.SelectedRecordTypes} onChange={this.onRecordTypeChange}></Dropdown>
                    </Stack>
                    <Stack>
                        <Text styles={ this.durationTextStyles }>Duration</Text>
                        <ChoiceGroup options={this.state.DurationChoices} onChange={this.onDurationChange} defaultSelectedKey={this.props.SelectedDuration}></ChoiceGroup>
                        {this.state.SelectedDuration === 'custom' &&
                            (<Stack horizontalAlign='center'>
                                <DateRangePicker StartDate={ this.state.DateRange.StartDate } EndDate={ this.state.DateRange.EndDate } StartDateAllowedYears={ this.state.DateRange.StartDateAllowedYears } UpdateDateFields={ this.UpdateCustomDates }></DateRangePicker>
                            </Stack>
                            )
                        }
                    </Stack>
                </Stack>
                <Stack horizontalAlign='center' verticalAlign='center' styles={ this.primaryButtonStackStyles }>
                    <PrimaryButton text='Search' onClick={ this.SearchClick }></PrimaryButton>
                </Stack>
            </Stack>
        );
    }
    
    onRecordTypeChange (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void {
        if (!option) return;

        if (option.key === 'selectAll') {
            const allItems = this.props.RecordTypes
            .filter((item) => ((item.key !== 'selectAll') && (item.itemType === undefined || item.itemType === DropdownMenuItemType.Normal)));

            if (this.state.SelectedRecordTypes.length === allItems.length) {
                this.setState({SelectedRecordTypes: []});
            } else {
                const allKeys = allItems.map((item) => item.key as string);
                this.setState({SelectedRecordTypes: allKeys});
            }
        } else {
            const newselectedRecordTypes = option.selected
            ? [...this.state.SelectedRecordTypes, option.key as string]
            : this.state.SelectedRecordTypes.filter((key) => key !== option.key);
            this.setState({SelectedRecordTypes: newselectedRecordTypes});
        }
    }

    onDurationChange (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) {
        const value = option ? option.key : "";
        this.setState({ SelectedDuration: value });

        if(value !== 'custom') {
            const sDate = new Date();
            if(this.state.DateRange.UseCalendarMonth ?? false) {
                sDate.setDate(1);
                sDate.setMonth(sDate.getMonth() - +(value.replace('m', '')) +1);
            } else {
                sDate.setMonth(sDate.getMonth() - +(value.replace('m', '')));
            }
            this.setState({ DateRange: { StartDate: sDate, EndDate: new Date(), UseCalendarMonth: this.state.DateRange.UseCalendarMonth, StartDateAllowedYears: this.state.DateRange.StartDateAllowedYears } });
        }
    }

    CloseSearchPanelVisibility(): void {
        this.setState({ SearchPanelVisible: false });
        this.props.Close?.();
    }

    UpdateCustomDates(StartDate: Date, EndDate: Date): void {
        this.setState({ DateRange: { StartDate: StartDate, EndDate: EndDate, UseCalendarMonth: this.state.DateRange.UseCalendarMonth, StartDateAllowedYears: this.state.DateRange.StartDateAllowedYears } });
    }

    SearchClick(): void {
        this.props.UpdateSearch?.(this.state.DateRange.StartDate, this.state.DateRange.EndDate, this.state.SelectedDuration, this.state.SelectedRecordTypes);
    }
}