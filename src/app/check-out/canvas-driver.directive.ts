import { Directive, OnInit, AfterViewChecked } from '@angular/core';
import ratio from 'aspect-ratio';

@Directive({
  exportAs: 'canvasDriver',
  selector: '[canvasDriver]'
})
export class CanvasDriverDirective {

  private aspectRatioWidth: number = undefined;
  private aspectRatioHeight: number = undefined;
  private qrZoneHasBeenDrawn: boolean = false;
  public height: number = 200;
  constructor() { }
  ngOnInit() {
    console.log("canvasDriver initialized successfully!");
    this.setAspectRatio();
  }
  ngAfterViewChecked() {
    //Event later on needs to be incorporated like in qrscanner component
    //Like an after oreintation change height and width need to be incorporated.
    // For now the QR zone on mobile devices in landscape will only take into
    // account the viewport of the immediate flip, not the rest of the page.
    /**
    if (!(this.qrZoneHasBeenDrawn)) {
      this.drawQRZone();
      this.qrZoneHasBeenDrawn = true;
    }
    if (typeof window.orientation == "undefined") {
      this.drawQRZone();
    }
    */
  }

  drawQRZone() {
    let bodyDimensions = document.getElementById("root").getBoundingClientRect();
    let navBarDimensions = document.getElementById("nav").getBoundingClientRect();

    let qrZoneParentContainerHeight: number = (
      (bodyDimensions.height) -
      (navBarDimensions.height)
    );

    //document.getElementById("qrCodeZone").style.top = `${navBarDimensions.height}px`;
    //document.getElementById("qrCodeZone").style.left = '0px';

    // The height of the QRZone is always going to be half of the height of its container
    let qrZoneHeight: number = (qrZoneParentContainerHeight / 2);
    // The width of the QRZone will be the same as the height, multiplied by aspect ratio to achieve a good looking square
    let qrZoneWidth: number  = qrZoneHeight;
    //(qrZoneHeight*(this.aspectRatioHeight/this.aspectRatioWidth));

    // Now that we have our height and width, we must position our square to be in the middle of the screen
    let qrZoneX: number = (
      ((bodyDimensions.width) / 2) -
      (qrZoneWidth / 2)
    );
    let qrZoneY: number = (
      ((qrZoneParentContainerHeight) / 2) -
      (qrZoneHeight / 2)
    );
    
    // Now lets draw the rectangle
    console.log(`qrZoneHeight:${qrZoneHeight}`);
    console.log(`qrZoneWidth:${qrZoneWidth}`);
    console.log(`qrZoneX:${qrZoneX}`);
    console.log(`qrZoneY:${qrZoneY}`);
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("qrCodeZone");
    console.log(canvas.width);
    let context: CanvasRenderingContext2D = canvas.getContext('2d');
    console.log(context);
    console.log("about to Draw Rectangle");
    context.strokeStyle = "#77aafc";
    context.strokeRect(qrZoneX, qrZoneY, qrZoneWidth, qrZoneHeight);
  }

  setAspectRatio() {
    let aspectRatioString: string = ratio(
      (window.screen.width * window.devicePixelRatio),
      (window.screen.height * window.devicePixelRatio)
    );
    let aspectArray: number[] = [];
    aspectRatioString.split(":").forEach((string) => {
      console.log(string);
      aspectArray.push(parseInt(string));
    });
    console.log(aspectArray);
    // Aspect Ratio: WDITH:HEIGHT i.e. 16:9
    this.aspectRatioWidth = aspectArray[0];
    this.aspectRatioHeight = aspectArray[1];
  }
}
