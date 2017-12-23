define([], function(){
    function stringToArray(string){
        var res = [];
        for(var i = 0; i < string.length; i++){
            res.push(string.charAt(i));
        }
        return res;
    }

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function PasswordGenerator(options){
        this.set = options.set;
        this.length = options.length;
    }

    PasswordGenerator.prototype.generate = function(){
        var pattern = shuffle(stringToArray("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"));

        var res = "";
        for (var i = 0; i < this.length; i++) {
            res += pattern[getRandomInt(0, pattern.length - 1)];
        }
        return res;
    }

    PasswordGenerator.generate = function(length){
        var generator = new PasswordGenerator({
            set: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            length: length || 16
        });
        return generator.generate();
    }

    return PasswordGenerator;
});