app.controller('outgoingOperationCreateUpdateCtrl',
    ['OperationTypeService', 'CompanyService', 'RegionService', 'BranchService', 'DepartmentService', 'PersonService', 'OperationService', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'title', 'action', 'idType', 'operation',
        function (OperationTypeService, CompanyService, RegionService, BranchService, DepartmentService, PersonService, OperationService, $scope, $rootScope, $timeout, $log, $uibModalInstance, title, action, idType, operation) {

            $timeout(function () {
                CompanyService.findAll().then(function (data) {
                    $scope.companies = data;
                    RegionService.findAll().then(function (data) {
                        $scope.regions = data;
                        BranchService.findAll().then(function (data) {
                            $scope.branches = data;
                            DepartmentService.findAll().then(function (data) {
                                $scope.departments = data;
                                PersonService.findPersons().then(function (data) {
                                    $scope.persons = data;
                                    PersonService.findContacts().then(function (data) {
                                        $scope.contacts = data;
                                    });
                                });
                            })
                        })
                    });
                });

                OperationTypeService.findAll().then(function (data) {
                    $scope.operationTypes = data;
                });

            }, 1500);

            if (operation) {
                $scope.operation = operation;
            } else {
                $scope.operation = {};
            }

            $scope.title = title;

            $scope.action = action;

            $scope.operation.fromType = idType;

            switch ($scope.operation.fromType) {
                case 'Branch':
                    BranchService.fetchTableData().then(function (data) {
                        $scope.myBranches = data;
                    });
                    break;
            }

            $scope.submit = function () {
                $rootScope.showNotify("المعاملات", "جاري القيام بالعملية، فضلاً انتظر قليلاً", "warning", "fa-exchange");
                switch ($scope.action) {
                    case 'create' :
                        $scope.operation.fromId = $scope.operation.fromId.id;
                        $scope.operation.toId = $scope.operation.toId.id;
                        $scope.operation.structure = 'Outgoing';
                        OperationService.create($scope.operation).then(function (data) {
                            $rootScope.showNotify("المعاملات", "تم القيام بالعملية بنجاح، يمكنك اضافة معاملة آخرى الآن", "success", "fa-exchange");
                            $scope.operation = {};
                            $scope.operation.fromType = idType;
                            $rootScope.showNotify("المعاملات", "جاري رفع الملفات، فضلاً انتظر قليلاً", "warning", "fa-exchange");
                            angular.forEach($scope.files, function (file) {
                                OperationService.createOperationAttach(data.id, file).then(function (data) {
                                    return data ? file.isSuccess = true : file.isError = true;
                                });
                            });
                            $scope.form.$setPristine();
                        });
                        break;
                    case 'update' :
                        OperationService.update($scope.operation).then(function (data) {
                            $scope.operation = data;
                            $rootScope.showNotify("المعاملات", "تم القيام بالعملية بنجاح، يمكنك متابعة عملك الآن", "success", "fa-exchange");
                        });
                        break;
                }
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);