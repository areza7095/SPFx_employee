declare interface IGetDocLibWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'GetDocLibWebPartStrings' {
  const strings: IGetDocLibWebPartStrings;
  export = strings;
}
