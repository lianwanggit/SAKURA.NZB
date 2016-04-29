System.register(["angular2/core", 'angular2/common', "./api.service", 'ng2-bootstrap/ng2-bootstrap', 'ng2-charts/ng2-charts'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, api_service_1, ng2_bootstrap_1, ng2_charts_1;
    var Summary, DashboardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (ng2_charts_1_1) {
                ng2_charts_1 = ng2_charts_1_1;
            }],
        execute: function() {
            Summary = (function () {
                function Summary(customerCount, brandCount, productCount, orderCount, totalCost, totalIncome, totalProfit, unpaidCount, unpaidAmount, todayProfit, profitIncrementRate, profitIncrement) {
                    this.customerCount = customerCount;
                    this.brandCount = brandCount;
                    this.productCount = productCount;
                    this.orderCount = orderCount;
                    this.totalCost = totalCost;
                    this.totalIncome = totalIncome;
                    this.totalProfit = totalProfit;
                    this.unpaidCount = unpaidCount;
                    this.unpaidAmount = unpaidAmount;
                    this.todayProfit = todayProfit;
                    this.profitIncrementRate = profitIncrementRate;
                    this.profitIncrement = profitIncrement;
                }
                return Summary;
            }());
            DashboardComponent = (function () {
                function DashboardComponent(service) {
                    this.service = service;
                    this.summary = new Summary(0, 0, 0, 0, '', '', '', 0, '', '', '', 0);
                    this.costList = [].ToList();
                    this.incomeList = [].ToList();
                    this.profitList = [].ToList();
                    this.orderCountList = [].ToList();
                    this.lineChartSwitch = false;
                    // lineChart
                    this.lineChartData = [[], [], []];
                    this.lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    this.lineChartSeries = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
                    this.lineChartOptions = {
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
                    this.lineChartColours = [
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
                    this.lineChartLegend = false;
                    this.lineChartType = 'Line';
                    this.barChartOptions = {
                        responsive: true,
                        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
                        showScale: false,
                        showTooltips: false,
                        barShowStroke: false,
                    };
                    this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    this.barChartSeries = ['A'];
                    this.barChartType = 'Bar';
                    this.barChartLegend = false;
                    this.barChartData = [
                        [65, 59, 46, 35, 23, 16, 12, 8, 6, 3]
                    ];
                    this.barChartNames = [
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
                    this.selectedTopProductIndex = 1;
                    this.selectedTopProductName = this.barChartNames[0];
                    this.selectedTopProductCount = this.barChartData[0][0];
                    this.barChartColours = [
                        {
                            fillColor: 'rgba(84,84,84,0.3)',
                            strokeColor: 'rgba(84,84,84,0.3)',
                            highlightFill: 'rgba(76,195,217,1)',
                            highlightStroke: 'rgba(76,195,217,1)'
                        }
                    ];
                    this.doughnutChartLabels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'a', 'b', 'c', 'd'];
                    this.doughnutChartData = [350, 450, 100, 210, 330, 450, 800];
                    this.doughnutChartType = 'Doughnut';
                }
                DashboardComponent.prototype.ngOnInit = function () {
                    var that = this;
                    this.service.getDashboardSummary(function (json) {
                        if (json) {
                            that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount, json.totalCost, json.totalIncome, json.totalProfit, json.unpaidCount, json.unpaidAmount, json.todayProfit, json.profitIncrementRate, json.profitIncrement);
                        }
                    });
                    this.service.getDashboardAnnualSales(function (json) {
                        if (json) {
                            json.forEach(function (x) {
                                that.costList.Add(x.cost);
                                that.incomeList.Add(x.income);
                                that.profitList.Add(x.profit);
                                that.orderCountList.Add(x.count);
                            });
                            that.changeLineChartData();
                        }
                    });
                };
                DashboardComponent.prototype.onSwapType = function (flag) {
                    if (this.lineChartSwitch == flag)
                        return;
                    this.lineChartSwitch = flag;
                    this.changeLineChartData();
                };
                DashboardComponent.prototype.onBarChartSelected = function (e) {
                    this.selectedTopProductIndex = parseInt(e.activeLabel, 10) + 1;
                    this.selectedTopProductName = this.barChartNames[e.activeLabel];
                    this.selectedTopProductCount = e.activePoints[0].value;
                };
                DashboardComponent.prototype.changeLineChartData = function () {
                    if (!this.lineChartSwitch) {
                        this.lineChartData = [this.costList.ToArray(), this.incomeList.ToArray(), this.profitList.ToArray()];
                        this.lineChartSeries = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
                    }
                    else {
                        this.lineChartData = [this.orderCountList.ToArray(), [], []];
                        this.lineChartSeries = ['订单数量', '&nbsp;', '&nbsp;'];
                    }
                };
                DashboardComponent = __decorate([
                    core_1.Component({
                        selector: "dashboard",
                        templateUrl: "./src/app/components/dashboard.html",
                        styleUrls: ["./src/app/components/dashboard.css"],
                        providers: [api_service_1.ApiService],
                        directives: [ng2_charts_1.CHART_DIRECTIVES, ng2_bootstrap_1.BUTTON_DIRECTIVES, common_1.NgClass, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES],
                        encapsulation: core_1.ViewEncapsulation.None
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], DashboardComponent);
                return DashboardComponent;
            }());
            exports_1("DashboardComponent", DashboardComponent);
        }
    }
});
//# sourceMappingURL=dashboard.component.js.map