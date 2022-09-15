<%@ Page Async="true" Language="C#" AutoEventWireup="true" CodeBehind="QuickPing.aspx.cs" Inherits="QuickPing" %>
<%@ Import Namespace="Insite.Core.HealthCheck" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
<form id="form1" runat="server">
    <div>
        <%
            var siteName = ConfigurationManager.AppSettings["SiteIdentifier"] ?? "B2B Commerce";
            var healthy = this.HealthCheckResults.Status == HealthCheckStatus.Healthy;
            this.Response.Write(siteName + " QuickPing is " + (healthy ? "good" : "bad") + " <br/><br/>");
            foreach (var healthCheckResult in this.HealthCheckResults.Results)
            {
                this.Response.Write((healthCheckResult.Name + " " + healthCheckResult).Replace(Environment.NewLine,"<br />") + " <br/><br/>");
            }
            this.Response.Write("QuickPing Duration: " + this.HealthCheckResults.Duration + " <br/><br/>");
            if (!healthy)
            {
                this.Response.StatusCode = 500;
            }
        %>
    </div>
</form>
</body>
</html>
