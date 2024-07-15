import { EntityModel, RecordData, SearchProps } from "../Interfaces/AppTypes";
import { IInputs } from "../generated/ManifestTypes";

export class DataSource {
  static Context: ComponentFramework.Context<IInputs>;

  static GetValue(obj: any, path: string): any {
      // Split the path by '.' to handle nested properties
      const keys = path.split('.');

      // Iterate through the keys to get the value
      let value = obj;
      for (const key of keys) {
          if (value[key] !== undefined) {
              value = value[key];
          } else {
              // If the property does not exist, return undefined
              return undefined;
          }
      }
      return value;
  }

  static GetMonthIndex(month: string): number {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(month);
  }

  static ParseYearMonth(yearMonth: string): { year: number, month: number } {
    const [year, month] = yearMonth.split('-');
    return { year: parseInt(year, 10), month: DataSource.GetMonthIndex(month) };
  }

  static async FetchData(entityList: EntityModel[], searchProps: SearchProps, sortDirection: string, itemsToDisplay: number) {
    //Called when,
    //1) The control is loaded (or)
    //2) The refresh button is clicked in the main panel (or)
    //3) Search button is clicked in the Search Panel
    let recordsData: any[] = [];
    let isActivityEnabled: boolean = entityList.some(entity => entity.Name === "Activity");
    let hasSelection: boolean = (searchProps.SelectedRecordTypes.length > 0);
    let hasActivitySelection: boolean = searchProps.SelectedRecordTypes.some(x => x.toLocaleLowerCase().startsWith("activity"));
    let allCustomRecordTypes = searchProps.RecordTypes.filter(option => !option.itemType  && (option.key as string).toLowerCase().startsWith('custom-')).map(option => (option.key as string).replace("custom-", "").toLowerCase());
    let allActivityRecordTypes = searchProps.RecordTypes.filter(option => !option.itemType  && (option.key as string).toLowerCase().startsWith('activity-')).map(option => (option.key as string).replace("activity-", "").toLowerCase());

    if (entityList) {
      for (const entity of entityList) {
        let entityName = entity.Name.toLowerCase();
        if((hasSelection && searchProps.SelectedRecordTypes.some(x => x.toLocaleLowerCase().replace("custom-", "") === entityName)) || (hasSelection && hasActivitySelection && entityName === 'activity') || (!hasSelection && isActivityEnabled && entityName === 'activity') || (!hasSelection && allCustomRecordTypes.some(x => x === entityName))) {
          let query: string = entity.Select;
          let filter: string = entity.Filter.Target;

          entity.Filter.Parameters.forEach(param => {
            const placeholder = `{${param.Sequence}}`;
            let value = '';
            if (param.Type === "Parameter" && param.Variable in DataSource.Context.parameters) {
                value = DataSource.Context.parameters[param.Variable as keyof IInputs]?.raw || '';
            } else if (param.Type === "SearchProperty" && searchProps) {
              value = DataSource.GetValue(searchProps, param.Variable);
              if(param.IsDateValue) {
                value = new Date(value).toISOString();
              }
            }
            filter = filter.replace(placeholder, (value ?? ''));
          });

          if(entity.IsActivity) {
            //Filter based on selected Activity Types
            const filteredActivityTypes = hasSelection ? (searchProps.SelectedRecordTypes
            .filter(type => type.startsWith('activity-'))
            .map(type => type.replace('activity-', ''))) : allActivityRecordTypes;
            const activityTypeFilter = filteredActivityTypes.map(type => `activitytypecode eq '${type}'`).join(' or ');

            filter = ((filter.trim().length > 0) ? (filter + ' and (') : '$filter=(') + activityTypeFilter + ')';
          }

          filter = (filter.trim().length > 0) ? '&' + filter : '';

          while (query !== '') {
            try {
              const result = await DataSource.Context.webAPI.retrieveMultipleRecords(entity.PrimaryEntity, "?" + query + filter);
              for (const element of result.entities) {
                let recordData: RecordData = {
                  entityName: entity.PrimaryEntity,
                  entityDisplayName: entityName,
                };
                entity.FieldMapping === null || entity.FieldMapping === void 0 ? void 0 : entity.FieldMapping.forEach(Mapping => {
                  recordData[Mapping.TargetField] = element[Mapping.SourceField];
                });
                if(entity.IsActivity) {
                  recordData["entityName"] = element["activitytypecode"];
                  recordData["entityDisplayName"] = element["activitytypecode"];
                }
                recordsData.push(recordData);
              }

              const nextLink = (result as any)["@odata.nextLink"];
                if (nextLink) {
                    query = nextLink;
                } else {
                    query = '';
                }
            } catch(error) {
              query = '';
              console.error('Error fetching status:', error);
            }
          }
        }
      }
    }
    //Sort the retreived records after collecting all types of records
    recordsData = (await DataSource.SortData(recordsData, sortDirection, true, 0)).RawData;

    return this.GenerateOutputData(recordsData, true, itemsToDisplay, false, []);
  }

