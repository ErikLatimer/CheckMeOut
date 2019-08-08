// Everything pretty much after component is used to make the token system function properly and as intended.
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, DoCheck } from '@angular/core';
// Used for FormControl class
import { FormControl, Validators, FormGroup } from '@angular/forms';
// Utilizes PostGreSQL for storage of data captured in this form component (information like name of the person checking out, their destination, etc.)
import { PostGrestService } from './../../lib/post-grest.service';
/**
 * This component utilizes the Material(Mat) Angular Software Kit to provide a calendar view date picker to the user within the checkout form.
 */
import { RegisterRequest, PassRequest, TokenRegistry} from './../../../lib/TokenInterfaces';
/**
 * This service is needed to receive the uuid of the document of interest, scanned by the qrScannerComponent
 */
import { DataPlumberService } from './../../lib/data-plumber.service';
// For the Token System
import { DataSpout } from './../../lib/dataSpout';
import uuidv4 from 'uuid/v4';

import { CheckOutSettings } from './../checkOutSettings';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-check-out-form',
  templateUrl: './check-out-form.component.html',
  styleUrls: ['./check-out-form.component.css']
})

/**
 * The check-out form component provides a screen encompassing stand-alone page dedicated to acquiring needed information in reference
 * to the checkout item. Once all the check-out information is acquire, the component then utilizes the PostGrest angular service to
 * store the acquired information within the database. Don't forget the *ngIf="isActive" binding in the app.component.html! Extends DataSpout
 */
export class CheckOutFormComponent extends DataSpout implements OnInit  {

  /**
   * Apart of the Token System. Bind in parent component to [thisoutput] to some function that's local to the parent component
   * "someFunction($event)". Most output in Angular are EventEmmiters, that's why someFunction in the parent component
   * must accept an Event object.
   * 
   * Using the @Output decorator, we will be able to notify the parent component AppComponent, when it wants to register as a token bearer.
   */
  @Output() registerAsTokenBearer: EventEmitter<RegisterRequest> = new EventEmitter<RegisterRequest>(); 
  /**
   * Using the @Output decorator, we will be able to notify the parent component AppComponent, when it wants to pass control
   * (the token) to another component.
   */
  @Output() passToken: EventEmitter<PassRequest> = new EventEmitter<PassRequest>();

  @Input() registryCopy: TokenRegistry;

  /**
   * The Object returned by the PostGrest service when querying a document by ID. All propertied of this object are
   * columns in the database
   */
  private _solutionOrComponentTarget: Object = {};

  // For Token System
  private readonly tokenBearerUUID: string = uuidv4();
  // For Token System
  private readonly tokenBearerName: string = "checkoutForm";

  public isActive: boolean = false;

  /**
   * MatDatepickerInput is apart of the MatDatePicker api, and is "Directive used to connect an input to a MatDatePicker." quite literally.
   * And by input, they are referring to an <input> element. Even though the api says the selector is
   * input[matDatePicker], it's actually used like [matDatePicker]="<template reference variable of mat-datepicker element>."
   * I guess input here is just used to indicate the html element
   *
   * To fully utilize MatDatePicker input, utilize angular's bindings to bind to the inputs and outputs specified in the api.
   */

  public checkOutFormGroup: FormGroup;
  
  public minimumDate_Start: Date;
  public maximumDate_Start: Date;
  public minimumDate_End: Date;
  public maximumDate_End: Date;

  public readonly MDIACO: number = CheckOutSettings.getMaxDaysInAdvanceItemCanBeCheckedOut(); // Max Days in Advance Item can be Checked Out
  public readonly MDCO: number = CheckOutSettings.getMaxDaysItemCanBeCheckedOut(); // Max Days Checked Out
  public readonly MDR: number = CheckOutSettings.getMaxDaysReserved(); // Max Days Reserved
  
  public constructor(private _dataPlumberService: DataPlumberService, private _postGrestService: PostGrestService) {
    super(
      _dataPlumberService,
      function(dataSprayed: any) {
        console.log("QR component emitted:");
        console.log(dataSprayed);
      },
      'checkout'
    );
  }

