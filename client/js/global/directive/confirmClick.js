/**
 * Created by asriv10 on 12/25/16.
 */
(function() {


    var confirmClick = function(dialogModal) {

        return {
            link: function (scope, element, attrs) {
                // ngClick won't wait for our modal confirmation window to resolve,
                // so we will grab the other values in the ngClick attribute, which
                // will continue after the modal resolves.
                // modify the confirmClick() action so we don't perform it again
                // looks for either confirmClick() or confirmClick('are you sure?')
                var ngClick = attrs.ngClick.replace('confirmClick()', 'true')
                    .replace('confirmClick(', 'confirmClick(true,');

                // setup a confirmation action on the scope
                scope.confirmClick = function(msg) {
                    // if the msg was set to true, then return it (this is a workaround to make our dialog work)
                    if (msg===true) {
                        return true;
                    }
                    // msg can be passed directly to confirmClick('are you sure?') in ng-click
                    // or through the confirm-click attribute on the <a confirm-click="Are you sure?"></a>
                    msg = msg || attrs.confirmClick || 'Are you sure?';
                    // open a dialog modal, and then continue ngClick actions if it's confirmed
                    dialogModal(msg).result.then(function() {
                        scope.$eval(ngClick);
                    });
                    // return false to stop the current ng-click flow and wait for our modal answer
                    return false;
                };
            }
        };

    };

    var app = angular.module("itemCheckerModule");
    app.directive("confirmClick", confirmClick);


}());
