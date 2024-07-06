import * as React from 'react';
import { Stack, Text, SearchBox, IconButton, IContextualMenuProps, IStackTokens, IStackStyles } from '@fluentui/react';
import { EventCard } from './SubComponents/EventCard/EventCard';
import { SearchPanel } from './SubComponents/SearchPanel/SearchPanel';
import { TimelineProps } from './Interfaces/Common';
import { DateFilterPanel } from './SubComponents/DateFilterPanel/DateFilterPanel';

export class Timeline extends React.Component<TimelineProps, TimelineProps> {
    constructor(props: TimelineProps) {
        super(props);
        this.state = {
            SearchProps: this.props.SearchProps,
            FilterPanelVisible: false
        };
        
        // Bind the event handler to the class instance
        this.ToggleSearchPanelVisibility = this.ToggleSearchPanelVisibility.bind(this);
        this.ToggleFilterPanelVisibility = this.ToggleFilterPanelVisibility.bind(this);
        this.HideSearchPanelVisibility = this.HideSearchPanelVisibility.bind(this);
        this.SearchButtonClickOnSearchPanel = this.SearchButtonClickOnSearchPanel.bind(this);
        this.UpdateSearchTextOnSearch = this.UpdateSearchTextOnSearch.bind(this);
        this.UpdateSearchTextOnBlur = this.UpdateSearchTextOnBlur.bind(this);
        this.UpdateSearchTextOnClear = this.UpdateSearchTextOnClear.bind(this);
    }

    sortMenuProps: IContextualMenuProps = {
        items: [
          {
            key: 'sortDescending',
            text: 'Sort newer to older',
            iconProps: { iconName: 'GroupedDescending' },
          },
          {
            key: 'sortAscending',
            text: 'Sort older to newer',
            iconProps: { iconName: 'GroupedAscending' },
          },
        ],
        directionalHintFixed: true,
      };
    
    // Define tokens for spacing
    parentStackTokens: IStackTokens = { childrenGap: 10, padding: 20 };

