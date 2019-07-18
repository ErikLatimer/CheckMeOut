import { Directive, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import jsQR from "jsqr";

@Directive({
  exportAs: 'canvasDriver',
  selector: '[canvasDriver]'
})
export class CanvasDriverDirective {

  private readonly LIVEFEEDID = "liveFeed";
  private readonly QRZONEID = "qrCodeZone";
  private readonly HIDDENCANVASID = "hiddenCanvas";

  private readonly SCANSPERSECOND: number = 2;
  private readonly TIMEINTERVAL: number = ( 1000 * this.SCANSPERSECOND );

  private timerID = undefined;

  private context: CanvasRenderingContext2D = undefined;

  constructor() { }
  ngOnInit() {
    console.log("canvasDriver initialized successfully!");
    this.scanningProtocol();
  }
  ngAfterViewChecked() {
    //this.scanningProtocol();
  }

  scanningProtocol() {
    // Do not forget to clear this interval when the view clears. Maybe clear it in ngOnDestroy()?
    let canvas = <HTMLCanvasElement>document.getElementById(this.QRZONEID);
    this.context = canvas.getContext("2d");
    this.context.fillRect(0,0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    console.log("Initializing scanning protocol...");
    //this.timerID = setInterval(<TimerHandler><unknown>this.scanQRZone(), this.TIMEINTERVAL);
  }

  scanQRZone() {
    // Guaranteed to initialize after view is rendered
    //this.clearHiddenCanvas();
    let videoElement: HTMLVideoElement = <HTMLVideoElement>document.getElementById(this.LIVEFEEDID);

    let qrCodeZoneDimensions: ClientRect = document.getElementById(this.QRZONEID).getBoundingClientRect();
    console.log(`qrCodeZoneDimensions:${qrCodeZoneDimensions}`);

    let qrCodeZoneSW: number = qrCodeZoneDimensions.width;
    console.log(`qrCodeZoneSW:${qrCodeZoneSW}`);
    let qrCodeZoneSH: number = qrCodeZoneDimensions.height;
    console.log(`qrCodeZoneSH:${qrCodeZoneSH}`);
    let qrCodeZoneSX: number = qrCodeZoneDimensions.left;
    console.log(`qrCodeZoneSX:${qrCodeZoneSX}`);
    let qrCodeZoneSY: number = qrCodeZoneDimensions.top;
    console.log(`qrCodeZoneSY:${qrCodeZoneSY}`);
/**
    this.context.drawImage(
      videoElement, qrCodeZoneSX, qrCodeZoneSY, qrCodeZoneSW, qrCodeZoneSH, qrCodeZoneSX, qrCodeZoneSY, qrCodeZoneSW, qrCodeZoneSH
    );
**/
    
    this.context.drawImage(
      videoElement, 0, 0, qrCodeZoneSW, qrCodeZoneSH
    );
    
    let imageData = new Uint8ClampedArray();

    imageData = <Uint8ClampedArray><unknown>this.context.getImageData(qrCodeZoneSX, qrCodeZoneSY, qrCodeZoneSW, qrCodeZoneSH);
    console.log(`Image Data:`);
    console.log(imageData);
    let code = jsQR(<Uint8ClampedArray><unknown>imageData, qrCodeZoneSW, qrCodeZoneSH);

    if (code) {console.log("WE FOUND ONE!!!!!");}
    else {console.log("Nope Nothing");}
  }

  clearHiddenCanvas() {
    let qrCodeZoneDimensions: ClientRect = document.getElementById(this.QRZONEID).getBoundingClientRect();
    this.context.clearRect(qrCodeZoneDimensions.left, qrCodeZoneDimensions.top, qrCodeZoneDimensions.width, qrCodeZoneDimensions.height);
  }

  ngOnDestroy() {
    clearInterval(this.timerID);
  }

}
