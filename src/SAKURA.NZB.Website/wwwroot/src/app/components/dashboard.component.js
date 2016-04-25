System.register(["angular2/core", 'angular2/common', "./api.service", 'ng2-charts/ng2-charts'], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1, ng2_charts_1;
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
            function (ng2_charts_1_1) {
                ng2_charts_1 = ng2_charts_1_1;
            }],
        execute: function() {
            Summary = (function () {
                function Summary(customerCount, brandCount, productCount, orderCount) {
                    this.customerCount = customerCount;
                    this.brandCount = brandCount;
                    this.productCount = productCount;
                    this.orderCount = orderCount;
                }
                return Summary;
            }());
            DashboardComponent = (function () {
                function DashboardComponent(service) {
                    this.service = service;
                    this.summary = new Summary(0, 0, 0, 0);
                    // lineChart
                    this.lineChartData = [[], [], []];
                    this.lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    this.lineChartSeries = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
                    this.lineChartOptions = {
                        animation: false,
                        responsive: true,
                        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
                        pointDotRadius: 6,
                        scaleOverride: true,
                        // ** Required if scaleOverride is true **
                        // Number - The number of steps in a hard coded scale
                        scaleSteps: 10,
                        // Number - The value jump in the hard coded scale
                        scaleStepWidth: 500,
                        // Number - The scale starting value
                        scaleStartValue: 0,
                        maintainAspectRatio: false,
                    };
                    this.lineChartColours = [
                        {
                            fillColor: 'rgba(148,159,177,0.2)',
                            strokeColor: 'rgba(148,159,177,1)',
                            pointColor: 'rgba(148,159,177,1)',
                            pointStrokeColor: '#fff',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(148,159,177,0.8)'
                        },
                        {
                            fillColor: 'rgba(77,83,96,0.2)',
                            strokeColor: 'rgba(77,83,96,1)',
                            pointColor: 'rgba(77,83,96,1)',
                            pointStrokeColor: '#fff',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(77,83,96,1)'
                        },
                        {
                            fillColor: 'rgba(148,159,177,0.2)',
                            strokeColor: 'rgba(148,159,177,1)',
                            pointColor: 'rgba(148,159,177,1)',
                            pointStrokeColor: '#fff',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(148,159,177,0.8)'
                        }
                    ];
                    this.lineChartLegend = true;
                    this.lineChartType = 'Line';
                }
                DashboardComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var that = this;
                    this.service.getDashboardSummary(function (json) {
                        if (json) {
                            that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount);
                        }
                    });
                    this.service.getDashboardAnnualSales(function (json) {
                        if (json) {
                            var series = [].ToList();
                            var data1 = [].ToList();
                            var data2 = [].ToList();
                            var data3 = [].ToList();
                            json.forEach(function (x) {
                                series.Add(x.monthName);
                                data1.Add(x.cost);
                                data2.Add(x.income);
                                data3.Add(x.profit);
                            });
                            _this.lineChartData = [data1.ToArray(), data2.ToArray(), data3.ToArray()];
                        }
                    });
                };
                // events
                DashboardComponent.prototype.chartClicked = function (e) {
                    console.log(e);
                };
                DashboardComponent = __decorate([
                    core_1.Component({
                        selector: "dashboard",
                        templateUrl: "./src/app/components/dashboard.html",
                        styleUrls: ["./src/app/components/dashboard.css"],
                        providers: [api_service_1.ApiService],
                        directives: [ng2_charts_1.CHART_DIRECTIVES, common_1.NgClass, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
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