/**  */
declare type CURL_Method = "GET" | "POST";

declare class CURL {
  //new CURL().run("GET", url, data, function() {
  //          return arguments[0];
  //     }, null, cred);
  /**https://wiki.freeswitch.org/wiki/Run */
  run(method: CURL_Method, url: string, request_data?: string, callback?: (response: string, callback_arg?: any) => any, callback_arg?: any, credentials?: string, timeout?: number, content_type?: string);
} 