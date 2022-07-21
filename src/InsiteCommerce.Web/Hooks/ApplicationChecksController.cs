namespace InsiteCommerce.Web.Hooks
{
    using System;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Insite.Common.Logging;
    using Insite.Core.Extensions;
    using Insite.Integration.WebService.Interfaces;

    [RoutePrefix("api/v1/admin/checks")]
    [InternalAccessAuthentication]
    public class ApplicationChecksController : ApiController
    {
        private readonly IIntegrationJobsActiveService integrationJobsActiveStatus;

        public ApplicationChecksController(
            IIntegrationJobsActiveService integrationJobsActiveStatus
        )
        {
            this.integrationJobsActiveStatus = integrationJobsActiveStatus;
        }

        [HttpGet]
        [Route("PostStart")]
        public HttpResponseMessage PostStart()
        {
            this.integrationJobsActiveStatus.EnableStartingOfJobs();

            var response = this.Request.CreateResponse();
            response.Content = new StringContent("success");

            return response;
        }

        [HttpGet]
        [Route("PreStop")]
        public async Task<HttpResponseMessage> PreStop()
        {
            try
            {
                var logger = LogHelper.For(this);

                if (
                    !int.TryParse(
                        this.Request.GetQueryString("terminationGracePeriodSeconds"),
                        out var terminationGracePeriodSeconds
                    )
                )
                {
                    terminationGracePeriodSeconds = 60;
                }

                this.integrationJobsActiveStatus.DisableNewJobsFromStarting();

                // Check for InProgress IntegrationJobs
                var checkCount = 0;
                // Wait for InProgress to finish (Delay 1/10 of terminationGracePeriodSeconds)
                var checkDelay = (terminationGracePeriodSeconds / 10) * 1000;
                var currentlyInProcessJobs = this.integrationJobsActiveStatus.GetInProcessJobs();
                if (currentlyInProcessJobs.Any())
                {
                    // This way we will always check around 8 times and log any InProgress Jobs.
                    while (checkCount < 8)
                    {
                        checkCount++;
                        logger.Warn(
                            $"PreStop Check - Currently running IntegrationJob Ids: [{string.Join(", ", currentlyInProcessJobs)}]."
                        );

                        await Task.Delay(checkDelay);
                        currentlyInProcessJobs =
                            this.integrationJobsActiveStatus.GetInProcessJobs();
                        if (!currentlyInProcessJobs.Any())
                        {
                            break;
                        }
                    }

                    // If not finished and return a failed response
                    if (currentlyInProcessJobs.Any())
                    {
                        this.integrationJobsActiveStatus.LogCaughtInPreStopCheck();
                        var errorResponse = this.Request.CreateResponse();
                        errorResponse.StatusCode = System.Net.HttpStatusCode.BadRequest;
                        errorResponse.Content = new StringContent(
                            $"IntegrationJobs did not finish in time(terminationGracePeriodSeconds={terminationGracePeriodSeconds}): {string.Join(", ", currentlyInProcessJobs)}"
                        );
                        return errorResponse;
                    }
                }

                var response = this.Request.CreateResponse();
                response.Content = new StringContent("success");

                return response;
            }
            catch (Exception e)
            {
                LogHelper.For(this).Error(e.Message, e);
                throw;
            }
        }
    }
}
