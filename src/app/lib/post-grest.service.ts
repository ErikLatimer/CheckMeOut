import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * Provides easy access to your PostGreSQL database through a combination of this service and a running
 * postgrest server.
 */
export class PostGrestService {

  /**
   * ! This service is DEPENDANT on PostGrest running and it's server up. Please make sure the service is running
   * ! correctly and properly configured before using this service.
   * 
   * Steps for getting PostGrest running:
   * I. Travel to the Software_Libraries directory located in your documents folder
   * II. Find the PostGrest folder, and in it, the PostGrest pre-compiled binary
   * III. Make sure that PostGreSQL is running on your local machine
   * IV. Make sure that the bin directory, where all of the binaries are located for PostgreSQL,
   * is available in the PATH environment variable
   * V. Make sure to already have a postgrest.conf file made and ready to be pointed to
   * 
   * EXAMPLE:
   * # postgrest.conf
   * # The standard connection URI format, documented at
   * # https://www.postgresql.org/docs/current/static/libpq-connect.html#AEN45347
   * db-uri="postgres://postgres:T!g31wo1f@localhost:5433/postgres"
   * # The name of which database schema to expose to REST clients
   * db-schema="public"
   * # The database role to use when no client authentication is provided.
   * # Can (and probably should) differ from user in db-uri
   * db-anon-role="postgres"
   * 
   * VI. Run "postgrest <PATH TO CONF FILE>"
   * VII. Done
   */

   private readonly HOST: string = "localhost";
   private readonly PORT: number = 3000;
   private readonly DEFAULT_TABLE: string = "ssc_inventory";
   private readonly PROTOCOL: string = "http";

  public constructor() { }

  /**
   * @async
   * @public
   * @description Just performs a test.
   * @returns {void}
   */
  public async init(): Promise<void> {
   // await this._test();
  }


