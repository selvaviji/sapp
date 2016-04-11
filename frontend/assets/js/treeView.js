(function (angular, undefined) {
	var module = angular.module('AxelSoft', []);

	module.value('treeViewDefaults', {
		foldersProperty: 'folders',
		filesProperty: 'files',
		displayProperty: 'name',
		editStatus : false,
		collapsible: false
	});
	
	module.directive('treeView', ['$q', 'treeViewDefaults', function ($q, treeViewDefaults) {
		return {
			restrict: 'A',
			scope: {
				treeView: '=treeView',
				treeViewOptions: '=treeViewOptions'
			},
			replace: true,
			template:
				'<div class="tree">' +
					'<div tree-view-node="treeView">' +
					'</div>' +
				'</div>',
			controller: ['$scope', function ($scope) {
				var self = this,
					selectedNode1,
					selectedNode,
					selectedFile;

				var options = angular.extend({}, treeViewDefaults, $scope.treeViewOptions);

				self.selectNode = function (node, breadcrumbs) {
					if (selectedFile) {
						selectedFile = undefined;
					}
					if (selectedNode1) {
						selectedNode1 = undefined;
					}
					selectedNode = node;
					if (typeof options.onNodeSelect === "function") {
						options.onNodeSelect(node, breadcrumbs);
					}
				};
				
				self.selectNode1 = function (editstatus) {
					
					//selectedNode1 = node;
					if (selectedFile) {
						selectedFile = undefined;
					}
					if (selectedNode) {
						selectedNode = undefined;
					}
					console.log("Node Status2 :"+selectedNode);
					//selectedNode1 = node;
					if (typeof options.onNodeSelect1 === "function") {
						console.log("selfSelectNode1 :"+editstatus);
						options.onNodeSelect1(editstatus);
					}
				};

				self.selectFile = function (file, breadcrumbs) {
					if (selectedNode) {
						selectedNode = undefined;
					}
					if (selectedNode1) {
						selectedNode1 = undefined;
					}
					selectedFile = file;
					console.log("Node Status3 :"+selectedNode);
					if (typeof options.onNodeSelect === "function") {
						options.onNodeSelect(file, breadcrumbs);
					}
				};
				
				self.isSelected = function (node) {
					return node === selectedNode || node === selectedFile || node === selectedNode1;
				};

				/*
				self.addNode = function (event, name, parent) {
					if (typeof options.onAddNode === "function") {
						options.onAddNode(event, name, parent);
					}
				};
				self.removeNode = function (node, index, parent) {
					if (typeof options.onRemoveNode === "function") {
						options.onRemoveNode(node, index, parent);
					}
				};
				
				self.renameNode = function (event, node, name) {
					if (typeof options.onRenameNode === "function") {
						return options.onRenameNode(event, node, name);
					}
					return true;
				};
				*/
				self.getOptions = function () {
					return options;
				};
			}]
		};
	}]);

	module.directive('treeViewNode', ['$q', '$compile', function ($q, $compile) {
		return {
			restrict: 'A',
			require: '^treeView',
			link: function (scope, element, attrs, controller) {

				var options = controller.getOptions(),
					foldersProperty = options.foldersProperty,
					filesProperty = options.filesProperty,
					displayProperty = options.displayProperty,
					editStatus = options.editStatus,
					
					collapsible = options.collapsible;
				var isEditing = false;
				//editStatus= false;
				scope.expanded = collapsible == false;
				//scope.newNodeName = '';
				//scope.addErrorMessage = '';
				//scope.editName = '';
				//scope.editErrorMessage = '';

				scope.getFolderIconClass = function () {
					return 'uk-icon-globe' + (scope.expanded && scope.hasChildren() ? '-open' : '');
				};
				
				scope.getFileIconClass = typeof options.mapIcon === 'function' 
					? options.mapIcon
					: function (file) {
						return 'icon-file';
					};
				
				scope.hasChildren = function () {
					var node = scope.node;
					return Boolean(node && (node[foldersProperty] && node[foldersProperty].length) || (node[filesProperty] && node[filesProperty].length));
				};

				scope.selectNode = function (event) {
					
					event.preventDefault();
					
					if (collapsible) {
						toggleExpanded();
					}

					var breadcrumbs = [];
					var nodeScope = scope;
					//console.log("selectNode Clicked :"+editStatus);
					while (nodeScope.node) {
						breadcrumbs.push(nodeScope.node[displayProperty]);
						nodeScope = nodeScope.$parent;
					}
					controller.selectNode(scope.node, breadcrumbs.reverse());

				};

				scope.selectNode1 = function (event1) {
					event.preventDefault();
					editStatus = true;
					var breadcrumbs1 = [];
					var nodeScope1 = scope;
					//console.log("selectNode Clicked1 :"+editStatus);
					breadcrumbs1.push(editStatus);
					controller.selectNode1(breadcrumbs1);
				};

				scope.selectFile = function (file, event) {
					event.preventDefault();
					//if (isEditing) return;

					var breadcrumbs = [file[displayProperty]];
					var nodeScope = scope;
					while (nodeScope.node) {
						breadcrumbs.push(nodeScope.node[displayProperty]);
						nodeScope = nodeScope.$parent;
					}
					controller.selectFile(file, breadcrumbs.reverse());
				};
				
				scope.isSelected = function (node) {
					return controller.isSelected(node);
				};

				/*
				scope.addNode = function () {
					var addEvent = {
						commit: function (error) {
							if (error) {
								scope.addErrorMessage = error;
							}
							else {
								scope.newNodeName = '';
								scope.addErrorMessage = '';
							}
						}
					};

					controller.addNode(addEvent, scope.newNodeName, scope.node);
				};
				
				scope.isEditing = function () {
					return isEditing;
				};

				scope.canRemove = function () {
					return !(scope.hasChildren());
				};
				
				scope.remove = function (event, index) {
					event.stopPropagation();
					controller.removeNode(scope.node, index, scope.$parent.node);
				};

				scope.edit = function (event) {
				    isEditing = true;
				    controller.editingScope = scope;
					//expanded = false;
					scope.editName = scope.node[displayProperty];
					event.stopPropagation();
				};

				scope.canEdit = function () {
				    return !controller.editingScope || scope == controller.editingScope;
				};

				scope.canAdd = function () {
				    return !isEditing && scope.canEdit();
				};

				scope.rename = function (event) {
					event.stopPropagation();

					var renameEvent = {
						commit: function (error) {
							if (error) {
								scope.editErrorMessage = error;
							}
							else {
								scope.cancelEdit();
							}
						}
					};

					controller.renameNode(renameEvent, scope.node, scope.editName);
				};

				scope.cancelEdit = function (event) {
					if (event) {
						event.stopPropagation();
					}

					isEditing = false;
					scope.editName = '';
					scope.editErrorMessage = '';
					controller.editingScope = undefined;
				};
				*/

				function toggleExpanded() {
					//if (!scope.hasChildren()) return;
					scope.expanded = !scope.expanded;
				}

				function render() {
					var template =

						'<div class="tree-folder" ng-repeat="node in ' + attrs.treeViewNode + '.' + foldersProperty + '">' +
							'<a href="#" class="tree-folder-header inline" ng-click="selectNode($event)" ng-class="{ selected: isSelected(node) }">' +
								'<i class="uk-icon-globe" ng-class="getFolderIconClass()"></i> ' +
								'<span class="tree-folder-name">{{ node.' + displayProperty + ' }}</"> '+
							'</a>' +
							'<div class="tree-folder-content"'+ (collapsible ? ' ng-show="expanded"' : '') + '>' +
								'<div tree-view-node="node">' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<a href="#" class="tree-item" ng-repeat="file in ' + attrs.treeViewNode + '.' + filesProperty + '" ng-click="selectFile(file, $event)" ng-class="{ selected: isSelected(file) }">' +
							'<span class="tree-item-name"><i ng-class="getFileIconClass(file)"></i> {{ file.' + displayProperty + ' }}</span>'  +
							'</a>';

					//Rendering template.
					element.html('').append($compile(template)(scope));
				}

				render();
			}
		};
	}]);
})(angular);