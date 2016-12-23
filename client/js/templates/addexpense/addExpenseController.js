(function() {


    var addExpenseController = function($rootScope, $scope, $http) {

        // populate the datepicker component on initial load.

        $scope.intializeDate = function(){

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd
            }

            if(mm<10) {
                mm='0'+mm
            }

            return mm+'/'+dd+'/'+yyyy;

        };

        // List to populate in the category component

        $scope.categoryList = [{value: 'House Rent',title:'House Rent'},{value: 'Electricity Bill',title:'Electricity Bill'},{value: 'PG&E',title:'PG&E'},
            {value: 'Utility',title:'Utility'},{value: 'Car Gas',title:'Car Gas'},{value: 'Car Wash',title:'Car Wash'},{value: 'Grocery',title:'Grocery'},
            {value: 'Laundry',title:'Laundry'},{value: 'Outside Eating',title:'Outside Eating'},{value: 'Misc',title:'Misc'}];


        // Initialize expenseListToAdd

        $scope.expenseListToAdd = new Array({
            date: new Date(),
            category: '',
            amount: 0,
            note: ''
        });


        // Method called on '+' click to add an expense row

        $scope.addExpenseRow = function(list){

            list.push({
                date: new Date(),
                category: '',
                amount: 0,
                note: ''
            });
        };


        // Method called on '-' click to delete an expense row

        $scope.deleteExpenseRow = function(list,index){

            list.splice(index, 1);
            console.log("Inside Delete method");

        };


        // Method called on 'save' click to send expenseListToAdd to the server

        $scope.save = function(){

            console.log("expenseListToAdd: "+ JSON.stringify($scope.expenseListToAdd));

            $http({
                method: 'POST',
                url: '/addExpenseList',
                data: $scope.expenseListToAdd
            }).
            then(function(response) {

                 var serverResponse = response.data;

                 if(serverResponse.error){
                     alert("DB error occurred while adding expense");
                 }
                 else{
                     alert('expense(s) added to DB successfully');
                 }

            }, function(error) {
                alert("Server error while adding expenses");
            });
        };

    };

    var app = angular.module("itemCheckerModule");
    app.controller("addExpenseController", addExpenseController);


}());
