define((require) => {
    const Backbone = require("backbone");

    const mainContainer = $("#root");

    const AppRouter = Backbone.Router.extend({
        mainView: undefined,
        aboutView: undefined,
        routes: {
            "about": "aboutRoute",
            "*any": "mainRoute"
        },
        mainRoute: function() {
            let parent = this;
            require(["mainView"], (MainView)=> {
                if (!parent.mainView) {
                    // cleanup older 
                    parent.mainView = new MainView();
                    parent.mainView.setElement(mainContainer);
                } 
                parent.mainView.render();
            });
        },
        aboutRoute: function() {
            let parent = this;
            require(["../views/aboutView"], (AboutView) => {
                if (!parent.aboutView) {
                    parent.aboutView = new AboutView();
                    parent.aboutView.setElement(mainContainer);
                }
                parent.aboutView.render();
            });
        }
    });

    new AppRouter();
    Backbone.history.start();
});


