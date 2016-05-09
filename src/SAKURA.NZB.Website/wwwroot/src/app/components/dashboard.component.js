System.register(["angular2/core", 'angular2/common', "./api.service", "./orders/models", 'ng2-bootstrap/ng2-bootstrap', 'ng2-charts/ng2-charts'], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1, models_1, ng2_bootstrap_1, ng2_charts_1;
    var Summary, TopProduct, TopBrand, DaySale, DayExchange, OrderStatus, Legend, DashboardComponent;
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
            function (models_1_1) {
                models_1 = models_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (ng2_charts_1_1) {
                ng2_charts_1 = ng2_charts_1_1;
            }],
        execute: function() {
            Summary = (function () {
                function Summary(customerCount, brandCount, productCount, orderCount, totalCost, totalIncome, totalProfit, unpaidCount, unpaidAmount, todayProfit, profitIncrementRate, profitIncrement, todayExchange, exchangeIncrement, exchangeIncrementRate) {
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
                    this.todayExchange = todayExchange;
                    this.exchangeIncrement = exchangeIncrement;
                    this.exchangeIncrementRate = exchangeIncrementRate;
                }
                return Summary;
            }());
            TopProduct = (function () {
                function TopProduct(name, count) {
                    this.name = name;
                    this.count = count;
                }
                return TopProduct;
            }());
            TopBrand = (function () {
                function TopBrand(name, count) {
                    this.name = name;
                    this.count = count;
                }
                return TopBrand;
            }());
            DaySale = (function () {
                function DaySale(date, count, profit) {
                    this.date = date;
                    this.count = count;
                    this.profit = profit;
                }
                return DaySale;
            }());
            DayExchange = (function () {
                function DayExchange(date, exchange) {
                    this.date = date;
                    this.exchange = exchange;
                }
                return DayExchange;
            }());
            OrderStatus = (function () {
                function OrderStatus(status, count) {
                    this.status = status;
                    this.count = count;
                }
                return OrderStatus;
            }());
            Legend = (function () {
                function Legend(color, label) {
                    this.color = color;
                    this.label = label;
                }
                return Legend;
            }());
            DashboardComponent = (function () {
                function DashboardComponent(service) {
                    this.service = service;
                    this.summary = new Summary(0, 0, 0, 0, '', '', '', 0, '', '', '', 0, 0, 0, '');
                    this.topSaleProducts = [].ToList();
                    this.topSaleBrands = [].ToList();
                    this.past30DaysProfit = [].ToList();
                    this.past30DaysExchange = [].ToList();
                    this.costList = [].ToList();
                    this.incomeList = [].ToList();
                    this.profitList = [].ToList();
                    this.orderCountList = [].ToList();
                    this.orderStates = (new models_1.Dict()).orderStates;
                    this.orderStatusSummary = [];
                    this.annualSalesChartSwitch = false;
                    // lineChart
                    this.annualSalesChartData = [[], [], []];
                    this.annualSalesChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    this.annualSalesChartSeries = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
                    this.annualSalesChartOptions = {
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
                    this.annualSalesChartColours = [
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
                    this.annualSalesChartLegend = false;
                    this.annualSalesChartType = 'Line';
                    this.topSaleProductsChartOptions = {
                        responsive: true,
                        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
                        showScale: false,
                        showTooltips: false,
                        barShowStroke: true,
                        barStrokeWidth: 1
                    };
                    this.topSaleProductsChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    this.topSaleProductsChartSeries = ['A'];
                    this.topSaleProductsChartType = 'Bar';
                    this.topSaleProductsChartLegend = false;
                    this.topSaleProductsChartData = [];
                    this.topSaleProductsChartNames = [];
                    this.selectedTopProductIndex = 0;
                    this.selectedTopProductName = '';
                    this.selectedTopProductCount = 0;
                    this.firstTopProductName = '';
                    this.topSaleProductsChartColours = [
                        {
                            fillColor: 'rgba(244,180,0,0.3)',
                            strokeColor: 'rgba(244,180,0,0.5)',
                            highlightFill: 'rgba(76,195,217,1)',
                            highlightStroke: 'rgba(76,195,217,1)'
                        }
                    ];
                    // lineChart
                    this.pastDailyProfitChartData = [[], []];
                    this.pastDailyProfitChartLabels = [];
                    this.pastDailyProfitChartSeries = ['利润', '&nbsp;'];
                    this.pastDailyProfitChartOptions = {
                        responsive: true,
                        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>',
                        pointDotRadius: 2,
                        maintainAspectRatio: false,
                        datasetStrokeWidth: 1,
                        showScale: false,
                        pointDot: false,
                        bezierCurve: true,
                        // Tooltip
                        tooltipFillColor: "#fff",
                        tooltipTitleFontColor: "#777",
                        tooltipTitleFontSize: 14,
                        tooltipTitleFontFamily: "'Roboto', sans-serif",
                        tooltipFontColor: "#777",
                        tooltipFontSize: 12,
                        tooltipFontFamily: "'Roboto', sans-serif"
                    };
                    this.pastDailyProfitChartColours = [
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
                    this.pastDailyProfitChartLegend = false;
                    this.pastDailyProfitChartType = 'Line';
                    // lineChart
                    this.pastDailyExchangeChartData = [[], []];
                    this.pastDailyExchangeChartLabels = [];
                    this.pastDailyExchangeChartSeries = ['汇率', '&nbsp;'];
                    this.pastDailyExchangeChartOptions = {
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
                    this.pastDailyExchangeChartColours = [
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
                    this.pastDailyExchangeChartLegend = false;
                    this.pastDailyExchangeChartType = 'Line';
                    this.topSaleBrandsChartOptions = {
                        // Tooltip
                        tooltipFillColor: "#fff",
                        tooltipFontColor: "#777",
                        tooltipFontSize: 12,
                        tooltipFontFamily: "'Roboto', sans-serif"
                    };
                    this.topSaleBrandsChartLabels = [];
                    this.topSaleBrandsChartData = [];
                    this.topSaleBrandsChartColours = [
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
                    this.topSaleBrandsChartLegend = false;
                    this.topSaleBrandsChartCustomLegend = [];
                    this.topSaleBrandsChartType = 'Doughnut';
                }
                DashboardComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var that = this;
                    this.service.getDashboardSummary(function (json) {
                        if (json) {
                            that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount, json.totalCost, json.totalIncome, json.totalProfit, json.unpaidCount, json.unpaidAmount, json.todayProfit, json.profitIncrementRate, json.profitIncrement, json.todayExchange, json.exchangeIncrement, json.exchangeIncrementRate);
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
                            that.changeAnnualSalesChartData();
                        }
                    });
                    this.service.getDashboardTopSaleProducts(function (json) {
                        if (json) {
                            json.forEach(function (x) {
                                that.topSaleProducts.Add(new TopProduct(x.productName, x.count));
                            });
                            that.topSaleProductsChartData = [that.topSaleProducts.Select(function (s) { return s.count; }).ToArray()];
                            that.topSaleProductsChartNames = that.topSaleProducts.Select(function (s) { return s.name; }).ToArray();
                            if (that.topSaleProducts.Count() > 0) {
                                that.selectedTopProductIndex = 1;
                                that.selectedTopProductName = _this.topSaleProductsChartNames[0];
                                that.firstTopProductName = _this.topSaleProductsChartNames[0];
                                that.selectedTopProductCount = _this.topSaleProductsChartData[0][0];
                            }
                        }
                    });
                    this.service.getDashboardTopSaleBrands(function (json) {
                        if (json) {
                            json.forEach(function (x) {
                                that.topSaleBrands.Add(new TopBrand(x.brandName, x.count));
                            });
                            that.topSaleBrandsChartData = that.topSaleBrands.Select(function (s) { return s.count; }).ToArray();
                            that.topSaleBrandsChartLabels = that.topSaleBrands.Select(function (s) { return s.name; }).ToArray();
                            for (var i = 0; i < that.topSaleBrands.Count(); i++) {
                                that.topSaleBrandsChartCustomLegend.push(new Legend(that.topSaleBrandsChartColours[i].color, that.topSaleBrandsChartLabels[i] + ': ' + that.topSaleBrandsChartData[i]));
                            }
                        }
                    });
                    this.service.getDashboardPast30DaysProfit(function (json) {
                        if (json) {
                            json.forEach(function (x) {
                                that.past30DaysProfit.Add(new DaySale(x.date, x.orderCount, x.profit));
                            });
                            that.pastDailyProfitChartLabels = that.past30DaysProfit.Select(function (p) { return p.date; }).ToArray();
                            that.pastDailyProfitChartData = [that.past30DaysProfit.Select(function (p) { return p.profit; }).ToArray(), []];
                        }
                    });
                    this.service.getDashboardPast30DaysExchange(function (json) {
                        if (json) {
                            json.forEach(function (x) {
                                that.past30DaysExchange.Add(new DayExchange(x.date, x.exchange));
                            });
                            that.pastDailyExchangeChartLabels = that.past30DaysExchange.Select(function (p) { return p.date; }).ToArray();
                            that.pastDailyExchangeChartData = [that.past30DaysExchange.Select(function (p) { return p.exchange; }).ToArray(), []];
                        }
                    });
                    this.service.getDashboardOrderStatus(function (json) {
                        if (json) {
                            json.forEach(function (x) {
                                that.orderStatusSummary.push(new OrderStatus(that.orderStates[x.status], x.count));
                            });
                        }
                    });
                };
                DashboardComponent.prototype.onSwapAnnualSalesDateSource = function (flag) {
                    if (this.annualSalesChartSwitch == flag)
                        return;
                    this.annualSalesChartSwitch = flag;
                    this.changeAnnualSalesChartData();
                };
                DashboardComponent.prototype.ontopSaleProductsChartSelected = function (e) {
                    this.selectedTopProductIndex = parseInt(e.activeLabel, 10) + 1;
                    this.selectedTopProductName = this.topSaleProductsChartNames[e.activeLabel];
                    this.selectedTopProductCount = e.activePoints[0].value;
                };
                DashboardComponent.prototype.changeAnnualSalesChartData = function () {
                    if (!this.annualSalesChartSwitch) {
                        this.annualSalesChartData = [this.costList.ToArray(), this.incomeList.ToArray(), this.profitList.ToArray()];
                        this.annualSalesChartSeries = ['成本 (NZD)', '收入 (CNY)', '利润 (CNY)'];
                    }
                    else {
                        this.annualSalesChartData = [this.orderCountList.ToArray(), [], []];
                        this.annualSalesChartSeries = ['订单数量', '&nbsp;', '&nbsp;'];
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