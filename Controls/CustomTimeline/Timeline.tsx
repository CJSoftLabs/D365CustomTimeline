import * as React from 'react';
import { Stack, Text, SearchBox, IconButton, IContextualMenuProps, IStackTokens, IStackStyles, IIconProps, Spinner, Modal, SpinnerSize } from '@fluentui/react';
import { EventCard } from './SubComponents/EventCard/EventCard';
import { SearchPanel } from './SubComponents/SearchPanel/SearchPanel';
import { EventCardProps, TimelineProps } from './Interfaces/Common';
import { DateFilterPanel } from './SubComponents/DateFilterPanel/DateFilterPanel';

export class Timeline extends React.Component<TimelineProps, TimelineProps> {
    constructor(props: TimelineProps) {
        super(props);
        this.state = {
            SearchProps: this.props.SearchProps,
            FilterPanelVisible: false,
            ShowHideFooter: this.props.ShowHideFooter,
            IsLoading: true,
            NoRecordsText: this.props.NoRecordsText,
            Events: this.props.Events,
        };
        
        // Bind the event handler to the class instance
        this.ToggleSearchPanelVisibility = this.ToggleSearchPanelVisibility.bind(this);
        this.ToggleFilterPanelVisibility = this.ToggleFilterPanelVisibility.bind(this);
        this.HideSearchPanelVisibility = this.HideSearchPanelVisibility.bind(this);
        this.SearchButtonClickOnSearchPanel = this.SearchButtonClickOnSearchPanel.bind(this);
        this.UpdateSearchTextOnSearch = this.UpdateSearchTextOnSearch.bind(this);
        this.UpdateSearchTextOnBlur = this.UpdateSearchTextOnBlur.bind(this);
        this.UpdateSearchTextOnClear = this.UpdateSearchTextOnClear.bind(this);
        this.ToggleFooterVisibility = this.ToggleFooterVisibility.bind(this);
        this.GetTimelineRecords = this.GetTimelineRecords.bind(this);
    }

    componentDidMount() {
        this.GetTimelineRecords();
    }

