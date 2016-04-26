import {Component, OnInit, ViewEncapsulation} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {ApiService} from "./api.service";

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
declare var $: any;

class Summary {
	constructor(public customerCount: number, public brandCount: number, public productCount: number, public orderCount: number) { }
}

@Component({
    selector: "dashboard",
    templateUrl: "./src/app/components/dashboard.html",
	styleUrls: ["./src/app/components/dashboard.css"],
	providers: [ApiService],
	directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES],
	encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {
    summary: Summary = new Summary(0, 0, 0, 0);
    constructor(private service: ApiService) { }

    ngOnInit() {
		var that = this;

        this.service.getDashboardSummary(json => {
			if (json) {
				that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount);
			}
		});

		this.service.getDashboardAnnualSales(json => {
			if (json) {

				var series = [].ToList<string>();
				var data1 = [].ToList<number>();
				var data2 = [].ToList<number>();
				var data3 = [].ToList<number>();

				json.forEach(x => {
					series.Add(x.monthName);
					data1.Add(x.cost);
					data2.Add(x.income);
					data3.Add(x.profit);
				});

				this.lineChartData = [data1.ToArray(), data2.ToArray(), data3.ToArray()];
			}
		});
    }

	// lineChart
	private lineChartData: Array<any> = [[], [], []];
	private lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	private lineChartSeries: Array<any> = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
	private lineChartOptions: any = {
		animation: false,
		responsive: true,
		multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
		pointDotRadius: 4,
		maintainAspectRatio: false,
		datasetStrokeWidth: 1,
		// scale
		scaleLineColor: "rgba(0,0,0,0.5)",
		scaleFontFamily: "'Roboto', sans-serif",
		// Tooltip
		tooltipFillColor: "#fff",
		tooltipTitleFontColor: "#777",
		tooltipTitleFontSize: 14,
		tooltipTitleFontFamily: "'Roboto', sans-serif",
		tooltipFontColor: "#777",
		tooltipFontSize: 12,
		tooltipFontFamily: "'Roboto', sans-serif"

	};
	private lineChartColours: Array<any> = [
		{
			fillColor: 'rgba(0,0,0,0)',
			strokeColor: 'rgba(217,101,87,1)',
			pointColor: 'rgba(217,101,87,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: 'rgba(217,101,87,1)',
			pointHighlightStroke: 'rgba(217,101,87,1)'
		},
		{
			fillColor: 'rgba(0,0,0,0)',
			strokeColor: 'rgba(0,153,204,1)',
			pointColor: 'rgba(0,153,204,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: 'rgba(0,153,204,1)',
			pointHighlightStroke: 'rgba(0,153,204,1)'
		},
		{
			fillColor: 'rgba(0,0,0,0)',
			strokeColor: 'rgba(76,195,217,1)',
			pointColor: 'rgba(76,195,217,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: 'rgba(76,195,217,1)',
			pointHighlightStroke: 'rgba(76,195,217,1)'
		}
	];
	private lineChartLegend: boolean = true;
	private lineChartType: string = 'Line';
}