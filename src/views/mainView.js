const Backbone = require("backbone"),
    ImageModel = require("../models/imageModel"),
    templateHtml= require("text!templatePath/search.view.html"),
    itemHtml = require("text!templatePath/photo.html");

const MainView = Backbone.View.extend({
    template: _.template(templateHtml),
    model: new ImageModel(),
    events: {
        "click .searchBtn": "searchImage"
    },
    initialize: () => {
        console.info("initializing main view");
    },
    render: function() {
        this.$el.html(this.template());
        return this;
    },
    hide: function() {
        $(this.el).hide();
    },
    show: function() {
        $(this.el).show();
    },
    searchImage: function(e) {
        let searchTerm = this.$("#searchTxt").val();
        let parent = this;
        console.info('searching ', searchTerm);
        this.model.set("term", searchTerm);
        this.model.fetch({
                data: this.model.attributes
            })
            .done(function(response) {
                parent.renderImages(response);
            })
            .fail(function(err) {
                console.error(err);
            });
    },
    renderImages: function(jsonData) {
        console.info(jsonData);   
        let itemTemplate = _.template(itemHtml);
        let photoItems = [];
        if (jsonData && jsonData.hasOwnProperty("photos") 
            && jsonData.photos.length > 0) {
            jsonData.photos.map((photo) => {
                photoItems.push(itemTemplate({
                    "photo": photo
                }));
                return photo;
            });
        }
        if (photoItems.length > 0) {
            this.$(".output-container").children().remove();
            this.$(".output-container").append(photoItems.join(""));
        }
    }
});

module.exports = MainView;
