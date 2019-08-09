import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter, SimpleChange } from '@angular/core';
import { NgClassBinding } from './../NgClassBinding'; 

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
  @Input() animationTypeIn: string = "fadeIn"; // Defaults to fadeIn
  @Input () animationTypeOut: string = "fadeOut" // Defaults to fadeOut
  @Input () animate: boolean = false;
  //@Output () animationEnded: EventEmitter<boolean>;

  public ngClassBinding: NgClassBinding = new NgClassBinding();
  private _ERROR_ALERT_TIME_MILLISECONDS = 3000;


  constructor() { }

  /**
   * Sense ngOnInit only happens once during the whole lifespan of a PWA, it sets the the initial classes of the app-alert-error element.
   */
  public ngOnInit(): void {
    /**
     * The below section sets the necessary classes for the MDBoostrap css sheet to style our element as an alert.
     */
    this.ngClassBinding.setClass("alert", true);
    this.ngClassBinding.setClass("alert-danger", true);
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
   * Searched for changes ANY of the variables, and performs logic according to those changes. The component will first look for a change in active, because
   * you don't want to animate something and have the animation play out BEFORE it's even displayed. Then, it checks to see if the text for the alert that is to
   * be displayed within the alert has changed, because besides the alert actually displaying, the second most important thing is to display the right text.
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
        if (simpleChange.currentValue) {console.log("Alert-Error component activated.");}
        else {console.log("Alert-Error component deactivated.");}
      }
      // Look for a change in text
      if (propertyName == "text") {
        console.log(`Alert-Error text has changed from "${simpleChange.previousValue}" to "${simpleChange.currentValue}"`);
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
    setTimeout( function() {
      // After a set number of milliseconds...
      // If the TypeIn animation just finished up...
      if ( this.ngClassBinding.classIsActive(this.animationTypeIn) ) {
        // Then remove the animationTypeIn class and replace with the animationTypeOut class
        this.ngClassBinding.setClass(this.animationTypeIn, false);
        this.ngClassBinding.setClass(this.animationTypeOut, true);
      }
      else if (this.ngClassBinding.classIsActive(this.animationTypeOut)) {
        // If the TypeOut animation just finished up...
        // Then remove the animationTypeOut class and replace with the animationTypeIn class
        this.ngClassBinding.setClass(this.animationTypeIn, false);
        this.ngClassBinding.setClass(this.animationTypeOut, true);
        // ...and then set the alert component to inactive
        console.log("Setting the active property of the Alert-Error component manually to false");
        this.active = false;
        this.animate = false;
      }
    }.bind(this),this._ERROR_ALERT_TIME_MILLISECONDS);
  }

}