  /**
   * The ngOnInit here is not used for much other then the token system. It's also used to retrieve passed emissions from the qrComponent
   * to establish the targetDocument targeted for checkout during this session. Also used to set the minimum date for the calendar component
   * to the time onf instantiation.
   */
  public ngOnInit(): void {
    this.registerAsTokenBearer.emit ({
      tokenBearerUUID: this.tokenBearerUUID,
      tokenBearerName: this.tokenBearerName,
    });
    /**
     * Sets the minimum date of the start date calendar to around the time of instantiation of this form component using the Date object, native to Javascript.
     */
    const currentDate: Date = new Date();
    console.log("​CheckOutFormComponent -> currentDate", currentDate);
    console.log(`currentDate in milliseconds ${currentDate.getTime()}`);
    this.minimumDate_Start = currentDate;

    /**
     * Sets the maximum date of the start date calendar to the maximum time in advance for a reservation from around the time of instantiation of this form
     * component, specified in CheckOutSettings. Uses CheckOutSettings method to arrive at a date.
     */
    console.log("​CheckOutFormComponent -> CheckOutSettings.getMaxTimeInAdvanceForReservation(currentDate)", CheckOutSettings.getMaxTimeInAdvanceForCheckOut(currentDate));
    this.maximumDate_Start = CheckOutSettings.getMaxTimeInAdvanceForCheckOut(currentDate);
    /**
     * Initialize the form group here
     */
    this.checkOutFormGroup = new FormGroup( {
      'nameControl': new FormControl(null, Validators.required),
      'destinationControl': new FormControl(null, Validators.required),
      'startDateControl': new FormControl(null, Validators.required),
      'endDateControl': new FormControl(null, Validators.required)
    });
  }

  /**
   * @public
   * @description A function bound to the @ Output dateChange: EventEmitter<MatDatepickerInputEvent<D>> of the input element that has the matDatePickerInput
   * (<[matDatePickerInput]="<sometemplatevariable">) directives. Gets the target MatDatePickerInput from event, retrieves it's value,
   * and set's minimumDate_End to this date. Also, changes the maximumDate_End to the maximum allowed checkout time specified by CheckOutSettings. Also uses
   * CheckOutSettings.
   * @param { MatDatePickerInputEvent<Date> } event The event fired from directive.
   * @returns { void }
   */
  public dateChanged_Start( event: MatDatepickerInputEvent<Date> ): void {
    console.log("event.target.value:");
    console.log(event.target.value);
    this.minimumDate_End = event.target.value; // Sets the minimum date of the end date calendar
    this.maximumDate_End = CheckOutSettings.getMaxTimeItemCanBeCheckedOut(event.target.value);
		console.log("​CheckOutFormComponent -> CheckOutSettings.getMaxTimeItemCanBeCheckedOut(event.target.value)", CheckOutSettings.getMaxTimeItemCanBeCheckedOut(event.target.value));
    // Sets the maximum date of the end date calendar
  }

  /**
   * The ngOnChanges here is not used here for much other than the token system.
  */
 public ngOnChanges(change: SimpleChanges) {
   /**
   setTimeout(function() {
     console.log(this.registryCopy);
     console.log(this.tokenBearerUUID);
     console.log(this.registryCopy[this.tokenBearerUUID.toString()]);
     this.isActive = this.registryCopy[this.tokenBearerUUID]; // Checks to make sure that the token in the registry wasn't passed to it
     if (this.isActive) {
       console.log("HELLO");
       this._activate();
     }
     else {
       console.log("NOPE");
     }
   }.bind(this), 1);
   **/
 }

 public ngDoCheck() {
   if (this.isActive != this.registryCopy[this.tokenBearerUUID]) {
    setTimeout(function() {
      console.log(this.registryCopy);
      console.log(this.tokenBearerUUID);
      console.log(this.registryCopy[this.tokenBearerUUID.toString()]);
      this.isActive = this.registryCopy[this.tokenBearerUUID]; // Checks to make sure that the token in the registry wasn't passed to it
      if (this.isActive) {
        console.log("HELLO");
        this._activate();
      }
      else {
        console.log("NOPE");
      }
    }.bind(this), 1);
   }
 }

 private _activate(): void {
   console.log("Checkout form activating...");
   const emitHistory: Array<any> | undefined = this.getSprayHistory();
    /**
     * If there is an emitHistory, or in other words, if QRComponent emitted data BEFORE initialization of this component...
     * which it should be if everything is behaving as intended
     */
    if (typeof emitHistory != "undefined") {
      // Get the most recent data emitted by the QR component
      this._solutionOrComponentTarget = emitHistory[emitHistory.length-1];
      console.log(`Most recent emitted data in history:`);
      console.log(this._solutionOrComponentTarget);
    }
    else {
      console.log("Emit history is undefined");
    }
 }

 public formSubmitted(event: Event) {
   console.log(this.checkOutFormGroup.value);
   this.passToken.emit({
     targetTokenBearerName: "qrscanner",
     tokenBearerUUID: this.tokenBearerUUID 
   });
 }

}
