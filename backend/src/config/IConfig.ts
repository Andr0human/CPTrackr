interface IServerConfig {
  devMode: string;
  port: number;
  morganLogLevel: string;
  apis: {
    leetcode: string;
    codeforces: string;
    codechef: string;
  };
}

export default IServerConfig;
