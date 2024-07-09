import { IChoiceGroupOption, ICommandBarItemProps, IDropdownOption } from "@fluentui/react";

export interface TimelineProps {
    SearchProps: SearchProps;
    FilterPanelVisible?: boolean;
    ShowHideFooter?: boolean;
    IsLoading?: boolean;
    Events: EventCardProps[];
    NoRecordsText: string;
    RawData?: any[];
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
    SelectedMonths?: string[];
    TimelineSearch?: string;
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
  
export interface EventCardProps {
    key: string,
    personaImage?: string,
    header: ConfigItem[];
    body: ConfigItem[];
    footer: ConfigItem[];
    commandbarItems?: ICommandBarItemProps;
    FooterCollapsed?: boolean
}

export interface MonthGroup {
    year: number;
    months: string[];
}

export interface TimelineData {
    RawData: any[];
    Events: any[];
}