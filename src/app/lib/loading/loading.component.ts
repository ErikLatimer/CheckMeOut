
import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import {ngClassBinding} from '../../../lib/ngClassBinding';
import { ScreenDimensionService } from './../screen-dimension.service';

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
  public styleDisplayString: string = "";
  public styleTopString: string = "";
  public styleLeftString: string = "";

  constructor(private _hostElement: ElementRef, private _screenDimensionService: ScreenDimensionService) {super();}

  /**
   * On initialization of a new loader component, set the style binding to display:none
   * as to not take up any space on the present page before the official initialization
   */
  public ngOnInit() {
    // Set part of the style string to display:none
    this.styleDisplayString = "none";
    this._updateLoaderPosition();
    //this._screenDimensionService.subscribeToResize(function() {this._updateLoaderPosition();}.bind(this));
    this._screenDimensionService.subscribeToOrientationChange(function() {this._updateLoaderPosition();}.bind(this));
  }
  

  /**
   * @description This is needed because the loader component's styles cannot use transform translate because it is included
   * and tied up within it's animation styles and settings. SO we will have to manually set the position through direct DOM
   * access. Please refrain from using direct DOM access as this is not good practice in Angular, and should be avoided. Angular
   * provides ways to do this.
   */
  private _updateLoaderPosition() {
    if (
      (this._screenDimensionService.getOrientation() == this._screenDimensionService.LANDSCAPE_PRIMARY) ||
      (this._screenDimensionService.getOrientation() == this._screenDimensionService.LANDSCAPE_SECONDARY) 
    ) {
      this.styleLeftString = "250%";
      this.styleTopString = "-100%"
    }
    else if (
      (this._screenDimensionService.getOrientation() == this._screenDimensionService.PORTRAIT_PRIMARY) ||
      (this._screenDimensionService.getOrientation() == this._screenDimensionService.PORTRAIT_SECONDARY) 
    ) {
      this.styleLeftString = "100%";
      this.styleTopString = "-22.5%";
    }
    else {
      console.error(`ERROR. Cannot update the position of the loader component under current unknown orientation "${this._screenDimensionService.getOrientation()}"`);
    }
    
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
    this.styleDisplayString = "block";
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
    this.styleDisplayString = "none";
  }

  public onAnimationEnd(event: Event): void {
    /**
    console.log("Loader Animation ended.");
    if (this.classIsActive(this.MDB_ANIMATION_SLIDEOUTDOWN)) {
      this.styleDisplayString = "none";
      this.removeClass(this.MDB_ANIMATION_SLIDEOUTDOWN);
    }
    **/
  }

}

