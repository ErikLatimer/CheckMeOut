
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter, SimpleChange } from '@angular/core';
import { NgClassBinding } from './../NgClassBinding'; 
import { ScreenDimensionService } from './../screen-dimension.service';

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.component.html',
  styleUrls: ['./alert-error.component.css']
})

/**
 * The alert error component provides and easy and seamless way to ass an error into your application with optional animations.
 * To start the alert, simply property bind to the alert error component's active property within your parent component's html,
 * along with the optional animationTypeIn, animationTypeOut, and animate @ Input() properties all for enabling animations. 
 */
export class AlertErrorComponent implements OnInit {
  
  @Input() active: boolean = false; // This property is bound to the *ngIf of the div within it's template.
  @Input() text: string = "AN ERROR HAS OCCURRED"; // This property is interpolated to the text within the alert in the HTML template
  @Input() alertType: string = "alert-danger"; // Defaults to alert-dange
  @Input() animationTypeIn: string = "fadeIn"; // Defaults to fadeIn
  @Input () animationTypeOut: string = "fadeOut" // Defaults to fadeOut
  @Input () animate: boolean = false;
  @Output () animationEnded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public ngClassBinding: NgClassBinding = new NgClassBinding();
  private _ERROR_ALERT_TIME_MILLISECONDS = 3300;
  private _FADE_OUT_TIME_MILLISECONDS = 1000;

  public left: string;
  public top: string;

  constructor(private _screenDimensionService: ScreenDimensionService) { }

  /**
   * Sense ngOnInit only happens once during the whole lifespan of a PWA, it sets the the initial classes of the app-alert-error element.
   */
  public ngOnInit(): void {

    this._screenDimensionService.subscribeToOrientationChange(function () {
      this._positionAlertErrorCheckMeOut();
    }.bind(this));
    this._screenDimensionService.subscribeToResize(function () {
      this._positionAlertErrorCheckMeOut();
    }.bind(this));
    this._positionAlertErrorCheckMeOut();


    /**
     * The below section sets the necessary classes for the MDBoostrap css sheet to style our element as an alert.
     */
    this.ngClassBinding.setClass("alert", true);
    this.ngClassBinding.setClass(this.alertType, true);
    /**
     * Sets the animation type for the entry of the component. Sense ngOnInit only fires once, this is necessary because upon the first activation,
     *  we want the animation type to be set to entry, not exit.
     */
    this.ngClassBinding.setClass(this.animationTypeIn, true);
    /**
     * Sets the animation type to un-present for the exit of the component. Sense ngOnInit only fires once, this is necessary because upon the first activation,
     *  we want the animation type to be set to entry, not exit.
     */
    this.ngClassBinding.setClass(this.animationTypeOut, false);
    // Sets the .animated class to whatever the default/initial value of animated is.
    this.ngClassBinding.setClass("animated", this.animate);
  }

  /**
   * ONLY TWO METHODS NEEDED TO BE INCLUDED IN THE USING COMPONENT TO USE ALERT ERROR
   * 
   * public startError(): void {
    console.log("Start Error called...");
    this.activateAlertError = true;
    this.animateAlertError = true;
  }

  public endError(event: EventEmitter<boolean>): void {
    console.log("Animation for error ended event received, setting activateAlertError to false and animateAlertError to false...");
    this.activateAlertError = false;
    this.animateAlertError = false;
  }
   */

