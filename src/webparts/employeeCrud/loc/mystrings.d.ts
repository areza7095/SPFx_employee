declare interface IEmployeeCrudWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'EmployeeCrudWebPartStrings' {
  const strings: IEmployeeCrudWebPartStrings;
  export = strings;
}
