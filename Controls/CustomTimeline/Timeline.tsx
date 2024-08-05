import * as React from 'react';
import { Stack, Text, SearchBox, IconButton, IContextualMenuProps, IStackTokens, IStackStyles, IIconProps, Spinner, Modal, SpinnerSize, Link, List, DetailsList, SelectionMode, DetailsListLayoutMode, mergeStyleSets, IColumn, MarqueeSelection, TooltipHost } from '@fluentui/react';
import { RecordCard } from './SubComponents/RecordCard/RecordCard';
import { SearchPanel } from './SubComponents/SearchPanel/SearchPanel';
import { TimelineData, TimelineProps } from './Interfaces/AppTypes';
import { DateFilterPanel } from './SubComponents/DateFilterPanel/DateFilterPanel';
import { DataSource } from './Api/DataSource';

export class Timeline extends React.Component<TimelineProps, TimelineProps> {
    constructor(props: TimelineProps) {
        super(props);
        let GridColumnItems: IColumn[] = [];
        this.props.ColumnDetails?.forEach(x => {
            GridColumnItems.push(
                {
                    key: ("column" + x.FieldName),
                    fieldName: x.FieldName,
                    name: x.Header,
                    minWidth: x.MinWidth,
                    maxWidth: x.MaxWidth,
                    isRowHeader: true,
                    isResizable: true,
                    ariaLabel: x.AriaLabel,
                    isSorted: (props.GridSortEnabled && x.IsSorted),
                    isSortedDescending: x.IsSortedDescending,
                    sortAscendingAriaLabel: x.SortAscendingAriaLabel,
                    sortDescendingAriaLabel: x.SortDescendingAriaLabel,
                    data: x.DataType,
                    isPadded: true,
                    onColumnClick: this.OnColumnClick,
                    onRender: (item: any) => {
                        let value = x.Data.Target;
                        x.Data.Parameters.forEach((param: any) => {
                          const placeHolder = `{${param.Sequence}}`;
                          let replacementValue = '';
                          if (param.Type === "Parameter") {
                            replacementValue = item["Record"][param.Variable];
                          }
                          value = value.replace(placeHolder, (replacementValue ?? ''));
                        });

                        let targetUrl = '';
                        if(x.Url){
                            targetUrl = x.Url.Target;
                            x.Url.Parameters.forEach(param => {
                                const placeholder = `{${param.Sequence}}`;
                                let value = '';
                                if (param.Type === "Parameter") {
                                    value = item["Record"][param.Variable];
                                }
                                targetUrl = targetUrl.replace(placeholder, (value ?? ''));
                            });
                        }
                        return (
                            <TooltipHost content={value}>
                                {
                                    x.Url ? (<Link href={targetUrl} target='_blank'>{value}</Link>) : (<span>{value}</span>)
                                }
                            </TooltipHost>);
                    },
                }
            );
        });

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
            PanelHeight: this.props.PanelHeight,
            ControlType: this.props.ControlType,
            GridColumns: GridColumnItems,
            GridSortEnabled: this.props.GridSortEnabled,
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
    
    OnColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        if(this.state.GridSortEnabled) {
            const { GridColumns, Records } = this.state;
            const newColumns: IColumn[] = (GridColumns || []).slice();
            const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
            newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
            });

