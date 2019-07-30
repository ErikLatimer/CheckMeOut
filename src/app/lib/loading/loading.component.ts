import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {ngClassBinding} from '../../../lib/ngClassBinding';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})

/**
 * !!! WE'LL GO FOR THE ANIMATIONS LATER
 * !!! TO ENABLE UNCOMMENT THIS.SET CLASS IN THE ONINTIALIZATION CLASS
 * 
 */
/**
 * The loader component provides and easy and seamless way to add a spinning loading
 * icon with optional animation to your application. To start the loader, simply
 * property bind to the loader component's init and destroy properties within your
 * html. Set init to true to initialize the loader. Set destroy to true to destroy
 * the loader. Setting both to true will result in the first taking precedence.
 */
export class LoadingComponent extends ngClassBinding implements OnInit {

  @Input() init: boolean;
  @Input() destroy: boolean;
  // Inherited from base class
  // public ngClassBinding: ngClasses = {}
  private readonly MDB_ANIMATION_SLIDEINUP: string = "slideInUp";
  private readonly MDB_ANIMATION_SLIDEOUTDOWN: string = "slideOutDown";
  public styleString: string = "";
  constructor() {super();}

  /**
   * On initialization of a new loader component, set the style binding to display:none
   * as to not take up any space on the present page before the official initialization
   */
  public ngOnInit() {
    // Set part of the style string to display:none
    this.styleString = "none";
  }

  public ngOnChanges(changes: SimpleChanges) {
    for (let propertyName in changes) {
      let changedValue = changes[propertyName];
      if (propertyName == "init") {
        if (changedValue.currentValue == true) {this.onInitialization();}
      }
      else if (propertyName == "destroy") {
        if (changedValue.currentValue == true) {this.onDestruction();}
      }
      else {
        console.warn(`Property name "${propertyName}" is unrecognized.`);
      }
    }
  }

  /**
   * On initialization by the user, add the class slideInUp. if the slideOutDown class is active, remove that class
   */
  private onInitialization(): void {
    console.log("Loading Initialized...");
    // Remove the slideOutDown class if possible
    if (this.classIsActive(this.MDB_ANIMATION_SLIDEOUTDOWN)) {this.removeClass(this.MDB_ANIMATION_SLIDEOUTDOWN);}
    // Add the SlideInUp class.
    //this.setClass(this.MDB_ANIMATION_SLIDEINUP, true);
    // Unset display:none so the client can see the loading component
    this.styleString = "block";
  }

  /**
   * On destruction by the user, set the style string to animated slideOutDown. Remove the
   * slideInUp animation if possible.
   */
  private onDestruction(): void {
    console.log("Destruction initialized...");
    // Remove the slideInUp class if possible
    if (this.classIsActive(this.MDB_ANIMATION_SLIDEINUP)){this.removeClass(this.MDB_ANIMATION_SLIDEINUP);}
    // Now add the slideOutDown class
    // this.setClass(this.MDB_ANIMATION_SLIDEOUTDOWN, true);
    this.styleString = "none";
  }

  public onAnimationEnd(event: Event): void {
    /**
    console.log("Loader Animation ended.");
    if (this.classIsActive(this.MDB_ANIMATION_SLIDEOUTDOWN)) {
      this.styleString = "none";
      this.removeClass(this.MDB_ANIMATION_SLIDEOUTDOWN);
    }
    **/
  }

}

