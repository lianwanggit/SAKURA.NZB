import {Component, OnInit, ViewEncapsulation} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {ApiService} from "./api.service";
import {Dict} from "./orders/models";

import {BUTTON_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
declare var $: any;

class Summary {
	constructor(public customerCount: number, public brandCount: number, public productCount: number, public orderCount: number,
		public totalCost: string, public totalIncome: string, public totalProfit: string, public unpaidCount: number,
		public unpaidAmount: string, public todayProfit: string, public profitIncrementRate: string, public profitIncrement: number,
		public todayExchange: number, public exchangeIncrement: number, public exchangeIncrementRate: string) { }
}

class TopProduct {
	constructor(public name: string, public count: number) { }
}

class TopBrand {
	constructor(public name: string, public count: number) { }
}

class DaySale {
	constructor(public date: string, public count: number, public profit: number) { }
}

class DayExchange {
	constructor(public date: string, public exchange: number) { }
}

class OrderStatus {
	constructor(public status: string, public count: number) { }
}

class Legend {
	constructor(public color: string, public label: string) { }
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
    summary: Summary = new Summary(0, 0, 0, 0, '', '', '', 0, '', '', '', 0, 0, 0 , '');
	topSaleProducts = [].ToList<TopProduct>();
	topSaleBrands = [].ToList<TopBrand>();
	past30DaysProfit = [].ToList<DaySale>();
	past30DaysExchange = [].ToList<DayExchange>();

	costList = [].ToList<number>();
	incomeList = [].ToList<number>();
	profitList = [].ToList<number>();
	orderCountList = [].ToList<number>();

	orderStates = (new Dict()).orderStates;
	orderStatusSummary: OrderStatus[] = [];

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
		scaleLineColor: "rgba(0,0,0,0.3)",
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

	private topSaleProductsChartOptions = {
		responsive: true,
		multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
		showScale: false,
		showTooltips: false,
		barShowStroke: true,
		barStrokeWidth: 1
	};

	private topSaleProductsChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	private topSaleProductsChartSeries = ['A'];
	public topSaleProductsChartType = 'Bar';
	private topSaleProductsChartLegend: boolean = false;

	private topSaleProductsChartData = []
	private topSaleProductsChartNames = [];
	selectedTopProductIndex = 0;
	selectedTopProductName = '';
	selectedTopProductCount = 0;
	firstTopProductName = '';

	private topSaleProductsChartColours: Array<any> = [
		{
			fillColor: 'rgba(244,180,0,0.3)',
			strokeColor: 'rgba(244,180,0,0.5)',
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
		bezierCurve: false,
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
			fillColor: 'rgba(16,150,24,0.3)',
			strokeColor: 'rgba(16,150,24,0.5)',
			pointColor: 'rgba(16,150,24,0.5)',
			pointStrokeColor: 'rgba(16,150,24,0.5)',
			pointHighlightFill: 'rgba(16,150,24,1)',
			pointHighlightStroke: 'rgba(16,150,24,1)'
		},
		{}
	];
	private pastDailyProfitChartLegend: boolean = false;
	private pastDailyProfitChartType: string = 'Line';

	// lineChart
	private pastDailyExchangeChartData: Array<any> = [[], []];
	private pastDailyExchangeChartLabels: Array<any> = [];
	private pastDailyExchangeChartSeries: Array<any> = ['汇率', '&nbsp;'];
	private pastDailyExchangeChartOptions: any = {
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
	private pastDailyExchangeChartColours: Array<any> = [
		{
			fillColor: 'rgba(0,153,204,0.3)',
			strokeColor: 'rgba(0,153,204,0.5)',
			pointColor: 'rgba(0,153,204,0.5)',
			pointStrokeColor: 'rgba(0,153,204,0.5)',
			pointHighlightFill: 'rgba(0,153,204,1)',
			pointHighlightStroke: 'rgba(0,153,204,1)'
		},
		{}
	];
	private pastDailyExchangeChartLegend: boolean = false;
	private pastDailyExchangeChartType: string = 'Line';

	private topSaleBrandsChartOptions: any = {

		// Tooltip
		tooltipFillColor: "#fff",
		tooltipFontColor: "#777",
		tooltipFontSize: 12,
		tooltipFontFamily: "'Roboto', sans-serif"

	};

	private topSaleBrandsChartLabels = [];
	private topSaleBrandsChartData = [];
	private topSaleBrandsChartColours: Array<any> = [
		{
			color: "rgba(151,187,205,0.8)",
			highlight: "rgba(151,187,205,1)",
		},
		{
			color: "rgba(220,220,220,0.8)",
			highlight: "rgba(220,220,220,1)",
		},
		{
			color: "rgba(247,70,74,0.8)",
			highlight: "rgba(247,70,74,1)",
		},
		{
			color: "rgba(70,191,189,0.8)",
			highlight: "rgba(70,191,189,1)",
		},
		{
			color: "rgba(253,180,92,0.8)",
			highlight: "rgba(253,180,92,1)",
		},
		{
			color: "rgba(148,159,177,0.8)",
			highlight: "rgba(148,159,177,1)",
		},
		{
			color: "rgba(77,83,96,0.8)",
			highlight: "rgba(77,83,96,1)",
		},
		{
			color: "rgba(164,10,134,0.8)",
			highlight: "rgba(164,10,134,1)",
		},
		{
			color: "rgba(195,26,105,0.8)",
			highlight: "rgba(195,26,105,1)",
		},
		{
			color: "rgba(33,137,228,0.8)",
			highlight: "rgba(33,137,228,1)",
		}
	];
	private topSaleBrandsChartLegend: boolean = false;
	private topSaleBrandsChartCustomLegend = [];
	private topSaleBrandsChartType = 'Doughnut';

    constructor(private service: ApiService) { }

    ngOnInit() {
		var that = this;

        this.service.getDashboardSummary(json => {
			if (json) {
				that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount,
					json.totalCost, json.totalIncome, json.totalProfit, json.unpaidCount, json.unpaidAmount,
					json.todayProfit, json.profitIncrementRate, json.profitIncrement, json.todayExchange,
					json.exchangeIncrement, json.exchangeIncrementRate);
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

		this.service.getDashboardTopSaleProducts(json => {
			if (json) {
				json.forEach(x => {
					that.topSaleProducts.Add(new TopProduct(x.productName, x.count));
				});

				that.topSaleProductsChartData = [that.topSaleProducts.Select(s => s.count).ToArray()];
				that.topSaleProductsChartNames = that.topSaleProducts.Select(s => s.name).ToArray();

				if (that.topSaleProducts.Count() > 0) {
					that.selectedTopProductIndex = 1;
					that.selectedTopProductName = this.topSaleProductsChartNames[0];
					that.firstTopProductName = this.topSaleProductsChartNames[0];
					that.selectedTopProductCount = this.topSaleProductsChartData[0][0];
				}
			}
		});

		this.service.getDashboardTopSaleBrands(json => {
			if (json) {
				json.forEach(x => {
					that.topSaleBrands.Add(new TopBrand(x.brandName, x.count));
				});

				that.topSaleBrandsChartData = that.topSaleBrands.Select(s => s.count).ToArray();
				that.topSaleBrandsChartLabels = that.topSaleBrands.Select(s => s.name).ToArray();

				for (var i = 0; i < that.topSaleBrands.Count(); i++) {
					that.topSaleBrandsChartCustomLegend.push(new Legend(that.topSaleBrandsChartColours[i].color,
						that.topSaleBrandsChartLabels[i] + ': ' + that.topSaleBrandsChartData[i]));
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

		this.service.getDashboardPast30DaysExchange(json => {
			if (json) {
				json.forEach(x => {
					that.past30DaysExchange.Add(new DayExchange(x.date, x.exchange));
				});

				that.pastDailyExchangeChartLabels = that.past30DaysExchange.Select(p => p.date).ToArray();
				that.pastDailyExchangeChartData = [that.past30DaysExchange.Select(p => p.exchange).ToArray(), []];
			}
		});

		this.service.getDashboardOrderStatus(json => {
			if (json) {
				json.forEach(x => {
					that.orderStatusSummary.push(new OrderStatus(that.orderStates[x.status], x.count));
				});

			}
		});
    }

	onSwapAnnualSalesDateSource(flag: boolean) {
		if (this.annualSalesChartSwitch == flag) return;

		this.annualSalesChartSwitch = flag;
		this.changeAnnualSalesChartData();
	}

	ontopSaleProductsChartSelected(e) {
		this.selectedTopProductIndex = parseInt(e.activeLabel, 10) + 1;
		this.selectedTopProductName = this.topSaleProductsChartNames[e.activeLabel];
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