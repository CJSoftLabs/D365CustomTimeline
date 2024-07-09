export class DataSource {
    static async FetchData(primaryEntity: string, primaryKey: string, primaryValue: string) {
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
          })

          return this.GenerateOutputData(returnData);
    }

    static async GenerateOutputData(SourceData: any[]) {
      let UpdatedEvents: any[] = [];
      let Data:any = [];
      SourceData.forEach((item: any, index) => {
        item["sortdate"] = item["createdon"];
        Data.push(item);
        UpdatedEvents.push({
            key: `postactivity_Event${index + 1}`,
            personaImage: 'Database',
            FooterCollapsed: false,
            header: [{ type: 'Text', variant:'medium', content: ('Event Date: ' + item["createdon"]), sequence: 1, isBold: true }],
            body: [{ type: 'Text', content: item["postactivityname"], sequence: 1 }, { type: 'Text', content: item["postactivitytype"], sequence: 2 }],
            footer: [{ type: 'Text', content: 'Created On: ' + item["createdon"], sequence: 1 }, { type: 'Text', content: 'Modified On: ' + item["modifiedon"], sequence: 2 }]
        });
      });

      return { RawData: Data, Events: UpdatedEvents };

    }

    static async SortData(Data: any[], sortDirection: string) {
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
      
      return this.GenerateOutputData(Data);
  }

  static async FilterData(Data: any[]) {
    let ReturnData : any[] = [{
        postactivityid:  "3a504d9b-7f21-4ec2-a1fc-28ed2dde0c2a",
        postactivityname:  "tellus in sagittis dui vel nisl",
        userid:  "37",
        body:  "pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum",
        postactivitytype:  "397630002",
        accountid:  "83883308-7ad5-ea11-a813-000d3a33f3b4",
        createdon:  "2015-06-02T21:50:08Z",
        executedon:  "2015-06-02T21:50:08Z",
        modifiedon:  "2015-07-05T02:00:00Z"
    },
    {
        postactivityid:  "bc7c6ad5-14a3-4701-a263-46ecabfaf210",
        postactivityname:  "amet erat nulla tempus vivamus in",
        userid:  "84",
        body:  "consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at nunc commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt",
        postactivitytype:  "397630000",
        accountid:  "81883308-7ad5-ea11-a813-000d3a33f3b4",
        createdon:  "2018-03-11T08:01:33Z",
        executedon:  "2018-03-11T08:01:33Z",
        modifiedon:  "2018-05-23T01:00:00Z"
    },
    {
        postactivityid:  "d5a5ebe7-59aa-44ba-b3ee-79e2abc5edc6",
        postactivityname:  "ante vel ipsum praesent blandit lacinia erat vestibulum",
        userid:  "80",
        body:  "magnis dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur",
        postactivitytype:  "397630001",
        accountid:  "88cea450-cb0c-ea11-a813-000d3a1b1223",
        createdon:  "2020-11-10T01:22:22Z",
        executedon:  "2020-11-10T01:22:22Z",
        modifiedon:  "2020-11-14T22:00:00Z"
    },
    {
        postactivityid:  "2475ff95-612e-4df7-8b14-58a6909aef9a",
        postactivityname:  "et ultrices posuere cubilia",
        userid:  "86",
        body:  "pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus",
        postactivitytype:  "397630003",
        accountid:  "b4cea450-cb0c-ea11-a813-000d3a1b1223",
        createdon:  "2014-11-13T23:52:58Z",
        executedon:  "2014-11-13T23:52:58Z",
        modifiedon:  "2014-11-30T04:00:00Z"
    }];
    return this.GenerateOutputData(ReturnData);
  }
}