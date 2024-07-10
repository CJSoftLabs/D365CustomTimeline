import { IInputs } from "../generated/ManifestTypes";

export class DataSource {
  static Context: ComponentFramework.Context<IInputs>;

  static async FetchData(primaryEntity: string, query: string, primaryValue: string, itemsToDisplay: number) {
      let hasMorePages: boolean = true;      
      let rawRecordsData: any[] = [];
      
      try {
        while (query !== '') {
            const result = await DataSource.Context.webAPI.retrieveMultipleRecords(primaryEntity, query);
            rawRecordsData = rawRecordsData.concat(result.entities);

            const nextLink = (result as any)["@odata.nextLink"];
              if (nextLink) {
                  query = nextLink;
              } else {
                  query = '';
              }
        }
      } catch(error) {
        console.error('Error fetching status:', error);
      }

      let recordsData: any[] = [];
      rawRecordsData === null || rawRecordsData === void 0 ? void 0 : rawRecordsData.forEach(element => {
        let recordData = {
          id: element["cjs_postactivityid"],
          name: element["cjs_postactivityname"],
          description: element["cjs_description"],
          other: element["cjs_postactivitytype@OData.Community.Display.V1.FormattedValue"],
          sortDateValue: element["cjs_createdon"],
          createdOn: element["cjs_createdon"],
          modifiedOn: element["cjs_createdon"],
        };
        recordsData.push(recordData);
      });

      return this.GenerateOutputData(recordsData, hasMorePages, true, itemsToDisplay);
  }

  static async GenerateOutputData(SourceData: any[], HasMorePages: boolean, BuildRawData: boolean, itemsToDisplay: number) {
    let UpdatedEvents: any[] = [];
    let Data:any = [];
    SourceData.forEach((item: any, index) => {
      item["sortdate"] = item["sortDateValue"];
      if(BuildRawData) {
        Data.push(item);
      }
      if(index < itemsToDisplay) {
        UpdatedEvents.push({
            key: ('postactivity_Event' + item["id"]),
            personaImage: 'Database',
            FooterCollapsed: false,
            header: [{ type: 'Text', variant:'medium', content: ('Event Date: ' + item["createdOn"]), sequence: 1, isBold: true }],
            body: [{ type: 'Text', content: item["name"], sequence: 1 }, { type: 'Text', content: item["other"], sequence: 2 }],
            footer: [{ type: 'Text', content: 'Created On: ' + item["createdOn"], sequence: 1 }, { type: 'Text', content: 'Modified On: ' + item["modifiedOn"], sequence: 2 }]
        });
      }
    });

    return { RawData: Data, Events: UpdatedEvents };

  }

  static async SortData(Data: any[], sortDirection: string, itemsToDisplay: number) {
    if(Data !== undefined) {
      Data = Data.sort((a, b) => {
          const dateA = new Date(a["sortdate"]).getTime();
          const dateB = new Date(b["sortdate"]).getTime();
      
          if (sortDirection === 'asc') {
            return dateA - dateB;
          } else if (sortDirection === 'desc') {
            return dateB - dateA;
          } else {
            throw new Error('Invalid direction. Use "asc" for ascending or "desc" for descending.');
          }
      });
    }
    
    return this.GenerateOutputData(Data, false, true, itemsToDisplay);
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
    return this.GenerateOutputData(ReturnData, false, true, itemsToDisplay);
  }
}