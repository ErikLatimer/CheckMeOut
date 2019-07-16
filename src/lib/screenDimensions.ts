import ratio from 'aspect-ratio';

interface ScreenDimensionsOrientation {
  // 0 = WIDTH; 1 = HEIGHT
  [orientation:number]: number[];
}

interface ScreenDimensions {
  width: number,
  height: number,

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


// All assuming screen width and screen height are based on device in portrait mode, 
// and screen width and height doesn't change with device orientation change...
export class ScreenDimension {
  private orientalDimensions: ScreenDimensionsOrientation = undefined;
  private screenDimensions: ScreenDimensions = undefined;
  constructor() {
    // Let's first determine if the current browser even supports orientation
    let initialOrientationType = (typeof window.orientation);
    if (initialOrientationType == "undefined") {
      console.log("The current browser does not support the orientation api.");
      this.orientalDimensions = null;
      this.screenDimensions.width = screen.width;
      this.screenDimensions.height = screen.height;
    }
    else {
      let initialOrientation = window.orientation;
      console.log("The current browser supports the orientation api.");
      this.screenDimensions = null;
      switch (initialOrientation) {
        case Orientation.Landscape_Primary: {
          this.orientalDimensions[Orientation.Landscape_Primary] = [
            screen.height, // If the screen is in landscape, the width is the height
            screen.width, // If the screen is in landscape, the height is the width
          ]
          break;
        }
        case Orientation.Landscape_Secondary: {
          this.orientalDimensions[Orientation.Landscape_Secondary] = [
            screen.height, // If the screen is in landscape, the width is the height
            screen.width, // If the screen is in landscape, the height is the width
          ]
          break;
        }
        case Orientation.Portrait_Primary: {
          this.orientalDimensions[Orientation.Portrait_Primary] = [
            screen.width, // If the screen is in portrait, the width is the width
            screen.height, // If the screen is in landscape, the height is the height
          ]
          break;
        }
        case Orientation.Portrait_Secondary: {
          this.orientalDimensions[Orientation.Portrait_Secondary] = [
            screen.width, // If the screen is in portrait, the width is the width
            screen.height, // If the screen is in landscape, the height is the height
          ]
          break;
        }
        default: {
          console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
          return;
          break;
        }
      } 
    }
  }

  public getScreenHeight(): number {
    let currentOrientation = window.orientation;
    switch (currentOrientation) {
      case Orientation.Landscape_Primary: {
        return (this.orientalDimensions[Orientation.Landscape_Primary])[Dimension.Height];
        break;
      }
      case Orientation.Landscape_Secondary: {
        return (this.orientalDimensions[Orientation.Landscape_Secondary])[Dimension.Height];
        break;
      }
      case Orientation.Portrait_Primary: {
        return (this.orientalDimensions[Orientation.Portrait_Primary])[Dimension.Height];
        break;
      }
      case Orientation.Portrait_Secondary: {
        return (this.orientalDimensions[Orientation.Portrait_Secondary])[Dimension.Height];
        break;
      }
      default: {
        console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
        return null;
        break;
      }
    }
  }

  public getScreenWidth(): number {
    let currentOrientation = window.orientation;
    switch (currentOrientation) {
      case Orientation.Landscape_Primary: {
        return (this.orientalDimensions[Orientation.Landscape_Primary])[Dimension.Width];
        break;
      }
      case Orientation.Landscape_Secondary: {
        return (this.orientalDimensions[Orientation.Landscape_Secondary])[Dimension.Width];
        break;
      }
      case Orientation.Portrait_Primary: {
        return (this.orientalDimensions[Orientation.Portrait_Primary])[Dimension.Width];
        break;
      }
      case Orientation.Portrait_Secondary: {
        return (this.orientalDimensions[Orientation.Portrait_Secondary])[Dimension.Width];
        break;
      }
      default: {
        console.error("A fatal error has occurred where the angle isn't equal to one of the assigned orientations. Exiting...");
        return null;
        break;
      }
    }
  }



}