import { DataPlumberService } from './data-plumber.service'; // Imported and used as an Angular Service. Never instantiated, it's a global reference.

/**
 * The dataSpout abstract class handles the receiving from directives and/or component
 */
export abstract class DataSpout {
  private _tag: string; // An id of sorts. If this tag matches a tab belonging to a spout then data begins to "flow"
  private _spoutDataPlumberService: DataPlumberService; // Initialized by the constructor to hold a global reference to the DataPlumberService
  /**
   * The constructor includes a typed parameter to determine the type of parameter of the callback function passed in as a
   * parameter. The type of paramter within the callback function should ultimately be of the same type of the data
   * sprayed by the hose-like infrastructure that is a part of the same pipeline. Connects this spout to the pipeline tagged
   * with the private _tag property or member of this class.
   */
  public constructor( dataPlumberServiceGlobalReference: DataPlumberService, callbackFunction: (dataSprayed: any)=>void, tag: string ) {
    // Sets the tag of this Spout-like infrastructure to the tag provided in the constructor
    this._tag = tag;
    // Set this dataPlumberService to the global service instance
    this._spoutDataPlumberService = dataPlumberServiceGlobalReference;
    // Set this tag.id to the tag passed in as a paramter
    // Connect to the pipeline as a spout-like infrastructure, passing in a tag and a callback
    this._spoutDataPlumberService.connectSpout(tag, callbackFunction);
  }

  public getSprayHistory(): Array<any> | null {
    return this._spoutDataPlumberService.getSprayedData(this._tag);
  }
}