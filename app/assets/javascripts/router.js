(function (app) {

  app.Router = Backbone.Router.extend({

    routes: {
      "":                 "metricsIndex",
      "metrics":          "metricsIndex",
      "metrics/:name":    "metricsShow",
      "dashboards":       "dashboardsIndex",
      "dashboards/:id":   "dashboardsShow",
      "instruments":      "instrumentsIndex",
      "instruments/:id":  "instrumentsShow",
      "about":            "aboutShow"
    },

    initialize: function(options) {
    },

    showView: function(view) {
      if (this.currentView) {
        this.currentView.close();
      }

      this.currentView = view;
      this.currentView.render();
      $("#main").html(this.currentView.el);

      this.updateNavigationSelection(Backbone.history.fragment);
    },

    updateNavigationSelection: function(fragment) {
      $("div.navbar a[data-navigation-url]").parent().removeClass("active");

      var url = fragment;
      if ( fragment.indexOf("/") > 0) {
        url = url.slice(0, url.indexOf("/"));
      }

      var selectedMenu = null;
      switch(url) {
        case "metric":
        case "metrics":
          selectedMenu = "metrics";
          break;
        case "instruments":
        case "instrument":
          selectedMenu = "instruments";
          break;
        case "dashboards":
        case "dashboard":
          selectedMenu = "dashboards";
          break;
        case "about":
          selectedMenu = "about";
          break;
      }

      $("div.navbar a[data-navigation-url='/"+ selectedMenu +"']").parent().addClass("active");
    },

    metricsIndex: function() {
      console.log("ROUTER: metrics");
      
      var metricsView = new app.views.Metrics({ collection: app.collections.metrics });
      this.showView(metricsView);
    },

    metricsShow: function(name) {
      console.log("ROUTER: metric details:", name);
      
      var that = this;
      app.collections.metrics.fetch({
        success: function(collection, response) {
          var model = collection.where({ name: name })[0];
          var view = new app.views.Metric({ model: model });
          that.showView(view);
        }
      });
    },

    dashboardsIndex: function() {
      console.log("ROUTER: dashboards");
      
      var dashboardsView = new app.views.Dashboards({ collection: app.collections.dashboards });
      this.showView(dashboardsView);
    },

    dashboardsShow: function(id) {
      console.log("ROUTER: dashboard_detail");

      dashboard = new app.models.Dashboard({ id: id });
      var that = this;
      dashboard.fetch({
        success: function(model, response) {
          var dashboardView = new app.views.Dashboard({ model: model });
          that.showView(dashboardView);
        }
      });
    },

    aboutShow: function() {
      console.log("ROUTER: about");
      var aboutView = new app.views.About();
      this.showView(aboutView);
    }
  });

})(app);