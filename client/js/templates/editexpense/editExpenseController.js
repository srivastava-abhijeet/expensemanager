(function() {


    var editExpenseController = function($rootScope, $scope, $http) {


//********************************************* Setting up global variables *********************************************//


        $scope.expenseListToEdit = [];
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

        $scope.categoryListForRows = [{value: 'House Rent',title:'House Rent'},{value: 'Electricity Bill',title:'Electricity Bill'},{value: 'PG&E',title:'PG&E'},
            {value: 'Utility',title:'Utility'},{value: 'Car Gas',title:'Car Gas'},{value: 'Car Wash',title:'Car Wash'},{value: 'Grocery',title:'Grocery'},
            {value: 'Laundry',title:'Laundry'},{value: 'Outside Eating',title:'Outside Eating'},{value: 'Misc',title:'Misc'}];


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


//********************************************* Service call to get expenseList to edit **************************************************//

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

                for(var i=0;i<response.data.length;i++){

                    var obj = response.data[i];
                    obj.date = new Date(obj.date);
                }

                $scope.expenseListToEdit = response.data;


            }, function(error) {
                alert("Server error!!");
            });

        };



// Method called on 'save' click to update the changes in DB

$scope.save = function(){

    console.log("expenseListToEdit: "+ JSON.stringify($scope.expenseListToEdit));

    $http({
        method: 'POST',
        url: '/editExpenseList',
        data: $scope.expenseListToEdit
    }).
    then(function(response) {

        var serverResponse = response.data;

        if(serverResponse.error){
            alert("DB error occurred while editing the expense(s)");
        }
        else{
            alert('expense(s) edited to DB successfully');
        }

    }, function(error) {
        alert("Server error while editing expenses");
    });
};

//********************************************* Delete expenses  **************************************************//


        $scope.deleteExpenseRow = function(list,index){

            list.splice(index, 1);
            console.log("Inside Delete method");

        };
    };

    var app = angular.module("itemCheckerModule");
    app.controller("editExpenseController", editExpenseController);


}());
