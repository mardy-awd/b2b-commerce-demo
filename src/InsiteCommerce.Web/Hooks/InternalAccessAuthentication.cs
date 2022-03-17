namespace InsiteCommerce.Web.Hooks
{
    using System;
    using System.Configuration;
    using System.Net;
    using System.Net.Http;
    using System.Security.Principal;
    using System.Threading;
    using System.Web;
    using System.Web.Http.Controllers;
    using System.Web.Http.Filters;
    using Insite.Core.Extensions;

    public class InternalAccessAuthentication : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var accessSecret = actionContext.Request.GetQueryString("access_secret");

            if (accessSecret != null)
            {
                var internalAccessSecret = Insite.Common.Providers.AppSettingProvider.Current[
                    "INTERNAL_ACCESS_SECRET"
                ];
                if (internalAccessSecret.IsBlank())
                {
                    throw new ConfigurationErrorsException(
                        "You must add INTERNAL_ACCESS_SECRET to the appSettings.config file"
                    );
                }

                var isValid = accessSecret == internalAccessSecret;

                if (isValid)
                {
                    var principal = new GenericPrincipal(
                        new GenericIdentity("internal_access_caller"),
                        null
                    );
                    Thread.CurrentPrincipal = principal;
                    if (HttpContext.Current != null)
                    {
                        HttpContext.Current.User = principal;
                    }

                    return;
                }
            }

            HandleUnauthorized(actionContext);
        }

        private static void HandleUnauthorized(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(
                HttpStatusCode.Unauthorized
            );
        }
    }
}
