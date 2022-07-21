const { parseErrorsFromOutput, generateFromBuildOutputs } = require("./generate");

test("empty outputFromBuild returns empty array", () => {
    const result = parseErrorsFromOutput("", "blueprint");
    expect(result.length).toBe(0);
});

test("Should find three errors", () => {
    const result = parseErrorsFromOutput(`ERROR in /src/insite-commerce/modules/blueprints/triMarkBlueprint/src/Components/SocialLinks.tsx
ERROR in /src/insite-commerce/modules/blueprints/triMarkBlueprint/src/Components/SocialLinks.tsx(144,25):
TS2322: Type '{ iconProps: { size: number; css: FlattenSimpleInterpolation; src: string | React.NamedExoticComponent<IconPresentationProps> | undefined; }; position: "left"; }' is not assignable to type '{ iconProps?: IconPresentationProps | undefined; position?: "left" | "right" | undefined; }'.
  The types of 'iconProps.src' are incompatible between these types.
    Type 'string | NamedExoticComponent<IconPresentationProps> | undefined' is not assignable to type 'string | ComponentClass<{}, any> | FunctionComponent<{}> | undefined'.
      Type 'NamedExoticComponent<IconPresentationProps>' is not assignable to type 'string | ComponentClass<{}, any> | FunctionComponent<{}> | undefined'.
        Type 'NamedExoticComponent<IconPresentationProps>' is not assignable to type 'FunctionComponent<{}>'.
          Types of parameters 'props' and 'props' are incompatible.
            Type '{ children?: ReactNode; }' has no properties in common with type 'IconPresentationProps'.

ERROR in /src/insite-commerce/modules/blueprints/triMarkBlueprint/src/Overrides/Widgets/Header/MainNavigation.tsx
ERROR in /src/insite-commerce/modules/blueprints/triMarkBlueprint/src/Overrides/Widgets/Header/MainNavigation.tsx(513,26):
TS2739: Type '{ links: MappedLink[]; showQuickOrder: boolean; quickOrderLink: Readonly<PageLinkModel> | undefined; }' is missing the following properties from type 'Readonly<Pick<Pick<Props, "links" | "currencies" | "languages" | "isGuest" | "userName" | "isSigningIn" | "homePageUrl" | "setLanguage" | "currentLocation" | "setInitialValues" | ... 20 more ... | "drawerIsOpen">, "links" | ... 5 more ... | "vmiPageLinks">>': displayVmiNavigation, vmiPageLinks

ERROR in /src/insite-commerce/modules/blueprints/triMarkBlueprint/src/Overrides/Widgets/Header/MainNavigation.tsx
ERROR in /src/insite-commerce/modules/blueprints/triMarkBlueprint/src/Overrides/Widgets/Header/MainNavigation.tsx(532,38):
TS2741: Property 'displayChangeCustomerLink' is missing in type '{ index: number; link: MappedLink; styles: MainNavigationStyles; container: RefObject<HTMLDivElement>; isOpen: boolean; }' but required in type 'Pick<ThemeProps<BaseTheme> & OwnProps & RefAttributes<MainNavigationItem>, "link" | "ref" | "key" | ... 4 more ... | "container">'.\u001b[39m\u001b[22m

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! root@ node-build:server: \`node node_modules/webpack/bin/webpack.js --config=config/webpack/prodServer.js "--env" "BLUEPRINT=triMarkBlueprint"\`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the root@ node-build:server script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2022-06-25T01_04_32_083Z-debug.log
ERROR: "node-build:server -- --env BLUEPRINT=triMarkBlueprint" exited with 1.
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! root@ build:server: \`npm-run-all "node-build:server -- --env BLUEPRINT={1}" -- "triMarkBlueprint"\`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the root@ build:server script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2022-06-25T01_04_32_243Z-debug.log
ERROR: "build:server triMarkBlueprint" exited with 1.
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! root@ build: \`npm-run-all "build:server {1}" "build:client {1}" -- "triMarkBlueprint"\`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the root@ build script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2022-06-25T01_04_32_272Z-debug.log
`, "triMarkBlueprint");
    expect(result.length).toBe(3);
    expect(result[0].message).toBe(`TS2322: Type '{ iconProps: { size: number; css: FlattenSimpleInterpolation; src: string | React.NamedExoticComponent<IconPresentationProps> | undefined; }; position: "left"; }' is not assignable to type '{ iconProps?: IconPresentationProps | undefined; position?: "left" | "right" | undefined; }'.
  The types of 'iconProps.src' are incompatible between these types.
    Type 'string | NamedExoticComponent<IconPresentationProps> | undefined' is not assignable to type 'string | ComponentClass<{}, any> | FunctionComponent<{}> | undefined'.
      Type 'NamedExoticComponent<IconPresentationProps>' is not assignable to type 'string | ComponentClass<{}, any> | FunctionComponent<{}> | undefined'.
        Type 'NamedExoticComponent<IconPresentationProps>' is not assignable to type 'FunctionComponent<{}>'.
          Types of parameters 'props' and 'props' are incompatible.
            Type '{ children?: ReactNode; }' has no properties in common with type 'IconPresentationProps'.`)
    expect(result[2].message).toBe(`TS2741: Property 'displayChangeCustomerLink' is missing in type '{ index: number; link: MappedLink; styles: MainNavigationStyles; container: RefObject<HTMLDivElement>; isOpen: boolean; }' but required in type 'Pick<ThemeProps<BaseTheme> & OwnProps & RefAttributes<MainNavigationItem>, "link" | "ref" | "key" | ... 4 more ... | "container">'.`)
    expect(result[2].location).toBe("ERROR in /src/insite-commerce/modules/blueprints/triMarkBlueprint/src/Overrides/Widgets/Header/MainNavigation.tsx(532,38):");
});