  static async GenerateOutputData(SourceData: any[], BuildRawData: boolean, ItemsToDisplay: number, IsFilterCall: boolean, UnfilteredData: any[]) {
    let UpdatedRecords: any[] = [];
    let Data:any = [];
    SourceData.forEach((item: any, index) => {
      if(BuildRawData) {
        Data.push(item);
      }
      if(index < ItemsToDisplay) {
        UpdatedRecords.push({
            key: (item["entityName"] + '_Record_' + item["id"]),
            FooterCollapsed: false,
            Header: [{ type: 'Text', variant:'medium', content: ('Record Date: ' + item["createdOn"]), sequence: 1, isBold: true }],
            Body: [{ type: 'Text', content: item["name"], sequence: 1 }, { type: 'Text', content: item["other"], sequence: 2 }],
            Footer: [{ type: 'Text', content: 'Created On: ' + item["createdOn"], sequence: 1 }, { type: 'Text', content: 'Modified On: ' + item["modifiedOn"], sequence: 2 }],
            Record: item
        });
      }
    });

    return { RawData: Data, Records: UpdatedRecords, UnfilteredData: (IsFilterCall ? UnfilteredData : Data) };
  }

  static async SortData(Data: any[], sortDirection: string, returnSortedDataAsIs: boolean, itemsToDisplay: number) {
    //Called when the sort asc or sort desc button is clicked in the main panel
    if(Data !== undefined) {
      Data = Data.sort((a, b) => {
          const dateA = new Date(a["sortDateValue"]).getTime();
          const dateB = new Date(b["sortDateValue"]).getTime();
      
          if (sortDirection === 'asc') {
            return dateA - dateB;
          } else if (sortDirection === 'desc') {
            return dateB - dateA;
          } else {
            throw new Error('Invalid direction. Use "asc" for ascending or "desc" for descending.');
          }
      });
    }
    if(returnSortedDataAsIs) {
      return { RawData: Data, Records: [], UnfilteredData: Data };
    }
    
    return this.GenerateOutputData(Data, true, itemsToDisplay, false, []);
  }

  static async FilterData(Data: any[], SelectedMonths: any, ItemsToDisplay: number, SearchText: string, SearchFields: string[]) {
    //Called when,
    //1) The Search text is provided and searched (or)
    //2) The Search text is cleared (or)
    //3) The Apply button in the DateFilter panel is clicked
    let ReturnData: any[] = [];
    const ParsedYearMonths = Object.keys(SelectedMonths).filter(key => SelectedMonths[key] === true).map(DataSource.ParseYearMonth.bind(this));

    //Filter based on selected months
    if(ParsedYearMonths.length > 0) {
      ReturnData = Data.filter(obj => {
        const SortDate = new Date(obj.sortDateValue);
        const objYear = SortDate.getFullYear();
        const objMonth = SortDate.getMonth(); // getMonth returns 0-based month index
        
        return ParsedYearMonths.some((ym: { year: any; month: any; }) => ym.year === objYear && ym.month === objMonth);
      });
    } else {
      ReturnData = Data;
    }

    //Filter based on search text
    if((SearchText ?? '').trim().length > 0) {
      ReturnData = ReturnData.filter(item => SearchFields.some(field => item[field]?.toString().toLowerCase().includes(SearchText.toLowerCase())));
    }

    return this.GenerateOutputData(ReturnData, true, ItemsToDisplay, true, Data);
  }
}