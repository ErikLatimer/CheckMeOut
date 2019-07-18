import { Injectable } from '@angular/core';
import ratio from 'aspect-ratio';
import { EventEmitter } from 'events';

interface ScreenDimensionsOriental {
  // 0 = WIDTH; 1 = HEIGHT
  [orientation: number]: number[];
}

interface ScreenDimensions {
  width: number,
  height: number,
}

interface WindowDimensions {
  width: number,
  height: number
}

interface WindowDimensionsOriental {
  // 0 = WIDTH; 1 = HEIGHT
  [orientation: number]: number[];
}

enum Dimension {
  Width = 0,
  Height = 1,
}

enum Orientation {
  Landscape_Primary = -90,
  Landscape_Secondary = 90,
  Portrait_Primary = 0,
  Portrait_Secondary = 180,
}

@Injectable({
  providedIn: 'root',
})

// All assuming screen width and screen height are based on device in portrait mode, 
// and screen width and height doesn't change with device orientation change...
export class ScreenDimensionService {
  private orientalScreenDimensions: ScreenDimensionsOriental = undefined;
  private orientalInnerWindowDimensions: WindowDimensionsOriental = undefined;
  private windowInnerDimensions: WindowDimensions = undefined;
  private screenDimensions: ScreenDimensions = undefined;
  private currentOrientation: string | number = undefined;
  private deviceIsOriental: boolean = undefined;
  private orientationChangeProcessed: EventEmitter = new EventEmitter();
  private resizeProcessed: EventEmitter = new EventEmitter();
  init() {
    // Let's first determine if the current browser even supports orientation
    // Taking a portrait orientation as reference
    // The screen object uses portrait as reference
    // The window object uses whatever the current orientation is as reference
    let initialOrientationType = (typeof window.orientation);
    if (initialOrientationType == "undefined") {
      console.log("The current browser does not support the orientation api.");

      this.screenDimensions = {
        width: screen.width,
        height: screen.height,
      };

      this.windowInnerDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      console.log(this.windowInnerDimensions);

      this.deviceIsOriental = false;
    }
    else {
      let initialOrientation = window.orientation;
      this.currentOrientation = initialOrientation;
      console.log("The current browser supports the orientation api.");
      this.windowInnerDimensions = null;
      this.screenDimensions = null;

      this.deviceIsOriental = true;
      /**
       * If the screen object is based on Portrait mode
       * &&
       * If the screen object does not change when orientation changes
       * then
       * Orientation is irrelevant for determining screen dimensions
       */
      this.orientalScreenDimensions = {
        // If the screen is in portrait, the width is the width
        // If the screen is in landscape, the height is the height
        // Portrait Primary
        0: [screen.width, screen.height],

        // If the screen is in portrait, the width is the width
        // If the screen is in landscape, the height is the heigh
        // Portrait Secondary
        180: [screen.width, screen.height],

        // If the screen is in landscape, the width is the height
        // If the screen is in landscape, the height is the width
        // Landscape Secondary
        90: [screen.height, screen.width],
      };
      // This is separate because Typescript has a problem with the unary operator
      // negative sign within a object literal property assignment
      // Landscape Primary
      this.orientalScreenDimensions[Orientation.Landscape_Primary] = [
            screen.height, // If the screen is in landscape, the width is the height
            screen.width, // If the screen is in landscape, the height is the width
      ];

      switch (<number>initialOrientation) {
        case Orientation.Landscape_Primary: {
          this.orientalInnerWindowDimensions = {
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          // Landscape Secondary
          90: [window.innerWidth, window.innerHeight],

          // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
          // Portrait Primary
          0: [window.innerHeight, window.innerWidth],

          // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
          // Portrait Secondary
          180: [window.innerHeight, window.innerWidth],
          };
          // This is separate because Typescript has a problem with the unary operator
          // negative sign within a object literal property assignment
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          // Landscape Primary
          this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
            window.innerWidth,
            window.innerHeight,
          ];
          break;
        }

        case Orientation.Landscape_Secondary: {
          this.orientalInnerWindowDimensions = {
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          // Landscape Secondary
          90: [window.innerWidth, window.innerHeight],

          // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
          // Portrait Primary
          0: [window.innerHeight, window.innerWidth],

          // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
          // Portrait Secondary
          180: [window.innerHeight, window.innerWidth],
          };
          // This is separate because Typescript has a problem with the unary operator
          // negative sign within a object literal property assignment
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          // Landscape Primary
          this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
            window.innerWidth,
            window.innerHeight,
          ];
          break;
        }

        case Orientation.Portrait_Primary: {
          this.orientalInnerWindowDimensions = {
          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          // Portrait Primary
          0: [window.innerWidth, window.innerHeight],

          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          // Portrait Secondary
          180: [window.innerWidth, window.innerHeight],

          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          // Landscape Secondary
          90: [window.innerHeight, window.innerWidth],
          };
          // This is separate because Typescript has a problem with the unary operator
          // negative sign within a object literal property assignment
          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          // Landscape Primary
          this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
            window.innerHeight, 
            window.innerWidth, 
          ];
          break;
        }

