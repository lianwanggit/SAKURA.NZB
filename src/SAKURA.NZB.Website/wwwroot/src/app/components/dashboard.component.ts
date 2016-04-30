import {Component, OnInit, ViewEncapsulation} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {ApiService} from "./api.service";

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
declare var $: any;

class Summary {
	constructor(public customerCount: number, public brandCount: number, public productCount: number, public orderCount: number,
		public totalCost: string, public totalIncome: string, public totalProfit: string, public unpaidCount: number,
		public unpaidAmount: string, public todayProfit: string, public profitIncrementRate: string, public profitIncrement: number) { }
}

class TopProduct {
	constructor(public name: string, public count: number) { }
}

class DaySale {
	constructor(public date: string, public count: number, public profit: number) { }
}

@Component({
    selector: "dashboard",
    templateUrl: "./src/app/components/dashboard.html",
	styleUrls: ["./src/app/components/dashboard.css"],
	providers: [ApiService],
	directives: [CHART_DIRECTIVES, BUTTON_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES],
	encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {
    summary: Summary = new Summary(0, 0, 0, 0, '', '', '', 0, '', '', '', 0);
	topSales = [].ToList<TopProduct>();
	past30DaysProfit = [].ToList<DaySale>();

	costList = [].ToList<number>();
	incomeList = [].ToList<number>();
	profitList = [].ToList<number>();
	orderCountList = [].ToList<number>();

	annualSalesChartSwitch = false;

	// lineChart
	private annualSalesChartData: Array<any> = [[], [], []];
	private annualSalesChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	private annualSalesChartSeries: Array<any> = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
	private annualSalesChartOptions: any = {
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
	private annualSalesChartColours: Array<any> = [
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
		},
		{
			fillColor: 'rgba(0,0,0,0)',
			strokeColor: 'rgba(217,101,87,1)',
			pointColor: 'rgba(217,101,87,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: 'rgba(217,101,87,1)',
			pointHighlightStroke: 'rgba(217,101,87,1)'
		}
	];
	private annualSalesChartLegend: boolean = false;
	private annualSalesChartType: string = 'Line';

	private topSalesChartOptions = {
		responsive: true,
		multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
		showScale: false,
		showTooltips: false,
		barShowStroke: false,
	};

	private topSalesChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	private topSalesChartSeries = ['A'];
	public topSalesChartType = 'Bar';
	private topSalesChartLegend: boolean = false;

	private topSalesChartData = []
	private topSalesChartNames = [];
	selectedTopProductIndex = 0;
	selectedTopProductName = '';
	selectedTopProductCount = 0;
	firstTopProductName = '';

	private topSalesChartColours: Array<any> = [
		{
			fillColor: 'rgba(84,84,84,0.3)',
			strokeColor: 'rgba(84,84,84,0.3)',
			highlightFill: 'rgba(76,195,217,1)',
			highlightStroke: 'rgba(76,195,217,1)'
		}
	];

	// lineChart
	private pastDailyProfitChartData: Array<any> = [[],[]];
	private pastDailyProfitChartLabels: Array<any> = [];
	private pastDailyProfitChartSeries: Array<any> = ['利润', '&nbsp;'];
	private pastDailyProfitChartOptions: any = {
		animation: false,
		responsive: true,
		multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
		pointDotRadius: 2,
		maintainAspectRatio: false,
		datasetStrokeWidth: 1,
		showScale: false,
		pointDot: false,
		// Tooltip
		tooltipFillColor: "#fff",
		tooltipTitleFontColor: "#777",
		tooltipTitleFontSize: 14,
		tooltipTitleFontFamily: "'Roboto', sans-serif",
		tooltipFontColor: "#777",
		tooltipFontSize: 12,
		tooltipFontFamily: "'Roboto', sans-serif"

	};
	private pastDailyProfitChartColours: Array<any> = [
		{
			fillColor: 'rgba(0,153,204,0.5)',
			strokeColor: 'rgba(0,153,204,0.5)',
			pointColor: 'rgba(0,153,204,0.5)',
			pointStrokeColor: 'rgba(0,153,204,0.5)',
			pointHighlightFill: 'rgba(0,153,204,1)',
			pointHighlightStroke: 'rgba(0,153,204,1)'
		},
		{}
	];
	private pastDailyProfitChartLegend: boolean = false;
	private pastDailyProfitChartType: string = 'Line';

	private doughnutChartLabels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'a', 'b', 'c', 'd'];
	private doughnutChartData = [350, 450, 100, 210, 330, 450, 800];
	private doughnutChartType = 'Doughnut';

    constructor(private service: ApiService) { }

    ngOnInit() {
		var that = this;

        this.service.getDashboardSummary(json => {
			if (json) {
				that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount,
					json.totalCost, json.totalIncome, json.totalProfit, json.unpaidCount, json.unpaidAmount,
					json.todayProfit, json.profitIncrementRate, json.profitIncrement);
			}
		});

		this.service.getDashboardAnnualSales(json => {
			if (json) {
				json.forEach(x => {
					that.costList.Add(x.cost);
					that.incomeList.Add(x.income);
					that.profitList.Add(x.profit);
					that.orderCountList.Add(x.count);
				});

				that.changeAnnualSalesChartData();
			}
		});

		this.service.getDashboardTopSales(json => {
			if (json) {
				json.forEach(x => {
					that.topSales.Add(new TopProduct(x.productName, x.count));
				});

				that.topSalesChartData = [that.topSales.Select(s => s.count).ToArray()];
				that.topSalesChartNames = that.topSales.Select(s => s.name).ToArray();

				if (that.topSales.Count() > 0) {
					that.selectedTopProductIndex = 1;
					that.selectedTopProductName = this.topSalesChartNames[0];
					that.firstTopProductName = this.topSalesChartNames[0];
					that.selectedTopProductCount = this.topSalesChartData[0][0];
				}
			}
		});

		this.service.getDashboardPast30DaysProfit(json => {
			if (json) {
				json.forEach(x => {
					that.past30DaysProfit.Add(new DaySale(x.date, x.orderCount, x.profit));
				});

				that.pastDailyProfitChartLabels = that.past30DaysProfit.Select(p => p.date).ToArray();
				that.pastDailyProfitChartData = [that.past30DaysProfit.Select(p => p.profit).ToArray(), []];			
			}
		});
    }

	onSwapAnnualSalesDateSource(flag: boolean) {
		if (this.annualSalesChartSwitch == flag) return;

		this.annualSalesChartSwitch = flag;
		this.changeAnnualSalesChartData();
	}

	onTopSalesChartSelected(e) {
		this.selectedTopProductIndex = parseInt(e.activeLabel, 10) + 1;
		this.selectedTopProductName = this.topSalesChartNames[e.activeLabel];
		this.selectedTopProductCount = e.activePoints[0].value;
	}

	changeAnnualSalesChartData() {
		if (!this.annualSalesChartSwitch) {
			this.annualSalesChartData = [this.costList.ToArray(), this.incomeList.ToArray(), this.profitList.ToArray()];
			this.annualSalesChartSeries = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
		} else {
			this.annualSalesChartData = [this.orderCountList.ToArray(), [], []];
			this.annualSalesChartSeries = ['订单数量', '&nbsp;', '&nbsp;'];
		}
	}
}