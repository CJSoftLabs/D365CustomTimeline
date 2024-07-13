import * as React from "react";
import { createRoot, Root } from 'react-dom/client';
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { Timeline } from "./Timeline";
import { TimelineProps } from './Interfaces/AppTypes';

export class CustomTimeline implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private context: ComponentFramework.Context<IInputs>;
    private rootControl: Root;
    private configData: any;

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
        this.configData = JSON.parse(context.parameters.configData.raw || '{}');
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        this.RenderControl();
    }

    private RenderControl(){
        const oTimelineProps: TimelineProps = this.configData.TimelineProps;
        let value = oTimelineProps.SearchProps.SelectedDuration;

        if(value !== 'custom') {
            const sDate = new Date();
            if(oTimelineProps.SearchProps.DateRange.UseCalendarMonth ?? false) {
                sDate.setDate(1);
                sDate.setMonth(sDate.getMonth() - +(value.replace('m', '')) +1);
            } else {
                sDate.setMonth(sDate.getMonth() - +(value.replace('m', '')));
            }

            oTimelineProps.SearchProps.DateRange.StartDate = sDate;
            oTimelineProps.SearchProps.DateRange.EndDate = new Date();
        }
        oTimelineProps.Context = this.context;

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
