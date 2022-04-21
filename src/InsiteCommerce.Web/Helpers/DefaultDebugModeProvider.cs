namespace InsiteCommerce.Web.Helpers
{
    using Insite.Core.Providers;

    public class DefaultDebugModeProvider : IDebugModeProvider
    {
        public bool IsDebugEnabled => this.IsPreprocessorDebugEnabled;

        private bool IsPreprocessorDebugEnabled { get; }

        public DefaultDebugModeProvider()
        {
#if DEBUG
            this.IsPreprocessorDebugEnabled = true;
#endif
        }
    }
}
