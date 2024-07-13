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

  static async FetchData(entityList: EntityModel[], searchProps: SearchProps, sortDirection: string, itemsToDisplay: number) {
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
          let filter: string = entity.Filter.Query;

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
                  entityName: entity.Name
                };
                entity.FieldMapping === null || entity.FieldMapping === void 0 ? void 0 : entity.FieldMapping.forEach(Mapping => {
                  recordData[Mapping.TargetField] = element[Mapping.SourceField];
                });
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

    return this.GenerateOutputData(recordsData, true, itemsToDisplay);
  }

  static async GenerateOutputData(SourceData: any[], BuildRawData: boolean, itemsToDisplay: number) {
    let UpdatedRecords: any[] = [];
    let Data:any = [];
    SourceData.forEach((item: any, index) => {
      if(BuildRawData) {
        Data.push(item);
      }
      if(index < itemsToDisplay) {
        UpdatedRecords.push({
            key: (item["entityName"] + '_Record_' + item["id"]),
            //personaImage: 'Database',
            FooterCollapsed: false,
            header: [{ type: 'Text', variant:'medium', content: ('Record Date: ' + item["createdOn"]), sequence: 1, isBold: true }],
            body: [{ type: 'Text', content: item["name"], sequence: 1 }, { type: 'Text', content: item["other"], sequence: 2 }],
            footer: [{ type: 'Text', content: 'Created On: ' + item["createdOn"], sequence: 1 }, { type: 'Text', content: 'Modified On: ' + item["modifiedOn"], sequence: 2 }]
        });
      }
    });

    return { RawData: Data, Records: UpdatedRecords };

  }

  static async SortData(Data: any[], sortDirection: string, returnSortedDataAsIs: boolean, itemsToDisplay: number) {
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
      return { RawData: Data, Records: [] };
    }
    
    return this.GenerateOutputData(Data, true, itemsToDisplay);
  }

  static async FilterData(Data: any[], itemsToDisplay: number) {
    let ReturnData : any[] = [{
      id: "3a504d9b-7f21-4ec2-a1fc-28ed2dde0c2a",
      name: "tellus in sagittis dui vel nisl",
      other: "pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum",
      createdOn: "2015-06-02T21:50:08Z",
      sortDateValue: "2015-06-02T21:50:08Z",
      modifiedOn: "2015-06-02T21:50:08Z"
    },
    {
      id: "bc7c6ad5-14a3-4701-a263-46ecabfaf210",
      name: "amet erat nulla tempus vivamus in",
      other: "consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at nunc commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt",
      createdOn: "2018-03-11T08:01:33Z",
      sortDateValue: "2018-03-11T08:01:33Z",
      modifiedOn: "2018-03-11T08:01:33Z"
    },
    {
      id: "d5a5ebe7-59aa-44ba-b3ee-79e2abc5edc6",
      name: "ante vel ipsum praesent blandit lacinia erat vestibulum",
      other: "magnis dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur",
      createdOn: "2020-11-10T01:22:22Z",
      sortDateValue: "2020-11-10T01:22:22Z",
      modifiedOn: "2020-11-10T01:22:22Z"
    },
    {
      id: "2475ff95-612e-4df7-8b14-58a6909aef9a",
      name: "et ultrices posuere cubilia",
      other: "pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus",
      createdOn: "2014-11-13T23:52:58Z",
      sortDateValue: "2014-11-13T23:52:58Z",
      modifiedOn: "2014-11-13T23:52:58Z"
    }];

    // let ReturnData: any[] = [];
    return this.GenerateOutputData(ReturnData, true, itemsToDisplay);
  }
}