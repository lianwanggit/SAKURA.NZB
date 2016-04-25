import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {ApiService} from "./api.service";

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

class Summary {
	constructor(public customerCount: number, public brandCount: number, public productCount: number, public orderCount: number) { }
}

@Component({
    selector: "dashboard",
    templateUrl: "./src/app/components/dashboard.html",
	styleUrls: ["./src/app/components/dashboard.css"],
	providers: [ApiService],
	directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class DashboardComponent implements OnInit {
    summary: Summary = new Summary(0, 0, 0, 0);

	private lineChartData: Array<any> = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90],
		[18, 48, 77, 9, 100, 27, 40]
	];
	private lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	private lineChartSeries: Array<any> = ['Series A', 'Series B', 'Series C'];
	private lineChartOptions: any = {
		animation: false,
		responsive: true,
		multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
	};
	private lineChartColours: Array<any> = [
		{ // grey
			fillColor: 'rgba(148,159,177,0.2)',
			strokeColor: 'rgba(148,159,177,1)',
			pointColor: 'rgba(148,159,177,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(148,159,177,0.8)'
		},
		{ // dark grey
			fillColor: 'rgba(77,83,96,0.2)',
			strokeColor: 'rgba(77,83,96,1)',
			pointColor: 'rgba(77,83,96,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(77,83,96,1)'
		},
		{ // grey
			fillColor: 'rgba(148,159,177,0.2)',
			strokeColor: 'rgba(148,159,177,1)',
			pointColor: 'rgba(148,159,177,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(148,159,177,0.8)'
		}
	];

	private lineChartLegend: boolean = true;
	private lineChartType: string = 'Line';

    constructor(private service: ApiService) { }

    ngOnInit() {
		var that = this;

        this.service.getDashboardSummary(json => {
			if (json) {
				that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount);
			}
		});
    }

	// events
	chartClicked(e: any) {
		console.log(e);
	}

	chartHovered(e: any) {
		console.log(e);
	}
}