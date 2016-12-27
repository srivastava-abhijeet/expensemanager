/**
 * Created by asriv10 on 12/25/16.
 */
(function() {


    var ngConfirmClick = function() {

        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };

    };

    var app = angular.module("itemCheckerModule");
    app.directive("ngConfirmClick", ngConfirmClick);


}());
