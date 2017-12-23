define (['knockout'], function(ko){
    function Command(name, execute, cancel, subcommands) {
        var self = this;

        this.Name = name;

        this.Execute = function () {
            if (subcommands) {
                for (var i = 0; i < subcommands.length; i++) {
                    subcommands[i].Execute();
                }
            }

            execute.call(self);
        };

        this.Cancel = function () {
            cancel.call(self);

            if (subcommands) {
                for (var i = 0; i < subcommands.length; i++) {
                    subcommands[i].Cancel();
                }
            }
        };
    }

    //-----------------------------------------------CommandHistory---------------------------------------------------------
    function CommandHistory() {
        this.options = {
            max: 100
        };

        this.Commands = ko.observableArray();
        this.Current = ko.observable();
        this.Max = ko.observable(this.options.max);

        this.clear();
    }

    CommandHistory.prototype.clear = function(){
        this.Current(-1);
        this.Commands([]);
    }

    CommandHistory.prototype.add = function(command) {
        if (this.Current() != this.Commands().length - 1) {
            var start = this.Current() + 1;
            this.Commands.splice(start, this.Commands().length - start);
        }

        this.Commands.push(command);

        if (this.Commands().length >= this.Max()) {
            this.Commands(this.Commands.slice(this.Commands().length - this.Max()));

        }

        this.Current(this.Commands().length - 1);

        command.Execute.call(command);
    }

    CommandHistory.prototype.undo = function() {
        if (this.Current() >= 0) {
            var command = this.Commands()[this.Current()];
            command.Cancel();
            this.Current(this.Current() - 1);
        }
        else {
        }
    }

    CommandHistory.prototype.redo = function() {
        if (this.Current() < this.Commands().length - 1) {
            var command = this.Commands()[this.Current() + 1];
            
            command.Execute();

            this.Current(this.Current() + 1);
        }
        else
        {
        }
    }
    
    return { 
        Command: Command,
        CommandHistory: CommandHistory
    };
});