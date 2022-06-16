module insite.common {
    "use strict";

    import WebsiteSettingsModel = Insite.Websites.WebApi.V1.ApiModels.WebsiteSettingsModel;

    export interface ITokenExIFrameService {
        addScript(websiteSettings: WebsiteSettingsModel);
        removeScript();
    }

    export class TokenExIFrameService implements ITokenExIFrameService {
        testTokenExJavaScriptUrl = "https://test-htp.tokenex.com/Iframe/Iframe-v3.min.js";
        prodTokenExJavaScriptUrl = "https://htp.tokenex.com/Iframe/Iframe-v3.min.js";

        addScript(websiteSettings: WebsiteSettingsModel): void {
            if (websiteSettings.useTokenExGateway || websiteSettings.useECheckTokenExGateway) {
                const script = document.createElement("script");
                script.src = websiteSettings.tokenExTestMode
                    ? this.testTokenExJavaScriptUrl
                    : this.prodTokenExJavaScriptUrl;
                script.async = true;

                const oldScript = this.getScript();
                if (!oldScript) {
                    document.body.appendChild(script);
                }
            }
        }

        removeScript(): void {
            const script = this.getScript();
            if (script) {
                document.body.removeChild(script);
            }
        }

        private getScript(): any {
            return document.querySelector(`script[src*="htp.tokenex.com/Iframe/Iframe-v3.min.js"]`);
        }
    }

    angular
        .module("insite-common")
        .service("tokenExIFrameService", TokenExIFrameService);
}