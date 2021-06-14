import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CheckListGrid, IProps, IItem } from "./CheckListGrid";

export class CheckListSubgrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _noImagePlaceholder: string = "data:image/png;base64,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";
	private _notifyOutputChanged: () => void;
	private _props: IProps;
	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._container = container;
		this._context = context;

		//this._notifyOutputChanged = notifyOutputChanged;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		if (context.parameters.listImageDataSet.loading) { return; }

		this._context = context;
		var dataset = context.parameters.listImageDataSet;

		var ids = dataset.sortedRecordIds;
		var records = dataset.records;

		var imageFallbackUrl: string = this._noImagePlaceholder;

		const items: IItem[] = ids.map(id => ({
			url: records[id].getValue("url") == null ? imageFallbackUrl : records[id].getValue("url").toString(),
			name: records[id].getValue("name").toString(),
			alternateText: records[id].getValue("alternateText") == null ? " " : records[id].getValue("alternateText").toString(),
			id: id,
			description: records[id].getValue("description") == null ? "No Description" : records[id].getValue("description").toString(),
			twoOptions: <boolean>records[id].getValue("booleanAttribute"),
		})
		);

		var pageSize = (<any>dataset.paging).pageSize;
		var recordCount = dataset.paging.totalResultCount;

		let props: IProps = {
			items: items,
			openRecord: this.openRecord.bind(this),
			onChange: this.notifyChange.bind(this),
			pcfContext: this._context,
		};

		ReactDOM.render(
			React.createElement(CheckListGrid, props),
			this._container
		);
	}

	private openRecord(id: string) {
		let navigateType: boolean = this._context.parameters.navigateForm.raw == "0";

		if (navigateType) {
			let pageInput = {
				pageType: "entityrecord",
				entityName: this._context.parameters.listImageDataSet.getTargetEntityType(),
				entityId: id
			};

			let navigationOptions = {
				target: 2,
				width: { value: 100, unit: "%" },
				height: { value: 100, unit: "%" },
				position: 1
			};

			(<any>this._context.navigation).navigateTo(pageInput, navigationOptions);
		} else {
			let entityFormOptions = {
				entityName: this._context.parameters.listImageDataSet.getTargetEntityType(),
				entityId: id
			};

			(<any>this._context.navigation).openForm(entityFormOptions);
		}
	}

	private loadPage(pageNumber: number) {
		(<any>this._context.parameters.listImageDataSet.paging).loadExactPage(pageNumber);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this._container);
	}

	private notifyChange(id: string, checkedOn: boolean | undefined) {
		let dataSet = this._context.parameters.listImageDataSet;
		var columnname: string = "";
		for (var column of dataSet.columns) {
			if (column.dataType === 'TwoOptions') {
				var name = column.name.toString();
				var data = { [name]: checkedOn };
				this._context.webAPI.updateRecord(this._context.parameters.listImageDataSet.getTargetEntityType(), id, data).then(
					function success(result: any) {
						console.log("Record Updated");
						// perform operations on record update
					},
					function (error: any) {
						console.log(error.message);
						// handle error conditions
					}
				);
			}
		}
		this._context.parameters.listImageDataSet.refresh();
	}
}