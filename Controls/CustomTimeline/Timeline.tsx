import * as React from 'react';
import { Stack, Text, SearchBox, IconButton, IContextualMenuProps, IStackTokens, IStackStyles, IIconProps, Spinner, Modal, SpinnerSize, Link, List } from '@fluentui/react';
import { RecordCard } from './SubComponents/RecordCard/RecordCard';
import { SearchPanel } from './SubComponents/SearchPanel/SearchPanel';
import { TimelineData, TimelineProps } from './Interfaces/AppTypes';
import { DateFilterPanel } from './SubComponents/DateFilterPanel/DateFilterPanel';
import { DataSource } from './Api/DataSource';

export class Timeline extends React.Component<TimelineProps, TimelineProps> {
    constructor(props: TimelineProps) {
        super(props);
        this.state = {
            SearchProps: this.props.SearchProps,
            FilterPanelVisible: this.props.FilterPanelVisible,
            ShowHideFooter: this.props.ShowHideFooter,
            IsLoading: true,
            NoRecordsText: this.props.NoRecordsText,
            Records: this.props.Records,
            RawData: [],
            ItemsToDisplay: this.props.ItemsToDisplay,
            HasMoreItems: false,
            StartedToLoad: false,
            Context: this.props.Context,
            ControlModel: this.props.ControlModel,
            CommandbarConfigData: this.props.CommandbarConfigData,
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
        this.HandleRecordListScroll = this.HandleRecordListScroll.bind(this);
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
                            UpdateSearch={ this.SearchButtonClickOnSearchPanel } SortDirection={ this.state.SearchProps.SortDirection } SearchFields={this.state.SearchProps.SearchFields}></SearchPanel>)}
                    <Stack grow>
                        <SearchBox placeholder='Search timeline' styles={this.searchboxStyles} onSearch={ this.UpdateSearchTextOnSearch } 
                        onBlur={ this.UpdateSearchTextOnBlur } onClear={ this.UpdateSearchTextOnClear } value={this.state.SearchProps.TimelineSearch}></SearchBox>
                    </Stack>
                    <Stack horizontal>
                        {this.state.FilterPanelVisible && (<Stack styles={ this.filterStackStyles }>
                            <DateFilterPanel StartDate={ this.state.SearchProps.DateRange.StartDate } EndDate={ this.state.SearchProps.DateRange.EndDate } SelectedMonths={ this.state.SearchProps.DateRange.SelectedMonths }
                            UseCalendarMonth={ this.state.SearchProps.DateRange.UseCalendarMonth } UpdateSelectedMonths={ this.UpdateSelectedMonthsForSearch }></DateFilterPanel>
                        </Stack>)}
                        <Stack tokens={{ childrenGap: 2 }} grow onScroll={ this.HandleRecordListScroll } key={ 'stack_record_list' }
                            styles={ { root: { border: '1px solid #ccc', borderRadius: '4px', padding: '15px', overflowY: 'auto', minHeight: '55vh', maxHeight: '55vh' } }}>
                                {this.state.Records.length > 0 && this.state.Records.map((item) => (
                                    <RecordCard Key={ item.Key } PersonaImage={ item.PersonaImage } FooterCollapsed={ this.state.ShowHideFooter } Header={ item.Header } Body={ item.Body } Footer={ item.Footer } ConfigData={ this.state.CommandbarConfigData } Record={ item.Record }></RecordCard>
                                ))}
                                <Stack>
                                    {this.state.HasMoreItems && (
                                        <Link onClick={this.HandleLoadMoreClick} style={{ marginTop: '20px' }}>
                                            Load more
                                        </Link>
                                    )}
                                </Stack>
                                {(this.state.Records.length === 0) && (!this.state.IsLoading) && <Stack grow horizontalAlign='center' verticalAlign='center'>
                                    <Text>{ this.state.NoRecordsText }</Text>
                                </Stack>}
                        </Stack>
                    </Stack>
                    <Stack>
                            <Text>Showing { this.state.Records.length } Records</Text>
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
                const nextItems =  await DataSource.GenerateOutputData(this.state.RawData?.slice(this.state.Records.length, this.state.Records.length + this.state.ItemsToDisplay) || [],  false, this.state.ItemsToDisplay, false, []);
                const newRecords = this.state.Records.concat(nextItems.Records);
                let HasMoreRecords = false;
                if ((this.state.RawData?.length || 0) > newRecords.length) {
                    HasMoreRecords = true;
                }
                
                await this.delay(500);
                this.setState((prevState) => ({
                    ...prevState,
                    Records: newRecords,
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

    HandleRecordListScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const container = event.target as HTMLDivElement;
        if (container.scrollHeight - container.scrollTop === container.clientHeight) {
          if (this.state.HasMoreItems && this.state.StartedToLoad) {
            this.LoadMoreItems();
          }
        }
      };

    GetTimelineRecords() {
        this.GetData("GetTimelineRecords", this.state.SearchProps.SortDirection);
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
            Records: [],
            IsLoading: true,
            HasMoreItems: false,
        }),
        async () => {
            try {
                let Data: TimelineData = {
                    RawData: [],
                    Records: [],
                    UnfilteredData: [],
                };
                let SelectedMonth: any = this.state.SearchProps.DateRange.SelectedMonths;

                switch(operation.toLowerCase()){
                    case "gettimelinerecords":
                        Data = await DataSource.FetchData(this.state.ControlModel.Entities, this.state.SearchProps, (sortDirection ?? ''), this.state.ItemsToDisplay);
                        SelectedMonth = {};
                        break;
                    case "sorttimelinerecords":
                        Data = await DataSource.SortData(this.state.RawData || [], sortDirection || 'asc', false, this.state.ItemsToDisplay);
                        break;
                    case "filtertimelinerecords":
                        Data = await DataSource.FilterData(this.state.UnfilteredData || [], this.state.SearchProps.DateRange.SelectedMonths, this.state.ItemsToDisplay, this.state.SearchProps.TimelineSearch || '', this.state.SearchProps.SearchFields);
                        break;
                }
                let HasMoreRecords = false;
                if (Data.RawData.length > Data.Records.length) {
                    HasMoreRecords = true;
                }

                await this.delay(500);
                this.setState((prevState) => ({
                    ...prevState,
                    Records: Data.Records,
                    IsLoading: false,
                    RawData: Data.RawData,
                    UnfilteredData: Data.UnfilteredData,
                    HasMoreItems: HasMoreRecords,
                    SearchProps: {
                        ...prevState.SearchProps,
                        DateRange: {
                            ...prevState.SearchProps.DateRange,
                            SelectedMonths: SelectedMonth,
                        }
                    }
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
                    EndDate: endDate,
                    UseCalendarMonth: prevState.SearchProps.DateRange.UseCalendarMonth
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
                    UseCalendarMonth: prevState.SearchProps.DateRange.UseCalendarMonth
                }
            },
            HasMoreItems: false,
        }),
        () => {
            // This callback function is called after the state has been updated
            this.FilterTimelineRecords();
        });
    }
}