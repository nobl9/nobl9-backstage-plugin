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
  };
}
