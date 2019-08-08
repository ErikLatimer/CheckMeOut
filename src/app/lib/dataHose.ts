import { DataPlumberService } from './data-plumber.service'; // Improved and used just for type reference. Never instantiated.
import { EventEmitter } from 'events'; // Imported for type reference. Never instantiated. Part of the NodeJS standard library

/**
 * The dataHose abstract class handles the communication, more specifically, the emission of daa, between directives and/or components.
 */

export abstract class DataHose {
  private _hoseDataPlumberService: DataPlumberService; // Instantiated by the constructor to hold a global reference to the DataPlumberService.
  private _dataEmitter = undefined; // The emitter emits a 'newData' even when it has a data to emit.
  private _tag: string; // An id of sorts. If this tag matches a tag belonging to a spout then data begins to "flow".

  /**
   * The constructor includes a typed parameter to pass to the initialization of the dataEmitter. Initializes the dataPlumberService, the
   * dataEmitter, and tag, and connects this hose to the pipeline specified by the tag.
   */
  public constructor (dataPlumberServiceGlobalServiceReference: DataPlumberService, tag: string) {
    // Set this dataPlumberService to the global service instance
    this._hoseDataPlumberService = dataPlumberServiceGlobalServiceReference;
    // Set this tag/id to the tag published as a parameter
    this._tag = tag;
    this._dataEmitter = new EventEmitter();
    // Passes a tag and an instance of the event Emitter to the plumber
    this._hoseDataPlumberService.connectHose( this._tag, this._dataEmitter);
    }

  /**
   * @description Emits the of type EventEmitter<T> passed in by paramter. Makes sure the parameter and <T> are if the same type.
   * @parameter {string} eventName The event to emit. Subscribers subscribed to <eventName>
   * @returns {void}
   */
    protected _sprayData(data: any): void {this._dataEmitter.emit(this._hoseDataPlumberService.SPRAY, data);}


}