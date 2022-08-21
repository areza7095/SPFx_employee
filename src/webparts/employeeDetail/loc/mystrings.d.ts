declare interface IEmployeeDetailWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'EmployeeDetailWebPartStrings' {
  const strings: IEmployeeDetailWebPartStrings;
  export = strings;
}
