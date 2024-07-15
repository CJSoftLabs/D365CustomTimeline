import { IChoiceGroupOption, ICommandBarItemProps, IDropdownOption } from "@fluentui/react";
import { IInputs } from "../generated/ManifestTypes";

export interface TimelineProps {
    SearchProps: SearchProps;
    FilterPanelVisible?: boolean;
    ShowHideFooter?: boolean;
    IsLoading?: boolean;
    Records: RecordCardProps[];
    NoRecordsText: string;
    ItemsToDisplay: number;
    RawData?: any[];
    UnfilteredData?: any[];
    HasMoreItems?: boolean;
    StartedToLoad?: boolean;
    Context: ComponentFramework.Context<IInputs>;
    ControlModel: AppModel;
    CommandbarConfigData: CommandBarConfigItem[];
}

export interface DateRangeProps {
    StartDate: Date;
    EndDate: Date;
    UseCalendarMonth?: boolean;
    SelectedMonths?: any;
    CollapsedYears?: any;
    UpdateDateFields?: (startDate: Date, endDate: Date) => void;
    UpdateSelectedMonths?: (selectedMonths: any[]) => void;
}

export interface SearchProps {
    RecordTypes: IDropdownOption[];
    SelectedRecordTypes: string[];
    DurationChoices: IChoiceGroupOption[];
    SelectedDuration: string;
    SearchPanelVisible: boolean;
    DateRange: DateRangeProps;
    SortDirection: string,
    TimelineSearch?: string;
    SearchFields: string[];
    Close?: () => void;
    UpdateSearch?: (startDate: Date, endDate: Date, selectedDuration: string, recordTypes: string[]) => void;
}

export interface ConfigItem {
    type: 'Text' | 'Icon' | 'Link' | 'Label';
    content?: string; // Empty or Null only for Space Type or NewLine Type
    sequence: number;
    url?: string; // Only for Link
    iconName?: string; // Only for Icon
    isBold?: boolean; // New property to indicate if the text should be bold
    variant?: string; // Only for Text
  }

export interface CommandBarConfigItem {
    Key: string;
    IconName: string;
    Title: string;
    OperationType: string;
    Url: ParameterizedTarget;
}
  
export interface RecordCardProps {
    Key: string,
    PersonaImage?: string,
    PersonaBackgroundValue?: number,
    Header: ConfigItem[];
    Body: ConfigItem[];
    Footer: ConfigItem[];
    CommandbarItems?: ICommandBarItemProps[];
    ConfigData: CommandBarConfigItem[];
    FooterCollapsed?: boolean;
    Record: any;
    PersonaColorCodes: any[];
}

export interface MonthGroup {
    year: number;
    months: string[];
}

export interface TimelineData {
    RawData: any[];
    Records: any[];
    UnfilteredData: any[];
}

export interface EntityModel {
    Name: string;
    IsActivity: boolean;
    PrimaryEntity: string;
    ActivityEntities?: string[];
    Select: string;
    Filter: ParameterizedTarget;
    FieldMapping: EntityFieldMapping[];
}

export interface ParameterizedTarget {
    Target: string;
    Parameters: DynamicParameter[];
}

export interface DynamicParameter {
    Sequence: number;
    Type: string;
    Variable: string;
    IsDateValue?: boolean;
}

export interface EntityFieldMapping {
    SourceField: string;
    TargetField: string;
}

export interface AppModel {
    Fields?: string[];
    UiTemplate: any;
    Entities: EntityModel[];
    PersonaColorCodes: any[];
}

export interface RecordData {
    entityName: string;
    [key: string]: any;
}