define(["knockout",  "knockout.mapping", "widgets/InlineEditor"],
    function(ko, mapping, InlineEditor) {
        function TableSeach(options) {
            InlineEditor.call(this, options);

            var self = this;

            this.filter = {
                model: mapping.fromJS(options.filter.model),
                pageNumber: ko.observable(options.filter.pageNumber || 1),
                pageSize: ko.observable(options.filter.pageSize || 20),
                sortField: ko.observable(options.filter.sortField || "id"),
                sortType: ko.observable(options.filter.sortType || "asc")
            };

            this.filterResult = {
                count: ko.observable(0)
            };

            this.filterResult.pagesCount = ko.computed(function(){
                return Math.ceil(1.0 * this.filterResult.count() / this.filter.pageSize());
            }, this);

            for(var key in this.filter){
                if(ko.isObservable(this.filter[key])){
                    this.filter[key].subscribe(function(){
                        self.search();
                    });
                }
            }

            for(var key in this.filter.model){
                if(ko.isObservable(this.filter.model[key])){
                    this.filter.model[key].subscribe(function(){
                        self.search();
                    });
                }
            }
        }

        TableSeach.prototype = Object.create(InlineEditor.prototype);

        TableSeach.prototype.search = function(){
            var self = this;
            this.options.search(mapping.toJS(this.filter), function (data) {
                self.items(data.items);
                self.filterResult.count(data.count);
            });
        }

        TableSeach.prototype.goToStartPage = function() {
            this.filter.pageNumber(1);
        }

        TableSeach.prototype.goToLastPage = function() {
            this.filter.pageNumber(this.filter.pageNumber() - 1);
        }

        TableSeach.prototype.goToNextPage = function() {
            this.filter.pageNumber(this.filter.pageNumber() + 1);
        }

        TableSeach.prototype.goToEndPage = function() {
            this.filter.pageNumber(this.filterResult.pagesCount());
        }

        return TableSeach;
    });