const Backbone = require("backbone"),
    aboutHtml = require("text!templatePath/about.view.html");

const AboutView = Backbone.View.extend({
    template: _.template(aboutHtml),
    render: function() {
        this.$el.html(this.template());
        return this;
    }
});

module.exports=AboutView;