    // Define styles for setting css attributes
    timelineStackStyles: IStackStyles = { root: { padding: '10px', height: '100%', overflowY: 'auto' } };
    filterStackStyles: IStackStyles = { root: { width: '15%', border: '1px solid #ccc', padding: '10px', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', backgroundColor: '#f9f9f9', marginRight: '10px', height: '55vh' } };
    parentStackStyles: IStackStyles = { root: { border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }};
    timelineTitleTextStyles: IStackStyles = { root: { paddingLeft: '5px', fontWeight: 'bold', fontFamily: '"SegoeUI-Semibold", "Segoe UI Semibold", "Segoe UI Regular", "Segoe UI"' } };
    searchboxStyles: IStackStyles = { root: { border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'rgb(245, 245, 245)' } };

    render() {
        return (
            <Stack styles={this.timelineStackStyles}>
                <Stack tokens={this.parentStackTokens} grow styles={ this.parentStackStyles }>
                    <Stack horizontal>
                        <Stack horizontal grow verticalAlign='center'>
                            <IconButton iconProps={{ iconName: 'GlobalNavButton' }} title="Show/Hide Nav" ariaLabel="Show/Hide Nav" onClick={this.ToggleFilterPanelVisibility} />
                            <Text styles={ this.timelineTitleTextStyles }>Timeline</Text>
                        </Stack>
                        <Stack horizontal horizontalAlign='end'>
                            <IconButton iconProps={{ iconName: 'FilterSettings' }} title="Search Settings" ariaLabel="Search Settings" onClick={this.ToggleSearchPanelVisibility} />
                            <IconButton iconProps={{ iconName: 'Refresh' }} title="Refresh" ariaLabel="Refresh" />
                            <IconButton iconProps={{ iconName: 'PaddingBottom' }} title='Expand' aria-label='Expand' />
                            <IconButton iconProps={{ iconName: 'PaddingTop' }} title='Collapse' aria-label='Collapse' />
                            <IconButton iconProps={{ iconName: 'Sort' }} title="Sort" ariaLabel="Sort" menuProps={this.sortMenuProps} />
                        </Stack>
                    </Stack>
                    {/* <Stack>
                        <Text>Start Date: {this.state.SearchProps.DateRange.StartDate.toDateString()}</Text>
                        <Text>End Date: {this.state.SearchProps.DateRange.EndDate.toDateString()}</Text>
                        <Text>Selected Duration: {this.state.SearchProps.SelectedDuration}</Text>
                        <Text>Search Text: {this.state.SearchProps.TimelineSearch}</Text>
                    </Stack> */}
                    {this.state.SearchProps.SearchPanelVisible && (<SearchPanel DurationChoices={this.state.SearchProps.DurationChoices} RecordTypes={this.state.SearchProps.RecordTypes} SelectedDuration={this.state.SearchProps.SelectedDuration} SelectedRecordTypes={this.state.SearchProps.SelectedRecordTypes} SearchPanelVisible={this.state.SearchProps.SearchPanelVisible } Close={ this.HideSearchPanelVisibility } DateRange={ this.state.SearchProps.DateRange } UpdateSearch={ this.SearchButtonClickOnSearchPanel }></SearchPanel>)}
                    <Stack grow>
                        <SearchBox placeholder='Search timeline' styles={this.searchboxStyles} onSearch={ this.UpdateSearchTextOnSearch } 
                        onBlur={ this.UpdateSearchTextOnBlur } onClear={ this.UpdateSearchTextOnClear } value={this.state.SearchProps.TimelineSearch}></SearchBox>
                    </Stack>
                    <Stack horizontal>
                        {this.state.FilterPanelVisible && (<Stack styles={ this.filterStackStyles }>
                            <DateFilterPanel StartDate={ this.state.SearchProps.DateRange.StartDate } EndDate={ this.state.SearchProps.DateRange.EndDate } UseCalendarMonth={ this.state.SearchProps.DateRange.UseCalendarMonth }></DateFilterPanel>
                        </Stack>)}
                        <Stack tokens={{ childrenGap: 2 }} grow styles={ { root: { border: '1px solid #ccc', borderRadius: '4px', padding: '15px', overflowY: 'auto' } }}>
                            {/* <EventCard personaImage={''} header={[{ type: 'Text', content: 'Event Date: ', sequence: 1, isBold: true }, { type: 'Space', sequence: 2 }, { type: 'Text', content: '31/07/2004 12:50:31 AM', sequence: 3, isBold: true }]} body={[ { type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 } ]} footer={[ { type: 'Text', content: 'Created On: ', sequence: 1 }, { type: 'Space', sequence: 2 }, { type: 'Text', content: '31/07/2004 12:50:31 AM', sequence: 3 }, { type: 'NewLine', sequence: 4 }, { type: 'Text', content: 'Modified On: ', sequence: 5 }, { type: 'Space', sequence: 6 }, { type: 'Text', content: '31/07/2004 12:50:31 AM', sequence: 7 } ]}></EventCard> */}

                            <EventCard personaImage='TriggerAuto' header={[{ type: 'Text', variant:'medium', content: 'Event Date: 31/07/2004 12:50:31 AM', sequence: 1, isBold: true }]} body={[ { type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 } ]} footer={[ { type: 'Text', content: 'Created On: 31/07/2004 12:50:31 AM', sequence: 1 }, { type: 'Text', content: 'Modified On: 31/07/2004 12:50:31 AM', sequence: 2 } ]}></EventCard>
                            <EventCard personaImage='Stack' header={[{ type: 'Text', variant:'medium', content: 'Event Date: 13/08/2004 05:11:04 PM', sequence: 1, isBold: true }]} body={[ { type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 } ]} footer={[ { type: 'Text', content: 'Created On: 13/08/2004 05:11:04 PM', sequence: 1 }, { type: 'Text', content: 'Modified On: 13/08/2004 05:11:04 PM', sequence: 2 } ]}></EventCard>
                            <EventCard personaImage='SaveAll' header={[{ type: 'Text', variant:'medium', content: 'Event Date: 31/07/2004 12:50:31 AM', sequence: 1, isBold: true }]} body={[ { type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 } ]} footer={[ { type: 'Text', content: 'Created On: 31/07/2004 12:50:31 AM', sequence: 1 }, { type: 'Text', content: 'Modified On: 31/07/2004 12:50:31 AM', sequence: 2 } ]}></EventCard>
                            <EventCard personaImage='Database' header={[{ type: 'Text', variant:'medium', content: 'Event Date: 31/07/2004 12:50:31 AM', sequence: 1, isBold: true }]} body={[ { type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 } ]} footer={[ { type: 'Text', content: 'Created On: 31/07/2004 12:50:31 AM', sequence: 1 }, { type: 'Text', content: 'Modified On: 31/07/2004 12:50:31 AM', sequence: 2 } ]}></EventCard>

                            {/*
                            <EventCard date='31/07/2004 12:50:31 AM' description='neque duis bibendum morbi non' type='Type1' createdOn='31/07/2004 12:50:31 AM' modifiedOn='31/07/2004 12:50:31 AM'></EventCard>
                            <EventCard date='13/08/2004 05:11:04 PM' description='massa quis augue luctus tincidunt nulla mollis molestie lorem' type='Type2' createdOn='13/08/2004 05:11:04 PM' modifiedOn='13/08/2004 05:11:04 PM'></EventCard>
                            <EventCard date='29/08/2004 05:38:07 PM' description='in porttitor pede justo eu massa' type='Type4' createdOn='29/08/2004 05:38:07 PM' modifiedOn='29/08/2004 05:38:07 PM'></EventCard>
                            <EventCard date='29/08/2004 05:38:07 PM' description='in porttitor pede justo eu massa' type='Type4' createdOn='29/08/2004 05:38:07 PM' modifiedOn='29/08/2004 05:38:07 PM'></EventCard>
                            */}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    ToggleSearchPanelVisibility(): void {
        this.setState((prevState) => ({
            SearchProps: {
                ...prevState.SearchProps,
                SearchPanelVisible: !prevState.SearchProps.SearchPanelVisible
            }
        }));
    }

    ToggleFilterPanelVisibility(): void {
        this.setState((prevState) => ({
            SearchProps: {
                ...prevState.SearchProps,
            },
            FilterPanelVisible: !prevState.FilterPanelVisible
        }));
    }

    HideSearchPanelVisibility(): void {
        this.setState((prevState) => ({
            SearchProps: {
                ...prevState.SearchProps,
                SearchPanelVisible: false
            }
        }));
    }

    SearchButtonClickOnSearchPanel(startDate: Date, endDate: Date, selectedDuration: string, recordTypes: string[]): void {        
        this.setState((prevState) => ({
            SearchProps: {
                ...prevState.SearchProps,
                DateRange: {
                    StartDate: startDate,
                    EndDate: endDate
                },
                SelectedRecordTypes: recordTypes,
                SelectedDuration: selectedDuration
            }
        }));
    }

    UpdateSearchTextOnSearch(searchText: string): void {
        this.UpdateSearchText(searchText, true);
    }

    UpdateSearchTextOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
        if(event.target.type === 'text') {
            this.UpdateSearchText(event.target.value, true);
        }
    }

    UpdateSearchTextOnClear(event: React.FocusEvent<HTMLInputElement>): void {
        this.UpdateSearchText('', true);
    }

    UpdateSearchText(searchText: string, invokeSearch: boolean): void {
        if(this.state.SearchProps.TimelineSearch !== searchText) {
            this.setState((prevState) => ({
                SearchProps: {
                    ...prevState.SearchProps,
                    TimelineSearch: searchText
                }
            }),
            () => {
                if(invokeSearch){
                    // This callback function is called after the state has been updated
                    console.log('Search query:', searchText);
                    console.log('TimelineSearch:', this.state.SearchProps.TimelineSearch);
                }
            });
        }
    }
}