import * as React from "react";
import { DropdownMenuItemType, IChoiceGroupOption, IDropdownOption } from "@fluentui/react";
import { createRoot, Root } from 'react-dom/client';
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { Timeline } from "./Timeline";
import { TimelineProps } from './Interfaces/Common';

export class CustomTimeline implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private context: ComponentFramework.Context<IInputs>;
    private rootControl: Root;

    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this.context = context;
        this.container = container;
        // this.container = document.createElement("div");
        // container.appendChild(this.container);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control viewthis.context = context;
        // const jsonString = context.parameters.jsonData.raw;
        // if (jsonString) {
        //     //this.renderCards(jsonString);
        // }

        this.RenderControl();
    }

    private RenderControl(){
        const currentDate = new Date();
        const beginDate = new Date(currentDate);
        beginDate.setDate(1);
        beginDate.setMonth(beginDate.getMonth() - 8);
        //beginDate.setMonth(currentDate.getMonth() - 9);

        const dropdownOptions: IDropdownOption[] = [
            { key: 'selectAll', text: 'Select All' },
            { key: 'ActivitiesHeader', text: 'Activities', itemType: DropdownMenuItemType.Header },
            { key: 'email', text: 'Email' },
            { key: 'phonecall', text: 'Phone Call' },
            { key: 'task', text: 'Task' },
            { key: 'letter', text: 'Letter' },
            { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
            { key: 'OtherEntitiesHeader', text: 'Other Entities', itemType: DropdownMenuItemType.Header },
            { key: 'postactivity', text: 'Post Activity' },
        ];
    
        const DurationChoices: IChoiceGroupOption[] = [
            { key: '3m', text: 'Last 3 Months' },
            { key: '6m', text: 'Last 6 Months' },
            { key: '9m', text: 'Last 9 Months' },
            { key: 'custom', text: 'Custom' },
        ];
    
        const oTimelineProps: TimelineProps = {
            SearchProps: {
                RecordTypes: dropdownOptions,
                SelectedRecordTypes: ['email'],
                DurationChoices: DurationChoices,
                SelectedDuration: '9m',
                SearchPanelVisible: false,
                DateRange: {
                    StartDate: beginDate,
                    EndDate: currentDate,
                    UseCalendarMonth: true,
                }
            }
        };
        if(this.rootControl === undefined)
        {
            this.rootControl = createRoot(this.container);
        }
        this.rootControl.render(React.createElement(
            Timeline,
            oTimelineProps
        ));
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