  /**
   * @public
   * @async
   * @description 
   * !!! THIS REQUIRES A UNIQUE CONSTRAINT TO BE PLACED ON THE UUID COLUMN OF THE DEFAULT OR OTHERWISE SPECIFIED TABLE IN ORDER TO FUNCTION PROPERLY
   * The retrieveDocumentByUUID method receives an UUID and uses it to query the default table for a document matching that UUID.
   * Returns undefined if the document is not found, null if a request error occurs, or an object representation of the document if found. Only
   * one object is guaranteed because the UUID field of any table SHOULD have a unique constraint placed on the object.
   * @param uuid 
   * @returns {Object} An object representation of the body.
   */
  public async retrieveDocumentByUUID(uuid:string): Promise<Object> {
    const queryParameter: string = `Unique_Id=eq.${uuid}`;
    console.log("​PostGrestService -> publicconstructor -> queryParameter", queryParameter);
    const url = `${this._constructBaseURL()}?${queryParameter}`;
    console.log("​PostGrestService -> publicconstructor -> url", url);
    const header: Headers = new Headers();
    header.append('Accept', 'application/json');
    const requestInit: RequestInit = {
      method: 'GET',
      headers: header
    };
    const request: Request = new Request(url,requestInit);
    const response: Response = await window.fetch(request);
    /**
     * If the column doesn't exist, a response code of 400 is sent, meaning this if() statement doesn't get executed
     */
    if (response.ok) {
      const streamReader: ReadableStreamDefaultReader = response.body.getReader();
      /**
       * A stream reader reads data a chunk at a time, and the data chunk is always in the form of an Object shaped like {value: theChunk, done: boolean}. If the done
       * property evaluates to true, then the stream reader has reached the end of the stream. If the end of the stream is reached, it also means by default that
       * the value property will be of type undefined. We can read only once here with confidence because the body payload isn't that much data at all.
       */
      const chunkOfData: any = await streamReader.read();
      /** Assuming chunkOfData is of string type... */
      const bodyContent: any = this._uInt8ArrayToString(chunkOfData.value);
      console.log("​PostGrestService -> publicconstructor -> bodyContent", bodyContent);
      // Knowing that the bodyContent is in Json string form of an array of objects that were returned from the query...
      const bodyObject: Array<Object> = JSON.parse(bodyContent);
      /**
       * The info object will take the shape of the columns within the specified table
       */
      /**
       * We know the array is only one element long because each uuid SHOULD be unique in reference to other unique ids within each item within the referenced table
       * 
       */
      const infoObject: Object = bodyObject[0];
      console.log("​PostGrestService -> publicconstructor -> infoObject", infoObject);
      return infoObject;
    }
    else if (response.status == 400) {
      /**
       * This could either mean a malformed request or the column with the specified conditions could not be found (or in other words does not exist). But in any event,
       * the request REACHED the server.
       */
      const streamReader: ReadableStreamDefaultReader = response.body.getReader();
      /**
       * A stream reader reads data a chunk at a time, and the data chunk is always in the form of an Object shaped like {value: theChunk, done: boolean}. If the done
       * property evaluates to true, then the stream reader has reached the end of the stream. If the end of the stream is reached, it also means by default that
       * the value property will be of type undefined. We can read only once here with confidence because the body payload isn't that much data at all.
       */
      const chunkOfData: any = await streamReader.read();
      /** Assuming chunkOfData is of string type... */
      const bodyContent: string = chunkOfData.value;
      console.log("​PostGrestService -> publicconstructor -> bodyContent", bodyContent);
      /**
       * Knowing that an array of objects that match the attempted query aren't going to be returned because the request was bad, the contents of body should only
       * represent one object.
       */
      const bodyObject: Object = JSON.parse(bodyContent);
      /**
       * If the code property of the body response is not defined, most likely it means that there was a parsing error of our query. Meaning a malformed request
       */
      // @ts-ignore
      if (typeof bodyObject.code == "undefined") {
        console.error(`ERROR. Malformed query sent to PostGrest "${url}"`);
        return null; // Returning null is this case means that there was an error with the request
      }
      else {
        // This most likely means the column wasn't found.
        console.warn(`Document with a uuid of "${uuid}" could not be found within table "${this.DEFAULT_TABLE}"`);
        return undefined; // Returning undefined here in this case means that documents could not be located under the specified query.
      }
    }
    else {
      console.error(`ERROR. Request "${url}" either resulted in the server not being found or something else but here is the error code "${response.status} `);
      return null; // Returning null is this case means that there was an error with the request
    }
  }

  /**
   * @private
   * @description Constructs a base url with the given properties of this instance of the service. Query parameters are to be inserted immediately following
   * this string IF they are to be used. If not, a request ot this url will yield the entire contents of this table.
   * @returns {string} The base url
   */
  private _constructBaseURL(): string {
    const baseUrl: string = `${this.PROTOCOL}://${this.HOST}:${this.PORT}/${this.DEFAULT_TABLE}`;
    console.log("​PostGrestService -> publicconstructor -> baseUrl", baseUrl);
    return baseUrl;
  }

  /**
   * @private
   * @description Intakes a Uint8Array, converts each element to a respect char using unicode encoding, and returns the resulting string of concatenating
   * all chars together.
   * @param {Uint8Array} uInt8Array A typed array of 8-bit unsigned integers
   * @returns {string} The resulting string
   */
  private _uInt8ArrayToString(uInt8Array: Uint8Array) {
    let resultingString: string = '';
    uInt8Array.forEach((unsignedInteger: number)=> {resultingString += String.fromCharCode(unsignedInteger);});
    return resultingString;
  }

  /**
   * @async
   * @private
   * @description Performs a test
   * @returns {void}
   */
  private async _test():Promise<void> {
    const found_uuid = "b2a4825f-91f2-4ccb-9a3a-3b4e502a1265";
    const unfound_uuid = "b2a4825f-91f2-4ccb-9a3a-3b4e502a1234"
    const testResult = await this.retrieveDocumentByUUID(unfound_uuid);
    if (typeof testResult == "undefined") {
      console.warn("Document not found under user query");
    }
    else if (testResult) {
      console.log("Test results:");
      console.log(testResult);
    }
    else {
      console.error("A request error has occured");
    }
  }

}