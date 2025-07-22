export interface Config {
  /**
   * nobl9 config
   * @visibility frontend
   */
  nobl9?: {
    /**
     * nobl9 base url for links
     * @visibility frontend
     */
    baseUrl: string;
    /**
     * nobl9 organization id for links
     * @visibility frontend
     */
    organization: string;
    /**
     * custom backend plugin path
     * @visibility frontend
     */
    backendPluginPath?: string;
    /**
     * Client ID for the nobl9 API credentials
     * @visibility backend
     */
    clientId: string;
    /**
     * Client Secret of the nobl9 API credentials
     * @visibility secret
     */
    clientSecret: string;
  };
}
