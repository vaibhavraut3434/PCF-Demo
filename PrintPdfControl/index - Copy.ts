import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class PrintPdfControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _notifyOutputChanged: () => void;
	private buttonElement: HTMLButtonElement;
	private tableElement: HTMLTableElement;
	private thElement: HTMLTableCaptionElement;
	private trElement: HTMLTableRowElement;
	private tdElement: HTMLTableCellElement;	
	private divForTable: HTMLDivElement;
	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private printableString: string;
	//private printableJson: JSON;

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
		this.buttonElement = document.createElement("button");
		this.buttonElement.innerHTML = context.resources.getString(
			"Print It"
		  );
		this.buttonElement.setAttribute("type","button");
		this.buttonElement.addEventListener("click",this.onButtonClick.bind(this));

		this.tableElement = document.createElement("table");
		this.tableElement.setAttribute("id","table");
		this.tableElement.style.border = '1';

		this.divForTable = document.createElement("div");
		this.divForTable.id = "divForTable";
		this._container = document.createElement("div");
		this._container.id = "_container";
		container.style.width = "200";
		container.style.height = "100";
		this._container.appendChild(this.buttonElement);
		//this.divForTable.appendChild(this.tableElement);
		container.appendChild(this._container);
		container.appendChild(this.divForTable);
		
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if(context.parameters.StrToJSON.raw)
		{
			this.printableString = context.parameters.StrToJSON.raw;
		}
		
	}


	public onButtonClick(event: Event): void
	{
		//alert(this.printableString);
		//alert("testss");
		var jsonObj = JSON.parse(this.printableString);
		
        var col = [];
        for (var i = 0; i < jsonObj.length; i++) {
			//alert("In");
            for (var key in jsonObj[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
		// Insert first row for table header
		this.trElement = this.tableElement.insertRow(-1);                  
		// Add headings in table
        for (var i = 0; i < col.length; i++) {
            this.thElement = document.createElement("th");   
            this.thElement.innerHTML = col[i];
            this.trElement.appendChild(this.thElement);
        }
		// Insert row for every record in JSON obj
		// Insert table cell with data from JSON obj
        for (var i = 0; i < jsonObj.length; i++) {
            this.trElement = this.tableElement.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                this.tdElement = this.trElement.insertCell(-1);
                this.tdElement.innerHTML = jsonObj[i][col[j]];
            }
		}
		this.divForTable.appendChild(this.tableElement);
		let printContents, popupWin;
		var abcd = document.getElementById("divForTable");
		
		if(abcd)
		{
			printContents = abcd.innerHTML;
		}
    	popupWin = window.open('', 'Print Preview', 'top=0,left=0,height=100%,width=auto');
		if(popupWin)
		{
			popupWin.document.open();
			popupWin.document.write(`
			<html>
				<head>
				<title>Print tab</title>
				<style>
				</style>
				</head>
			<body onload="window.print();window.close()">${printContents}</body>
			</html>`
			);
			var cleartable = document.getElementById("table");
			if(cleartable){cleartable.innerHTML = ""};
			popupWin.document.close();			
	}
	
	this._notifyOutputChanged();
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