        case Orientation.Portrait_Secondary: {
          this.orientalInnerWindowDimensions = {
          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          // Portrait Secondary
          180: [window.innerWidth, window.innerHeight],

          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          // Portrait Primary
          0: [window.innerWidth, window.innerHeight],

          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          // Landscape Secondary
          90: [window.innerHeight, window.innerWidth],
          };
          // This is separate because Typescript has a problem with the unary operator
          // negative sign within a object literal property assignment
          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          // Landscape Primary
          this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
            window.innerHeight, 
            window.innerWidth, 
          ];
          break;
        }
        default: {
          console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
          break;
        }
      }
    }
    console.log("Screen Dimension Initialization Complete.");
  }

  constructor() {}

  _test(): void {
    console.log(`Device is Oriental: ${this.deviceIsOriental}`);
    console.log(`Screen Dimensions Width: ${this.screenDimensions.width}`);
    console.log(`Screen Dimensions Height: ${this.screenDimensions.height}`);
    console.log(`Window Inner Dimensions Width: ${this.windowInnerDimensions.width}`);
    console.log(`Window Inner Dimensions Height: ${this.windowInnerDimensions.height}`);
    this.listenToResize();
    this.subscribeToResize(()=> {
      console.log("Resized event processed");
    });
  }

  listenToOrientationChange(): void {
    window.addEventListener(
      "orientationchange", <EventListenerOrEventListenerObject><unknown>this.onOrientationChange.bind(this)
    );
  }

  onOrientationChange(event: Event): void {
    this.currentOrientation = (<Window>event.currentTarget).orientation;
    this.orientationChangeProcessed.emit('processed');
  }

  subscribeToOrientationChange(callbackFunction: EventListener) {
    this.orientationChangeProcessed.on('processed', callbackFunction);
    console.log("Successfully subscribed to orientation change.");
   }


  listenToResize(): void {
    window.addEventListener(
      'resize', <EventListenerOrEventListenerObject><unknown>this.onResize.bind(this)
    );
  }

  onResize(event: Event): void {   
    // If this resize event was caused by an orientation change instead of an ACTUAL resize...
    if(!(this.currentOrientation == ((<Window>event.currentTarget).orientation))) {
      // Then do nothing because onOrientationChange is supposed to handle that logic...
      return;
    }
    else { // If it was caused by a true resize...
      if (this.deviceIsOriental) {this.updateOrientalInnerWindowDimensionsOnResize(event);}
      else {
        this.windowInnerDimensions.width = (<Window>event.currentTarget).innerWidth;
        this.windowInnerDimensions.height = (<Window>event.currentTarget).innerHeight;
      }
    }
    this.resizeProcessed.emit('processed');
    /**
    // If this resize event was fired due to an orientation change...
    if (!(this.currentOrientation == window.orientation)) {
      this.windowInnerDimensions.width = (<Window>(event.target)).innerWidth;
      this.windowInnerDimensions.height = (<Window>(event.target)).innerHeight;
    }
    else {
      if (this.deviceIsOriental) {
        this.updateOrientalInnerWindowDimensionsOnResize(event);
      }
    }
    this.resizeProcessed.emit('processed');
    **/
  }

  subscribeToResize(callbackFunction: EventListener) {
    this.resizeProcessed.on('processed', callbackFunction);
    console.log("Successfully subscribed to resize.");
  }

  private updateOrientalInnerWindowDimensionsOnResize(event: Event): void {
    let orientation = (<Window>event.currentTarget).orientation;
    switch (<number>orientation) {
      case Orientation.Landscape_Primary: {
        this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Landscape_Secondary] = [
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Portrait_Primary] = [ 
          // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
          (<Window>(event.currentTarget)).innerHeight,
          (<Window>(event.currentTarget)).innerWidth,
        ];
        // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
        this.orientalInnerWindowDimensions[Orientation.Portrait_Secondary] = [
          (<Window>(event.currentTarget)).innerHeight, // If the screen is in landscape, the width is the current height
          (<Window>(event.currentTarget)).innerWidth, // If the screen is in landscape, the height is the current width
        ];
        break;
      }

      case Orientation.Landscape_Secondary: {
        this.orientalInnerWindowDimensions[Orientation.Landscape_Secondary] = [
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
          // If the screen is in landscape, then the current window width is the window width for landscape
          // If the screen is in landscape, then the current window height is the window height for landscape
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Portrait_Primary] = [
          // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
          (<Window>(event.currentTarget)).innerHeight,
          (<Window>(event.currentTarget)).innerWidth,
        ];
        this.orientalInnerWindowDimensions[Orientation.Portrait_Secondary] = [
          // If the screen is in landscape, then the current window height is the window width for portrait
          // If the screen is in landscape, then the current window width is the height for portrait
          (<Window>(event.currentTarget)).innerHeight,
          (<Window>(event.currentTarget)).innerWidth,
        ];
        break;
      }

      case Orientation.Portrait_Primary: {
        this.orientalInnerWindowDimensions[Orientation.Portrait_Primary] = [
          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Portrait_Secondary] = [
          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          (<Window>(event.currentTarget)).innerHeight, 
          (<Window>(event.currentTarget)).innerWidth, 
        ];
        this.orientalInnerWindowDimensions[Orientation.Landscape_Secondary] = [
          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          (<Window>(event.currentTarget)).innerHeight,
          (<Window>(event.currentTarget)).innerWidth,
        ];
        break;
      }

      case Orientation.Portrait_Secondary: {
        this.orientalInnerWindowDimensions[Orientation.Portrait_Secondary] = [
          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Portrait_Primary] = [
          // If the screen is in portrait, then the current window width is the window width for portrait
          // If the screen is in portrait, then the current window height is the window height for portrait
          (<Window>(event.currentTarget)).innerWidth,
          (<Window>(event.currentTarget)).innerHeight,
        ];
        this.orientalInnerWindowDimensions[Orientation.Landscape_Primary] = [
          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          (<Window>(event.currentTarget)).innerHeight,
          (<Window>(event.currentTarget)).innerWidth,
        ];
        this.orientalInnerWindowDimensions[Orientation.Landscape_Secondary] = [
          // If the screen is in portrait, then the current window height is the window width for landscape
          // If the screen is in portrait, then the current window width is the window height for landscape
          (<Window>(event.currentTarget)).innerHeight,
          (<Window>(event.currentTarget)).innerWidth,
        ];
        break;
      }
      default: {
        console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
        return;
        break;
      }
    }
  }

  public getInnerWindowWidth() {
    if (this.deviceIsOriental) {
      switch (<number>this.currentOrientation) {
        case Orientation.Landscape_Primary: {
          return (this.orientalInnerWindowDimensions[Orientation.Landscape_Primary])[Dimension.Width];
          break;
        }
        case Orientation.Landscape_Secondary: {
          return (this.orientalInnerWindowDimensions[Orientation.Landscape_Secondary])[Dimension.Width];
          break;
        }
        case Orientation.Portrait_Primary: {
          return (this.orientalInnerWindowDimensions[Orientation.Portrait_Primary])[Dimension.Width];
          break;
        }
        case Orientation.Portrait_Secondary: {
          return (this.orientalInnerWindowDimensions[Orientation.Portrait_Secondary])[Dimension.Width];
          break;
        }
        default: {
          console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
          return null;
          break;
        }
      }
    }
    else {return this.windowInnerDimensions.width;}
  }

  public getInnerWindowHeight() {
    if (this.deviceIsOriental) {
      switch (<number>this.currentOrientation) {
        case Orientation.Landscape_Primary: {
          return (this.orientalInnerWindowDimensions[Orientation.Landscape_Primary])[Dimension.Height];
          break;
        }
        case Orientation.Landscape_Secondary: {
          return (this.orientalInnerWindowDimensions[Orientation.Landscape_Secondary])[Dimension.Height];
          break;
        }
        case Orientation.Portrait_Primary: {
          return (this.orientalInnerWindowDimensions[Orientation.Portrait_Primary])[Dimension.Height];
          break;
        }
        case Orientation.Portrait_Secondary: {
          return (this.orientalInnerWindowDimensions[Orientation.Portrait_Secondary])[Dimension.Height];
          break;
        }
        default: {
          console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
          return null;
          break;
        }
      }
    }
    else {return this.windowInnerDimensions.height;}
  }

  public getScreenHeight(): number {
    if (this.deviceIsOriental) {
      switch (<number>this.currentOrientation) {
        case Orientation.Landscape_Primary: {
          return (this.orientalScreenDimensions[Orientation.Landscape_Primary])[Dimension.Height];
          break;
        }
        case Orientation.Landscape_Secondary: {
          return (this.orientalScreenDimensions[Orientation.Landscape_Secondary])[Dimension.Height];
          break;
        }
        case Orientation.Portrait_Primary: {
          return (this.orientalScreenDimensions[Orientation.Portrait_Primary])[Dimension.Height];
          break;
        }
        case Orientation.Portrait_Secondary: {
          return (this.orientalScreenDimensions[Orientation.Portrait_Secondary])[Dimension.Height];
          break;
        }
        default: {
          console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
          return null;
          break;
        }
      }
    }
    else {return this.screenDimensions.height;}
  }

  public getScreenWidth(): number {
    if (this.deviceIsOriental) {
      switch (<number>this.currentOrientation) {
        case Orientation.Landscape_Primary: {
          return (this.orientalScreenDimensions[Orientation.Landscape_Primary])[Dimension.Width];
          break;
        }
        case Orientation.Landscape_Secondary: {
          return (this.orientalScreenDimensions[Orientation.Landscape_Secondary])[Dimension.Width];
          break;
        }
        case Orientation.Portrait_Primary: {
          return (this.orientalScreenDimensions[Orientation.Portrait_Primary])[Dimension.Width];
          break;
        }
        case Orientation.Portrait_Secondary: {
          return (this.orientalScreenDimensions[Orientation.Portrait_Secondary])[Dimension.Width];
          break;
        }
        default: {
          console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
          return null;
          break;
        }
      }
    }
    else {return this.screenDimensions.width;}
  }



}