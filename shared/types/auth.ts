export type AuthCredentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type AuthSession = AuthCredentials & {
  authorizedAt: string;
};
