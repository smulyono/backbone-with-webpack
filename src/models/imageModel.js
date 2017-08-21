const Backbone = require("backbone");

const ImageModel = Backbone.Model.extend({
    urlRoot: "https://api.500px.com/v1/photos/search",
    defaults: {
        "consumer_key": "Dx2NdtSRXlI27xAM2Q0ur73FwNfo7zwEszqYpHGZ",
        "image_size[]": 3,
        "term": ""
    }
});

module.exports = ImageModel;