    async fetchData(primaryEntity: string, primaryKey: string, primaryValue: string) {
        let returnData: [] = [];
        await fetch('https://run.mocky.io/v3/195cc5ec-ef4d-4431-9eda-fc1bdba1664a')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            returnData = data.filter((item: { [x: string]: string; }) => item[primaryKey] === primaryValue);
          })
          .catch(error => {
            returnData = [];
          });

          return returnData;
    }

    GetTimelineRecords() {
        this.setState((prevState) => ({
            ...prevState,
            Events: [],
            IsLoading: true
        }),
        async () => {
            try {
                let Data = await this.fetchData('postactivity', 'accountid', '83883308-7ad5-ea11-a813-000d3a33f3b4');
                let UpdatedEvents: EventCardProps[] = [];

                Data.forEach((item, index) => {
                    UpdatedEvents.push({
                        key: `postactivity_Event${index + 1}`,
                        personaImage: 'Database',
                        FooterCollapsed: false,
                        header: [{ type: 'Text', variant:'medium', content: ('Event Date: ' + item["createdon"]), sequence: 1, isBold: true }],
                        body: [{ type: 'Text', content: item["postactivityname"], sequence: 1 }, { type: 'Text', content: item["postactivitytype"], sequence: 2 }],
                        footer: [{ type: 'Text', content: 'Created On: ' + item["createdon"], sequence: 1 }, { type: 'Text', content: 'Modified On: ' + item["modifiedon"], sequence: 2 }]
                    });
                });

                //await this.delay(500);
                this.setState((prevState) => ({
                    ...prevState,
                    Events: UpdatedEvents,
                    IsLoading: false,
                    RawData: Data,
                }));
            } catch (error) {
              console.error('Error fetching status:', error);
              this.setState((prevState) => ({
                ...prevState,
                IsLoading: false, }));
            }
        });
    }

    FilterTimelineRecords() {
        this.setState((prevState) => ({
            ...prevState,
            Events: [],
            IsLoading: true
        }),
        async() => {
            try {
                let UpdatedEvents: EventCardProps[] = [{
                    key: 'Event1',
                    personaImage: 'TriggerAuto',
                    FooterCollapsed: false,
                    header: [{ type: 'Text', variant:'medium', content: 'Event Date: 31/07/2004 12:50:31 AM', sequence: 1, isBold: true }],
                    body: [{ type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 }],
                    footer: [{ type: 'Text', content: 'Created On: 31/07/2004 12:50:31 AM', sequence: 1 }, { type: 'Text', content: 'Modified On: 31/07/2004 12:50:31 AM', sequence: 2 }]
                },
                {
                    key: 'Event2',
                    personaImage: 'Stack',
                    FooterCollapsed: false,
                    header: [{ type: 'Text', variant:'medium', content: 'Event Date: 13/08/2004 05:11:04 PM', sequence: 1, isBold: true }],
                    body: [{ type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 }],
                    footer: [{ type: 'Text', content: 'Created On: 13/08/2004 05:11:04 PM', sequence: 1 }, { type: 'Text', content: 'Modified On: 13/08/2004 05:11:04 PM', sequence: 2 } ]
                },
                {
                    key: 'Event3',
                    personaImage: 'SaveAll',
                    FooterCollapsed: false,
                    header: [{ type: 'Text', variant:'medium', content: 'Event Date: 31/07/2004 12:50:31 AM', sequence: 1, isBold: true }],
                    body: [{ type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 }],
                    footer: [ { type: 'Text', content: 'Created On: 31/07/2004 12:50:31 AM', sequence: 1 }, { type: 'Text', content: 'Modified On: 31/07/2004 12:50:31 AM', sequence: 2 } ]
                },
                {
                    key: 'Event4',
                    personaImage: 'Database',
                    FooterCollapsed: false,
                    header: [{ type: 'Text', variant:'medium', content: 'Event Date: 31/07/2004 12:50:31 AM', sequence: 1, isBold: true }],
                    body: [{ type: 'Text', content: 'neque duis bibendum morbi non', sequence: 1 }, { type: 'Text', content: 'Type1', sequence: 2 }],
                    footer: [{ type: 'Text', content: 'Created On: 31/07/2004 12:50:31 AM', sequence: 1 }, { type: 'Text', content: 'Modified On: 31/07/2004 12:50:31 AM', sequence: 2 }]
                }];
                await this.delay(500);
                this.setState((prevState) => ({
                    ...prevState,
                    Events: UpdatedEvents,
                    IsLoading: false,
                  }));
            } catch (error) {
              console.error('Error fetching status:', error);
                this.setState((prevState) => ({
                    ...prevState,
                    IsLoading: false, }));
            }
        });
    }

    delay = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
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
    }
    
    // Define tokens for spacing
    parentStackTokens: IStackTokens = { childrenGap: 10, padding: 20 };
    CollapsedIcon: IIconProps = { iconName: 'PaddingBottom' };
    ExpandedIcon: IIconProps = { iconName: 'PaddingTop' };

    // Define styles for setting css attributes
    timelineStackStyles: IStackStyles = { root: { padding: '10px', height: '100%', overflowY: 'auto' } };
    filterStackStyles: IStackStyles = { root: { width: '15%', border: '1px solid #ccc', padding: '10px', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', backgroundColor: '#f9f9f9', marginRight: '10px', height: '55vh' } };
    parentStackStyles: IStackStyles = { root: { border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }};
    timelineTitleTextStyles: IStackStyles = { root: { paddingLeft: '5px', fontWeight: 'bold', fontFamily: '"SegoeUI-Semibold", "Segoe UI Semibold", "Segoe UI Regular", "Segoe UI"' } };
    searchboxStyles: IStackStyles = { root: { border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'rgb(245, 245, 245)' } };

    render() {
        return (
            <Stack styles={this.timelineStackStyles}>
                <Modal
                    isModeless={false}
                    isOpen={this.state.IsLoading}
                >
                    <Stack
                        horizontalAlign="center"
                        verticalAlign="center"
                        verticalFill
                        styles={{ root: { height: '200px', width: '350px' } }}
                    >
                        <Spinner size={SpinnerSize.large} />
                        <Text>Loading ...</Text>
                    </Stack>
                </Modal>
                <Stack tokens={this.parentStackTokens} grow styles={ this.parentStackStyles }>
                    <Stack horizontal>
                        <Stack horizontal grow verticalAlign='center'>
                            <IconButton iconProps={{ iconName: 'GlobalNavButton' }} title="Show/Hide Nav" ariaLabel="Show/Hide Nav" onClick={this.ToggleFilterPanelVisibility} />
                            <Text styles={ this.timelineTitleTextStyles }>Timeline</Text>
                        </Stack>
                        <Stack horizontal horizontalAlign='end'>
                            <IconButton iconProps={{ iconName: 'FilterSettings' }} title="Search Settings" ariaLabel="Search Settings" onClick={this.ToggleSearchPanelVisibility} />
                            <IconButton iconProps={{ iconName: 'Refresh' }} title="Refresh" ariaLabel="Refresh" onClick={ this.GetTimelineRecords } />
                            <IconButton iconProps={ this.state.ShowHideFooter ? this.CollapsedIcon : this.ExpandedIcon } title={ this.state.ShowHideFooter ? 'Expand' : 'Collapse' } 
                            aria-label={ this.state.ShowHideFooter ? 'Expand' : 'Collapse' } onClick={ this.ToggleFooterVisibility } />
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
                        <Stack tokens={{ childrenGap: 2 }} grow styles={ { root: { border: '1px solid #ccc', borderRadius: '4px', padding: '15px', overflowY: 'auto', minHeight: '400px' } }}>
                            {this.state.Events.length > 0 && this.state.Events.map((item) => (
                                <EventCard key={ item.key } personaImage={ item.personaImage } FooterCollapsed={ this.state.ShowHideFooter } header={ item.header } body={ item.body } footer={ item.footer }></EventCard>
                            ))}
                            { (this.state.Events.length === 0) && (!this.state.IsLoading) && <Stack grow horizontalAlign='center' verticalAlign='center'>
                                    <Text>{ this.state.NoRecordsText }</Text>
                                </Stack>}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    ToggleSearchPanelVisibility(): void {
        this.setState((prevState) => ({
            ...prevState,
            SearchProps: {
                ...prevState.SearchProps,
                SearchPanelVisible: !prevState.SearchProps.SearchPanelVisible
            },
        }));
    }

    ToggleFilterPanelVisibility(): void {
        this.setState((prevState) => ({
            ...prevState,
            FilterPanelVisible: !prevState.FilterPanelVisible,
        }));
    }

    HideSearchPanelVisibility(): void {
        this.setState((prevState) => ({
            ...prevState,
            SearchProps: {
                ...prevState.SearchProps,
                SearchPanelVisible: false
            },
        }));
    }

    SearchButtonClickOnSearchPanel(startDate: Date, endDate: Date, selectedDuration: string, recordTypes: string[]): void {        
        this.setState((prevState) => ({
            ...prevState,
            SearchProps: {
                ...prevState.SearchProps,
                DateRange: {
                    StartDate: startDate,
                    EndDate: endDate
                },
                SelectedRecordTypes: recordTypes,
                SelectedDuration: selectedDuration
            },
        }));

        this.GetTimelineRecords();
    }

    ToggleFooterVisibility(): void {        
        this.setState((prevState) => ({
            ...prevState,
            ShowHideFooter: !this.state.ShowHideFooter,
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
                ...prevState,
                SearchProps: {
                    ...prevState.SearchProps,
                    TimelineSearch: searchText
                },
            }),
            () => {
                if(invokeSearch){
                    // This callback function is called after the state has been updated
                    this.FilterTimelineRecords();
                }
            });
        }
    }
}