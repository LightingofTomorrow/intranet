'use strict';app.controller('FeedbackController', ['$mdDialog', '$cookies', '$timeout', '$routeParams', '$scope', '$rootScope', '$location', 'REST','Toaster','$httpParamSerializer','Top',
    function($mdDialog, $cookies, $timeout, $routeParams, $scope, $rootScope, $location, REST, Toaster,$httpParamSerializer,Top) {
    	
        /*Type - Pages*/
        $rootScope.query.order = "created_at";

    	$scope.list = function(){
		    REST.GET('list-feedback?'+$httpParamSerializer($rootScope.query)).then(function(response){
		    	$scope.data = response.output;
                Top.Scroll();
		    });
    	};

    	$scope.list();

    	$scope.remove = function(_id, ev){
    		var confirm = $mdDialog.confirm()
		          .title('Would you really like to delete this record?')
		          .ariaLabel('Delete Record')
		          .targetEvent(ev)
		          .ok('Yes!')
		          .cancel('No');

		    $mdDialog.show(confirm).then(function() {
		      REST.DELETE("delete-feedback?post="+_id).then(function(response){
	    			if(response.success){
	    				$scope.list();
	    			}
	    			Toaster.simple(response.message,response.success);
	    		});
		    });
    	};

    	$scope.quickAction = function(type, ev){
    		if(!$scope.selected.length){
    			Toaster.simple("Please choose some records first.", false);
    			return;
    		}

            var confirm = $mdDialog.confirm()
                  .title('Would you really want to perform this action on selected row(s)?')
                  .ariaLabel('Quick Action')
                  .targetEvent(ev)
                  .ok('Yes!')
                  .cancel('No');

            $mdDialog.show(confirm).then(function() {
                REST.POST('quick-feedback-action',{type:type, on:$scope.selected}).then(function(response){
                    Toaster.simple(response.message, response.success);
                    if(response.success){
                        $scope.list();
                        $rootScope.selected = [];
                    }
                });
            });
    	};

        if($routeParams.id){
            REST.GET('get-feedback?id='+$routeParams.id).then(function(response){
                $scope.feedback = response.output;
            });
        }
    }

]);