import { Injectable } from '@angular/core';
import { EventEmitter } from 'events'; // Used for reference of the type

interface Pipeline { [tag:string]: Array<(dataSprayed: any)=> void> }
interface DataSprayHistory { [tag:string]: Array<any> }

@Injectable({
  providedIn: 'root'
})

/**
 * The DataPlumberService is responsible for connecting hoses, pipes, and spouts together to allow intercommunication
 * between any directive no matter what their relationship (siblings, parent, or child). It performs hook ups through an
 * ID system, if two pieces of infrastructure .connect() with the same tag, they will be linked in a way that whenever the
 * hose-like infrastructure sprays data, the pipes-like infrastructure will receive, by default, in the order,
 * which they were connected, and then the spout at the end through events.
 */
export class DataPlumberService {

  private _pipeline: Pipeline = {}; //Initialize an empty pipeline
  private _tags: string[] = []; // Initialize an empty ledger for tags of pipelines
  public readonly SPRAY: string = "spray"; // Default data event name for hose-like infrastructure.
  private _dataSprayHistory: DataSprayHistory = {}; // Initialize an empty dataSprayHistory.

  /**
   * @overload
   * @description  The connect method is an overloaded method. This overload of the method is intended to connect
   * spout-like infrastructure. This will call the given callback function whenever  a hose with the same tag sprays
   * data. Most of the time, these callback function will want to bind to it's local context before being passed in as
   * parameter.
   * @param {string} tag The id/tag
   * @param {(dataSprayed:any)=> void} callbackFunction The function to execute when the hose-like infrastructure starts spraying data
   * @returns {void}
   */
  public connectSpout(tag: string, callback: (dataSprayed: any)=> void): void {
    /**
     * Add this callback to the tag pipeline.
     */
    if(typeof this._pipeline[tag] != "undefined") {
      // If a hose has already been connected
      (this._pipeline[tag]).push(callback);
      console.log(`Spout "${tag}" connected successfully.`);
    }
    else {
      // If not
      // Else if the hose-like infrastructure doesn't have an established pipeline...
      // Establish a pipeline with the hose
      this._pipeline[tag] = new Array<(dataSprayed: any)=> void> ();
      (this._pipeline[tag]).push(callback);
      console.log(`Spout "${tag}" connected successfully.`);
    }
  }

  /**
   * @overload
   * @description The connect method is an overload method. This overload of the method is intended to connect hose-like infrastructure.
   * The service will register the tag and establish a pipeline. If a hose already established a pipeline, a warning will be thrown and
   * nothing will happen. It has a type parameter for EventEmitter.
   * @param {string} tag The tag/id
   * @param {EventEmitter} hose The hose component to connect
   * @returns {void}
   */
  public connectHose(tag:string, hose: EventEmitter): void {
    /**
     * Basically, if this tag belonging to this hose-like infrastructure has an established pipeline already...
     */
    if(typeof this._pipeline[tag] != "undefined") {
      // If a spout has been connected already...
      // This is a new instance of an eventEmitter
      hose.on(this.SPRAY, function(data:any) {
        this._dataSprayHistory[tag].push(data); // Keeps the spray history in case spouts join late
        this._pipeline[tag].forEach( (callbackFunction: (dataSprayed: any)=> void)=> {
          try {callbackFunction(data);}
          catch (error) {
            if (error instanceof TypeError) {
              console.log(`Error in one of the pipeline functions with something null or undefined. Assuming old infrastructure and deleting`);
              this._deleteFromInfrastructure(tag, callbackFunction);
              return;
            }
          }
          console.log(`Calling callback function in pipeline tagged "${tag}" with data below:`);
          console.log(data);
        });
      }.bind(this));
      // Log a warning and return void
      console.warn(`The hose like infrastructure tagged "${tag}" already has an established pipeline below:`);
      console.warn(this._pipeline[tag]);
      return;
    }
    else {
      // If no spout has been connected yet...
      // Else if the hose-like infrastructure doesn't have an established pipeline...
      // Establish a pipeline with the hose
      this._pipeline[tag] = new Array<(dataSprayed: any)=> void> ();
      // This is a new instance of an eventEmitter
      hose.on(this.SPRAY, function(data:any) {
        this._dataSprayHistory[tag].push(data); // Keeps the spray history in case spouts join late
        this._pipeline[tag].forEach( (callbackFunction: (dataSprayed: any)=> void)=> {
          try {callbackFunction(data);}
          catch (error) {
            if (error instanceof TypeError) {
              console.log(`Error in one of the pipeline functions with something null or undefined. Assuming old infrastructure and deleting`);
              this._deleteFromInfrastructure(tag, callbackFunction);
              return;
            }
          }
          console.log(`Calling callback function in pipeline tagged "${tag}" with data below:`);
          console.log(data);
        });
      }.bind(this));
    }
  }

  /**
   * @description console.logs the state of the current infrastructure
   * @returns {void}
  */
 public printInfrastructure(): void {
   // First let's iterate through each pipeline
   for( let tag in this._pipeline ) {
     console.log (`Pipeline associsted with tag "${tag}":`);
     // Now let's iterate through pipeline
     for ( let callbackFunction in this._pipeline[tag] ){console.log(callbackFunction);}
     // Once all of the callbacks within this pipeline are iterated through, the end of the pipeline is reached
     console.log(`End of pipeline "${tag}"`);
   }
   
 }

 /**
  * @description Provided a tag of the pipeline, returns an array of all the data sprayed by the hose-like infrastructure so far.
  * @param {string} tag
  * @returns {Array<any>} dataHistory The history of emits by hose-like infrastructure in the given pipeline specified by it's
  * tag provided by one of the parameters
  */
 public getSprayedData(tag:string): Array<any> | undefined {
   // First, check if the tag is associated with a pipeline
   if (typeof this._pipeline[tag] == "undefined") {
    // If this tag is unassociated with a pipeline...
    return undefined;
   }
   else {return this._dataSprayHistory[tag];}
   // If the tag is associated with a pipeline
 }

 private _deleteFromInfrastructure(tag: string, callbackFunction: (dataSprayed: any)=> void, ): void {
  this._pipeline[tag].splice((this._pipeline[tag]).indexOf(callbackFunction), 1);
  console.log("Old spout no longer in use removed successfully");
 }

  constructor() { }
}
