﻿import {Component, OnInit, ViewEncapsulation} from "angular2/core";
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

	costList = [].ToList<number>();
	incomeList = [].ToList<number>();
	profitList = [].ToList<number>();
	orderCountList = [].ToList<number>();

	lineChartSwitch = false;

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
	private lineChartLegend: boolean = false;
	private lineChartType: string = 'Line';

	private barChartOptions = {
		responsive: true,
		multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
		showScale: false,
		showTooltips: false,
		barShowStroke: false,
	};

	private barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	private barChartSeries = ['A'];
	public barChartType = 'Bar';
	private barChartLegend: boolean = false;

	private barChartData = [
		[65, 59, 46, 35, 23, 16, 12, 8, 6, 3]
	];

	private barChartNames = [
		'Royal Nectar 皇家花蜜蜂毒眼霜紧实抗皱提拉紧致 15ml',
		'Royal Nectar 新西兰进口皇家蜂毒面膜50ml',
		'Trilogy 洁面200ml',
		'Kiwigarden 酸奶小溶豆 (香蕉)',
		'GROVE 特级初榨牛油果婴幼儿辅食孕妇必备 250m',
		'Antipodes KiwiSeed 奇异果籽精华眼霜30ml',
		'Trilogy 面霜60g',
		'Kiwigarden 酸奶小溶豆 (混合莓子)',
		'Kiwigarden 酸奶小溶豆 (猕猴桃)',
		'Kiwigarden 酸奶小溶豆 (草莓)'
	];
	selectedTopProductIndex = 1;
	selectedTopProductName = this.barChartNames[0];
	selectedTopProductCount = this.barChartData[0][0];

	private barChartColours: Array<any> = [
		{
			fillColor: 'rgba(84,84,84,0.3)',
			strokeColor: 'rgba(84,84,84,0.3)',
			highlightFill: 'rgba(76,195,217,1)',
			highlightStroke: 'rgba(76,195,217,1)'
		}
	];

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

				that.changeLineChartData();
			}
		});
    }

	onSwapType(flag: boolean) {
		if (this.lineChartSwitch == flag) return;

		this.lineChartSwitch = flag;
		this.changeLineChartData();
	}

	onBarChartSelected(e) {
		this.selectedTopProductIndex = parseInt(e.activeLabel, 10) + 1;
		this.selectedTopProductName = this.barChartNames[e.activeLabel];
		this.selectedTopProductCount = e.activePoints[0].value;
	}

	changeLineChartData() {
		if (!this.lineChartSwitch) {
			this.lineChartData = [this.costList.ToArray(), this.incomeList.ToArray(), this.profitList.ToArray()];
			this.lineChartSeries = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
		} else {
			this.lineChartData = [this.orderCountList.ToArray(), [], []];
			this.lineChartSeries = ['订单数量', '&nbsp;', '&nbsp;'];
		}
	}
}