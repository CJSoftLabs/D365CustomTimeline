import * as React from 'react';
import { Stack, Text, SearchBox, IconButton, IContextualMenuProps, IStackTokens, IStackStyles, IIconProps, Spinner, Modal, SpinnerSize, Link, List } from '@fluentui/react';
import { EventCard } from './SubComponents/EventCard/EventCard';
import { SearchPanel } from './SubComponents/SearchPanel/SearchPanel';
import { TimelineData, TimelineProps } from './Interfaces/Common';
import { DateFilterPanel } from './SubComponents/DateFilterPanel/DateFilterPanel';
import { DataSource } from './Api/DataSource';

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
            RawData: [],
            ItemsToDisplay: this.props.ItemsToDisplay,
            HasMoreItems: false,
            StartedToLoad: false,
            Context: this.props.Context,
        };

        DataSource.Context = this.state.Context;
        
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
        this.UpdateSelectedMonthsForSearch = this.UpdateSelectedMonthsForSearch.bind(this);
        this.HandleLoadMoreClick = this.HandleLoadMoreClick.bind(this);
    }

    sortMenuProps: IContextualMenuProps = {
        items: [
          {
            key: 'sortDescending',
            text: 'Sort newer to older',
            iconProps: { iconName: 'GroupedDescending' },
            onClick: () => { this.SortTimelineRecords("desc") },
          },
          {
            key: 'sortAscending',
            text: 'Sort older to newer',
            iconProps: { iconName: 'GroupedAscending' },
            onClick: () => { this.SortTimelineRecords("asc") },
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
                    {this.state.SearchProps.SearchPanelVisible && 
                        (<SearchPanel DurationChoices={this.state.SearchProps.DurationChoices} RecordTypes={this.state.SearchProps.RecordTypes}
                            SelectedDuration={this.state.SearchProps.SelectedDuration} SelectedRecordTypes={this.state.SearchProps.SelectedRecordTypes}
                            SearchPanelVisible={this.state.SearchProps.SearchPanelVisible } Close={ this.HideSearchPanelVisibility } DateRange={ this.state.SearchProps.DateRange }
                            UpdateSearch={ this.SearchButtonClickOnSearchPanel }></SearchPanel>)}
                    <Stack grow>
                        <SearchBox placeholder='Search timeline' styles={this.searchboxStyles} onSearch={ this.UpdateSearchTextOnSearch } 
                        onBlur={ this.UpdateSearchTextOnBlur } onClear={ this.UpdateSearchTextOnClear } value={this.state.SearchProps.TimelineSearch}></SearchBox>
                    </Stack>
                    <Stack horizontal>
                        {this.state.FilterPanelVisible && (<Stack styles={ this.filterStackStyles }>
                            <DateFilterPanel StartDate={ this.state.SearchProps.DateRange.StartDate } EndDate={ this.state.SearchProps.DateRange.EndDate } SelectedMonths={ this.state.SearchProps.DateRange.SelectedMonths }
                            UseCalendarMonth={ this.state.SearchProps.DateRange.UseCalendarMonth } UpdateSelectedMonths={ this.UpdateSelectedMonthsForSearch }></DateFilterPanel>
                        </Stack>)}
                        <Stack tokens={{ childrenGap: 2 }} grow styles={ { root: { border: '1px solid #ccc', borderRadius: '4px', padding: '15px', overflowY: 'auto', minHeight: '55vh', maxHeight: '55vh' } }}>
                                {this.state.Events.length > 0 && this.state.Events.map((item) => (
                                    <EventCard key={ item.key } personaImage={ item.personaImage } FooterCollapsed={ this.state.ShowHideFooter } header={ item.header } body={ item.body } footer={ item.footer }></EventCard>
                                ))}
                                <Stack onMouseOver={ () => { if(this.state.StartedToLoad) { this.HandleLoadMoreClick(); } }}>
                                    {this.state.HasMoreItems && (
                                        <Link onClick={this.HandleLoadMoreClick} style={{ marginTop: '20px' }}>
                                            Load more
                                        </Link>
                                    )}
                                </Stack>
                                {(this.state.Events.length === 0) && (!this.state.IsLoading) && <Stack grow horizontalAlign='center' verticalAlign='center'>
                                    <Text>{ this.state.NoRecordsText }</Text>
                                </Stack>}
                        </Stack>
                    </Stack>
                    <Stack>
                            <Text>Displaying { this.state.Events.length } Records</Text>
                        </Stack>
                </Stack>
            </Stack>
        );
    }

    componentDidMount() {
        this.GetTimelineRecords();
    }

    LoadMoreItems = () => {
        this.setState((prevState) => ({
            ...prevState,
            IsLoading: true,
            HasMoreItems: false,
        }),
        async () => {
            try {
                const nextItems =  await DataSource.GenerateOutputData(this.state.RawData?.slice(this.state.Events.length, this.state.Events.length + this.state.ItemsToDisplay) || [],  this.state.HasMorePages || false, false, this.state.ItemsToDisplay);
                const newEvents = this.state.Events.concat(nextItems.Events);
                let HasMoreRecords = false;
                if (this.state.HasMorePages || (this.state.RawData?.length || 0) > newEvents.length) {
                    HasMoreRecords = true;
                }
                
                await this.delay(500);
                this.setState((prevState) => ({
                    ...prevState,
                    Events: newEvents,
                    HasMoreItems: HasMoreRecords,
                    IsLoading: false,
                    StartedToLoad: true,
                }));
            } catch (error) {
              console.error('Error fetching status:', error);
              this.setState((prevState) => ({
                ...prevState,
                IsLoading: false, }));
            }
        });
    }

    HandleLoadMoreClick() {
        this.LoadMoreItems();
    }

    GetTimelineRecords() {
        this.GetData("GetTimelineRecords");
    }

    SortTimelineRecords(sortDirection: string) {
        this.GetData("SortTimelineRecords", sortDirection);
    }

    FilterTimelineRecords() {
        this.GetData("FilterTimelineRecords");
    }

    GetData(operation: string, sortDirection?: string){
        this.setState((prevState) => ({
            ...prevState,
            Events: [],
            IsLoading: true,
            HasMoreItems: false,
        }),
        async () => {
            try {
                let Data: TimelineData = {
                    RawData: [],
                    Events: []
                };

                switch(operation.toLowerCase()){
                    case "gettimelinerecords":
                        Data = await DataSource.FetchData('cjs_postactivity', `?$filter=cjs_accountid/accountid eq '${DataSource.Context.parameters.primaryKey.raw}'`, '83883308-7ad5-ea11-a813-000d3a33f3b4', this.state.ItemsToDisplay);
                        break;
                    case "sorttimelinerecords":
                        Data = await DataSource.SortData(this.state.RawData || [], sortDirection || 'asc', this.state.ItemsToDisplay);
                        break;
                    case "filtertimelinerecords":
                        Data = await DataSource.FilterData(this.state.RawData || [], this.state.ItemsToDisplay);
                        break;
                }
                let HasMoreRecords = false;
                if (this.state.HasMorePages || Data.RawData.length > Data.Events.length) {
                    HasMoreRecords = true;
                }

                await this.delay(500);
                this.setState((prevState) => ({
                    ...prevState,
                    Events: Data.Events,
                    IsLoading: false,
                    RawData: Data.RawData,
                    HasMoreItems: HasMoreRecords,
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
                HasMoreItems: false,
            }),
            () => {
                if(invokeSearch){
                    // This callback function is called after the state has been updated
                    this.FilterTimelineRecords();
                }
            });
        }
    }

    UpdateSelectedMonthsForSearch(SelectedMonths: any) {
        this.setState((prevState) => ({
            ...prevState,
            SearchProps: {
                ...prevState.SearchProps,
                //SelectedMonths: SelectedMonths
                DateRange: {
                    StartDate: prevState.SearchProps.DateRange.StartDate,
                    EndDate: prevState.SearchProps.DateRange.EndDate,
                    SelectedMonths: SelectedMonths,
                }
            },
            HasMoreItems: false,
            //this.state.SearchProps.DateRange.SelectedMonths
        }),
        () => {
            // This callback function is called after the state has been updated
            this.FilterTimelineRecords();
        });
    }
}