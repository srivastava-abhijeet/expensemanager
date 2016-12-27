(function() {

    var app = angular.module("itemCheckerModule", ['ngRoute', 'angular-loading-bar','ngCookies','ui.grid','ui.grid.autoResize',
        'nvd3','ui.bootstrap']);

    app.config(function($routeProvider) {

        $routeProvider
            .when("/login", {

                templateUrl: "js/templates/login/login.html",
                controller: "LoginController"
            })

            .when("/main", {

                templateUrl: "js/templates/main/main.html",
                controller: "MainController"
            })

            .when("/addexpense", {

                templateUrl: "js/templates/addexpense/addExpense.html",
                controller: "addExpenseController"
            })
            .when("/editexpense", {

                templateUrl: "js/templates/editexpense/editExpense.html",
                controller: "editExpenseController"
            })
            .when("/expensereport", {

                templateUrl: "js/templates/expensereport/expenseReport.html",
                controller: "expenseReportController"
            })

            .otherwise({
                redirectTo: "/login"
            });

    });

    app.run(function ($rootScope, $location, $cookieStore, $http) {
          // keep user logged in after page refresh
          var tempGlobals = $cookieStore.get('globals');
          $rootScope.globals = tempGlobals || {};
          // if ($rootScope.globals.currentUser) {
          //     $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
          // }

          $rootScope.$on('$locationChangeStart', function (event, next, current) {
              // redirect to login page if not logged in
              if($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                  $location.path('/login');
              }

              if($location.path() == '/login' || $location.path() == '/main'){
                  $rootScope.showHomeIcon = false;
              }
              else{
                  $rootScope.showHomeIcon = true;
              }

            });
      });

}());
