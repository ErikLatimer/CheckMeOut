// Everything pretty much after component is used to make the token system function properly and as intended.
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
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

  public noneOfCheckOutUser: string = ""; // Something for the input element in the template to bind to
  public locationToWhenTheComponentIsGoing: string = ""; // Something for the input element in the template to bind to
  public dateRange: any = undefined; // Not sure what Angular bootstrap returns
  public constructor(private _dataPlumberService: DataPlumberService, private _postGrestService: PostGrestService) {
    super(_dataPlumberService, (dataSprayed: string)=> {console.log(`QR component emitted "${dataSprayed}"? Why?`);}, 'checkout');
  }

  /**
   * The ngOnInit here is not used for much other then the token system. It's also used to retrieve passed emissions from the qrComponent
   * to establish the targetDocument targeted for checkout during this session
   */
  public ngOnInit(): void {
    this.registerAsTokenBearer.emit ({
      tokenBearerUUID: this.tokenBearerUUID,
      tokenBearerName: this.tokenBearerName,
    });
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

  /**
   * The ngOnChanges here is not used here for much other than the token system.
  */
 public ngOnChanges(change: SimpleChanges) {
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

 private _activate(): void {
   console.log("Checkout form activating...");
 }
}
