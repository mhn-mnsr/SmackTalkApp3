const Handlebars = require('handlebars')
let register = function(Handlebars) {
    var helpers = {
        compare: function (lvalue, operator, rvalue, options) {
            var operators, result;
            if (arguments.length < 3) {
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
            }
            if (options === undefined) {
                options = rvalue;
                rvalue = operator;
                operator = "===";
            }
            operators = {
                '==': function (l, r) { return l == r; },
                '===': function (l, r) { return l === r; },
                '!=': function (l, r) { return l != r; },
                '!==': function (l, r) { return l !== r; },
                '<': function (l, r) { return l < r; },
                '>': function (l, r) { return l > r; },
                '<=': function (l, r) { return l <= r; },
                '>=': function (l, r) { return l >= r; },
                'typeof': function (l, r) { return typeof l == r; }
            };
            if (!operators[operator]) {
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
            }
            result = operators[operator](lvalue, rvalue);
            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        vue: function(options){
            return options.fn()
        },
        isAdmin: function(uid,adminMembers,tid){
            let admin = '<p>Admin</p>'
            if( arguments.length <2){
                throw new Error('This wrong sir')
            }
            for(member in adminMembers){
                if(adminMembers[member] == uid.toString()) {
                    return new Handlebars.SafeString('<i class="fas fa-key"></i>')
                }
            }
            let result = `<button type="button" onclick="deleteUserFromTeam(${uid},${tid})" class="btn btn-default"><span class="fas fa-trash"></span>Delete</button>`
            return new Handlebars.SafeString(result)
        }
};

if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
        Handlebars.registerHelper(prop, helpers[prop]);
    }
} else {
    return helpers;
}

};

module.exports.register = register;
module.exports.helpers = register(null); 