            const newItems = this.CopyAndSort(Records || [], currColumn.fieldName!, currColumn.isSortedDescending);
            this.setState({
                GridColumns: newColumns,
                Records: newItems,
            });
        }
    };

    
    // CopyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    //     const key = columnKey as keyof T;
    //     return items.slice(0).sort((a: any, b: any) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    // }
    CopyAndSort<T>(items: T[], columnKey: string, isSortedDescending: boolean = false): T[] {
        const key = columnKey as keyof T;
    
        return items.slice(0).sort((a: any, b: any) => {
            const aValue = a["Record"][key];
            const bValue = b["Record"][key];
    
            if (aValue == null || bValue == null) {
                return 0;
            }
    
            let comparison = 0;
    
            if (typeof aValue === 'string' || typeof bValue === 'string') {
                comparison = aValue.toString().localeCompare(bValue.toString());
            } else if (typeof aValue === 'number' || typeof bValue === 'number') {
                comparison = (+aValue) - (+bValue);
            } else if (aValue instanceof Date || bValue instanceof Date) {
                comparison = (new Date(aValue.toString())).getTime() - (new Date(bValue.toString())).getTime();
            } else {
                comparison = aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
            }
    
            return isSortedDescending ? -comparison : comparison;
        });
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
    filterStackStyles: IStackStyles = { root: { width: '15%', border: '1px solid #ccc', padding: '10px', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', backgroundColor: '#f9f9f9', marginRight: '10px', height: `${ this.props.PanelHeight }` } };
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
                            {
                                (this.state.ControlType.toLowerCase() !== "grid") && 
                                (
                                    <>
                                        {
                                            (this.state.ControlModel.RecordUiTemplate.Footer || []).length > 0 &&
                                            <IconButton iconProps={ this.state.ShowHideFooter ? this.CollapsedIcon : this.ExpandedIcon } title={ this.state.ShowHideFooter ? 'Expand' : 'Collapse' } 
                                                aria-label={ this.state.ShowHideFooter ? 'Expand' : 'Collapse' } onClick={ this.ToggleFooterVisibility } />
                                        }
                                        <IconButton iconProps={{ iconName: 'Sort' }} title="Sort" ariaLabel="Sort" menuProps={this.sortMenuProps} />
                                    </>
                                )
                            }
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
                            StartDateAllowedYears={ this.state.SearchProps.DateRange.StartDateAllowedYears } UseCalendarMonth={ this.state.SearchProps.DateRange.UseCalendarMonth }
                            UpdateSelectedMonths={ this.UpdateSelectedMonthsForSearch } SortDirection={ this.state.SearchProps.SortDirection }></DateFilterPanel>
                        </Stack>)}
                        <Stack tokens={{ childrenGap: 2 }} grow onScroll={ this.HandleRecordListScroll } key={ 'stack_record_list' }
                            styles={ { root: { border: '1px solid #ccc', borderRadius: '4px', padding: '15px', overflowY: 'auto', minHeight: `${ this.props.PanelHeight }`, maxHeight: `${ this.props.PanelHeight }` } }}>
                                { (this.state.ControlType.toLowerCase() === "cardcollection") && this.state.Records.length > 0 && this.state.Records.map((item) => (
                                    <RecordCard Key={ item.Key } PersonaColorCodes={ this.state.ControlModel.PersonaColorCodes } FooterCollapsed={ this.state.ShowHideFooter } RecordUiTemplate={ this.state.ControlModel.RecordUiTemplate } ConfigData={ this.state.CommandbarConfigData } Record={ item.Record }></RecordCard>
                                ))}
                                {
                                (this.state.ControlType.toLowerCase() === "grid") && (this.state.Records || []).length > 0 && 
                                    <Stack>
                                        <DetailsList
                                            items={this.state.Records || []}
                                            columns={this.state.GridColumns}
                                            selectionMode={SelectionMode.none}
                                            getKey={this.GetKey}
                                            setKey="none"
                                            layoutMode={DetailsListLayoutMode.justified}
                                            isHeaderVisible={true}
                                            onRenderDetailsHeader={(props, defaultRender) => (
                                                <div className={this.classNames.header}>
                                                {defaultRender ? defaultRender(props):null}
                                                </div>
                                            )}
                                            className={this.classNames.list}
                                        />
                                    </Stack>
                                }
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

    classNames = mergeStyleSets({
        header: {
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'white',
        },
        list: {
          overflowY: 'auto',
        },
    });

    private GetKey(item: any, index?: number): string {
        return item["Name"];
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
                const nextItems =  await DataSource.GenerateOutputData(this.state.RawData?.slice(this.state.Records.length, this.state.Records.length + this.state.ItemsToDisplay) || [],  false, this.state.ItemsToDisplay, []);
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
            container.scrollTop = container.scrollTop - 10;
            this.LoadMoreItems();
          }
        }
      };

    GetTimelineRecords() {
        this.GetData("GetTimelineRecords", this.state.SearchProps.SortDirection);
    }

    SortTimelineRecords(sortDirection: string) {
        this.setState((prevState) => ({
            ...prevState,
            SearchProps: {
                ...prevState.SearchProps,
                SortDirection: sortDirection,
            },
        }),
        async () => {
            this.GetData("SortTimelineRecords", sortDirection);
        });
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
                        Data = await DataSource.SortData(this.state.RawData || [], this.state.UnfilteredData || [], sortDirection || 'asc', false, this.state.ItemsToDisplay);
                        Data.UnfilteredData = this.state.UnfilteredData || [];
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
                    ...prevState.SearchProps.DateRange,
                    StartDate: startDate,
                    EndDate: endDate,
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
                    ...prevState.SearchProps.DateRange,
                    SelectedMonths: SelectedMonths
                    // StartDate: prevState.SearchProps.DateRange.StartDate,
                    // EndDate: prevState.SearchProps.DateRange.EndDate,
                    // SelectedMonths: SelectedMonths,
                    // UseCalendarMonth: prevState.SearchProps.DateRange.UseCalendarMonth,
                    // StartDateAllowedYears: prevState.SearchProps.DateRange.StartDateAllowedYears,
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