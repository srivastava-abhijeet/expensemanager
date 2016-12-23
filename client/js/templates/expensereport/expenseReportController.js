(function() {


    var expenseReportController = function($rootScope, $scope, $http, uiGridConstants) {


//********************************************* Setting up global variables *********************************************//


        $scope.expenseList = [];
        $scope.chartDataSource = [];
        $scope.selectedDateRange = '';
        $scope.selectedCategoryList = '';

        $scope.categoryList = {
            'House Rent': 'House Rent',
            'Electricity Bill': 'Electricity Bill',
            'PG&E': 'PG&E',
            'Utility': 'Utility',
            'Car Gas': 'Car Gas',
            'Car Wash': 'Car Wash',
            'Grocery': 'Grocery',
            'Laundry': 'Laundry',
            'Outside Eating': 'Outside Eating',
            'Misc': 'Misc'
        };

//********************************************* Add date range picker functionality *********************************************//

        $('input[name="daterange"]').daterangepicker();



//********************************************* Render checkbox in each select options **************************************************//

        var mySelect = $('#catSelect');

        $.each($scope.categoryList, function(val, text) {
            mySelect.append(
                $('<option></option>').val(val).html(text)
            );
        });

        mySelect.multiselect({

            includeSelectAllOption: true
        });

//********************************************* Service call to get expenseList **************************************************//

        $scope.getExpenseReport = function(){


            console.log("selected Date Range: "+ $scope.selectedDateRange);
            console.log("selected Category: "+ $scope.selectedCategoryList);

            var dateRange = $scope.selectedDateRange.split("-");

            var startDate = new Date(dateRange[0].trim()).toISOString();
            var endDate = new Date(dateRange[1].trim()).toISOString();

            $http({
                method: 'POST',
                url: '/getExpenseList',
                data: {startDate: startDate, endDate: endDate, selectedCategoryList: $scope.selectedCategoryList}
            }).
            then(function(response) {

                // alert(JSON.stringify(response.data));

                $scope.gridOptions.data = $scope.expenseList = response.data;
                $scope.populateChartDataSource();

            }, function(error) {
                alert("Server error!!");
            });

        };



//********************************************* Populate ui-grid **************************************************//

        $scope.gridOptions = {
            showColumnFooter: true,
            enableFiltering: true,
            columnDefs: [
                { field: 'date' , type: 'date', cellFilter: 'date:\'MM/dd/yyyy\'' },
                { field: 'category'},
                { field: 'amount', aggregationType: uiGridConstants.aggregationTypes.sum,
                     footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: saddlebrown;color: White">Total: {{col.getAggregationValue()}}</div>'},
                { field: 'note'}
            ]
        };

//********************************************* Populate chart **************************************************//


        $scope.populateChartDataSource = function(){


            $scope.chartDataSource = [];

            $scope.expenseList.forEach( function (expense)
            {

                $scope.chartDataSource.push(
                                            { key: expense.category,
                                              y: expense.amount

                                            });
            });

        };

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                // duration: 500,
                // transitionDuration: 500,
                // labelThreshold: 0.01,
                labelType: "key",
                // labelSunbeamLayout: true,
                showLegend: "true",
                legendPosition: 'top',
                legend: {
                    margin: {
                        "top": 5,
                        "right": 5,
                        "bottom": 5,
                        "left": 5
                    }
                }
            }
        };


        $scope.populateChartDataSource();

    };




//****************************** Register expenseReportController with the module itemCheckerModule *****************************//


    var app = angular.module("itemCheckerModule");
    app.controller("expenseReportController", expenseReportController);


}());
