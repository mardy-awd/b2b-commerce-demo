﻿namespace InsiteCommerce.Web
{
    using System.Web.Routing;
    using Insite.Core.Interfaces.Data;
    using Insite.SystemResources;
    using Insite.WebFramework.Mvc;
    using Insite.WebFramework.Routing;
    using Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            new CustomSiteStartup().Run(app);
        }
    }

    public class CustomSiteStartup : SiteStartup
    {
        protected override void PreStartup()
        {
            // this happens before any other startup code, but will happen after Application_Start
            // The IOC container has not been initialized, the bootstrapper has not been run, no IStartupTasks have been run.
        }

        protected override void PostStartup(IUnitOfWork unitOfWork)
        {
            BundleConfig.RegisterBundles();

            // load any custom dot liquid tags here
            // Template.RegisterTag<MyCustomTag>("myCustomTag");
        }

        protected override void RegisterCustomRoutes(
            RouteCollection routes,
            IRouteProvider routeProvider
        )
        {
            // Add additional routes with this syntax
            // routeProvider.MapRoute(routes, null, "Test", new { Controller = "Test", Action = "Index" }, true);
        }

        public override string[] GetAdditionalAdminAuthenticationPaths()
        {
            // if there are additional paths that should use the admin bearer token authentication, return them here
            // return new[] { "/customAdminRoute" }; - ensures that requests to any urls starting with /customAdminRoute/ will use the admin bearer token authentication
            // note that the requests will not work with cookies, the bearer token will have to be sent in the query string or as a request header
            return new string[0];
        }
    }
}