  /**
   * Searched for changes ANY of the variables, and performs logic according to those changes. The component will first look for a change in active, because
   * you don't want to animate something and have the animation play out BEFORE it's even displayed. Then, it checks to see if the text for the alert that is to
   * be displayed within the alert has changed, because besides the alert actually displaying, the second most important thing is to display the right text.
   * Next it checks the type of alert.
   * Then, it look for a change in animationTypeIn, because you don't want to add the <animated> class before you have the right animation lined up or
   * else you will begin the animation playing the wrong type of animation. Then it checks animationTypeOut for the same reason. Finally, check
   * the animate variable to begin component animation.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    /**
     * SimpleChanges is an indexable type, indexable by @ Input property names. SimpleChanges only includes property names that have changed values.
     * SimpleChanges returns a SimpleChange object, that represents the change in the @ Input property, denoted by the property name. It has
     * properties previousValue, currentValue and a boolean firstChange.
     */
    let simpleChange: SimpleChange;
    // Loop through all the changed property names
    for (let propertyName in changes) {
      // Now access the simple change through indexable type changes...
      simpleChange = changes[propertyName];
      // Look for a change in active
      if (propertyName == "active") {
        console.log(`Alert-Error activated status has went from "${simpleChange.previousValue}" to "${simpleChange.currentValue}"`);
        if (simpleChange.currentValue) {
          console.log("Alert-Error component activated.");
          console.log("Setting the timeout for it's deactivation...");
          // Use onAnimation End function to deactivate timer...
          setTimeout(function() {
            this.onAnimationEnd();
          }.bind(this),this._ERROR_ALERT_TIME_MILLISECONDS);
        }
        else {console.log("Alert-Error component deactivated.");}
      }
      // Look for a change in text
      if (propertyName == "text") {
        console.log(`Alert-Error text has changed from "${simpleChange.previousValue}" to "${simpleChange.currentValue}"`);
      }

      // Look for a change in the Alert type
      if (propertyName == "alertType") {
        const classStatus = this.ngClassBinding.classIsActive(simpleChange.previousValue);
        this.ngClassBinding.removeClass(simpleChange.previousValue);
        // ...and then replaced with the new, current alert type.
        this.ngClassBinding.setClass(simpleChange.currentValue, classStatus);
        console.log(`Alert-Error type changed from "${simpleChange.previousValue}" to "${simpleChange.currentValue}"`);
      }

      // Now look for a change in animation type in...
      if (propertyName == "animationTypeIn") {
        /**
         * If animationTypeIn has completely changed, sense the animation type is just a class, the previous animation class needs to be removed from
         * the class list of the component.
         */
        const classStatus = this.ngClassBinding.classIsActive(simpleChange.previousValue);
        this.ngClassBinding.removeClass(simpleChange.previousValue);
        // ...and then replaced with the new, current animation type.
        this.ngClassBinding.setClass(simpleChange.currentValue, classStatus);
        console.log(`Animation type In for Alert-Error has changed from "${simpleChange.previousValue}" to "${simpleChange.currentValue}"`);
      }
      // Now look for a change in animation type out
      if (propertyName == "animationTypeOut") {
        /**
         * If animationTypeOut has completely changed, sense the animation type is just a class, the previous animation class needs to be removed from
         * the class list of the component.
         */
        const classStatus = this.ngClassBinding.classIsActive(simpleChange.previousValue);
        this.ngClassBinding.removeClass(simpleChange.previousValue);
        // ...and then replaced with the new, current animation type.
        this.ngClassBinding.setClass(simpleChange.currentValue, classStatus);
        console.log(`Animation type Out for Alert-Error has changed from "${simpleChange.previousValue}" to "${simpleChange.currentValue}"`);
      }

      // Now check if animated changed...
      if (propertyName == "animate") {
        this.ngClassBinding.setClass("animated", simpleChange.currentValue);
        console.log(`Alert-Error animated status has went from "${simpleChange.previousValue}" to "${simpleChange.currentValue}`);
        if (simpleChange.currentValue) {console.log("Alert-Error component is now animated.");}
        else {console.log("Alert-Error component is now unanimated.");}
      }
    }
  }

  /**
   * The onAnimateEnd method event binds in this component's HTML to the (animationend) event, and resets the component when this method's called
   */
  public onAnimationEnd(): void {
    /**
     * First, sets a fade out animation the occur after a set amount of time for the user to view the message. Also, destroys the initial
     * animation, because the value of the class changed.
     */
      // After a set number of milliseconds...
      // If the TypeIn animation just finished up...
      if ( this.ngClassBinding.classIsActive(this.animationTypeIn) ) {
        // Then remove the animationTypeIn class and replace with the animationTypeOut class
        this.ngClassBinding.setClass(this.animationTypeIn, false);
        this.ngClassBinding.setClass(this.animationTypeOut, true);
        setTimeout(function() {
          this.onAnimationEnd();
        }.bind(this), this._FADE_OUT_TIME_MILLISECONDS);
      }
      else if (this.ngClassBinding.classIsActive(this.animationTypeOut)) {
        // If the TypeOut animation just finished up...
        // Then remove the animationTypeOut class and replace with the animationTypeIn class
        this.ngClassBinding.setClass(this.animationTypeIn,true);
        this.ngClassBinding.setClass(this.animationTypeOut, false);
        // ...and then set the alert component to inactive
        console.log("Setting the active property of the Alert-Error component manually to false");
        this.active = false;
        this.animate = false;
        // Emitting animationEnded...
        console.log("Emitting animation ended...");
        this.animationEnded.emit(true);
      }

  }

  private _positionAlertErrorCheckMeOut() {
    this.left = `${this._screenDimensionService.getInnerWindowWidth() / 2}px`
		//console.log("​AlertErrorComponent -> private_positionAlertErrorCheckMeOut -> this._screenDimensionService.getInnerWindowWidth() / 2", this._screenDimensionService.getInnerWindowWidth() / 2);
    //this.left = `${document.getElementById("qrScannerContainer").getBoundingClientRect().width / 2}px`;
    //console.log("​AlertErrorComponent -> private_positionAlertErrorCheckMeOut -> document.getElementById(\"qrScannerContainer\").getBoundingClientRect().width", document.getElementById("qrScannerContainer").getBoundingClientRect().width);
    
    //console.log("​AlertErrorComponent -> private_positionAlertErrorCheckMeOut -> this.left", this.left);
    
    /**
    this.top = `${document.getElementById("qrScannerContainer").getBoundingClientRect().height * 0.10}px`;
		console.log("​AlertErrorComponent -> private_positionAlertErrorCheckMeOut -> document.getElementById(\"qrScannerContainer\").getBoundingClientRect().height", document.getElementById("qrScannerContainer").getBoundingClientRect().height);
    console.log("​AlertErrorComponent -> private_positionAlertErrorCheckMeOut -> this.top", this.top);
    **/
  }

}
