import uuidv1 from 'uuid/v1';
import ratio from 'aspect-ratio';
import { RegisterRequest, PassRequest, TokenRegistry } from './../../../lib/TokenInterfaces';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CanvasDriverDirective } from './../canvas-driver.directive';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.scss']
})
export class QRScannerComponent implements OnInit {

  @Output() registerAsTokenBearer = new EventEmitter<RegisterRequest>();
  @Output() passToken = new EventEmitter<PassRequest>();

  @Input() registryCopy: TokenRegistry;

  private readonly tokenBearerUUID = uuidv1();
  private readonly tokenBearerName = "qrscanner";
  public isActive = false;
  public videoFeedSource = undefined;
  public videoHeight = undefined;
  public videoWidth = undefined;
  public canvasWidth = 0;
  public canvasHeight = 0;
  public canvasStyle = undefined;
  private aspectRatioWidth: number = undefined;
  private aspectRatioHeight: number = undefined;
  public readonly FACEMODE = "environment"
  constructor() { }

  ngOnInit() {
    this.registerAsTokenBearer.emit({
      tokenBearerUUID: this.tokenBearerUUID,
      tokenBearerName: this.tokenBearerName
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("Onchanges...");
    this.isActive = this.registryCopy[this.tokenBearerUUID];
    console.log(this.isActive);
    if (this.isActive) { this.activate(); }
  }

  onResize(event) {
    if (typeof window.orientation == "undefined") {
      //this.resizeVideoStreamHeightDesktop(event);
      this.resizeElementsDesktop(event);
      //this.resizeCanvasDesktop(event);
    }
    else {
      //this.resizeElementsOriental(event);
      //this.resizeVideoStreamHeight2(event);
    }
    // Resizing canvas causes the canvas to wipe clean
    // CHANGE THIS BACK PLEASE AFTER EXPERIMENTATION
    //this.resizeCanvas(event);
  }
  onOrientationChange(event) {
    let switchStorage;
    switchStorage = this.aspectRatioHeight;
    this.aspectRatioHeight = this.aspectRatioWidth;
    this.aspectRatioWidth = switchStorage;

    let newWidth = this.aspectRatioWidth;
    let newHeight = this.aspectRatioHeight;
  
    // Navbar height does not change on resizes
    // Assuming that navbar does not change height on orientation change...
    let navBarDimensions = event.currentTarget.document.getElementById("nav").getBoundingClientRect();

    let qrZoneParentContainerHeight: number = (
      (newHeight) -
      (navBarDimensions.height)
    );
     this.canvasHeight = qrZoneParentContainerHeight/2;
     this.canvasWidth = newWidth/2;
     this.videoHeight = newHeight - document.getElementById("nav").getBoundingClientRect().height;
     // Because the body is now going off the VIEWPORT, and the height of newHeight - document.getElementById("nav").getBoundingClientRect().height;
     // is LONGER THAN the viewport in every instance;
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

  drawQRZone() {
    // The height of the QRZone is always going to be half of the height of its container
    let qrZoneHeight: number = (document.getElementById("liveFeedDiv").getBoundingClientRect().height / 2);
    // The width of the QRZone will be the same as the height, multiplied by aspect ratio to achieve a good looking square
    let qrZoneWidth: number  = (qrZoneHeight*(this.aspectRatioHeight/this.aspectRatioWidth));

    // Now that we have our height and width, we must position our square to be in the middle of the screen
    let qrZoneX: number = (
      ((document.getElementById("liveFeedDiv").getBoundingClientRect().width) / 2) -
      (qrZoneWidth / 2)
    );
    let qrZoneY: number = (
      ((document.getElementById("liveFeedElement").getBoundingClientRect().height) / 2) -
      (qrZoneHeight / 2)
    );
    
    // Now lets draw the rectangle
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("qrCodeZone");
    let context: CanvasRenderingContext2D = canvas.getContext("2d");
    context.strokeRect(qrZoneX, qrZoneY, qrZoneWidth, qrZoneHeight);
  }

  async enableStream() {
    if (typeof window.navigator.mediaDevices == "undefined") {
      console.error("ERROR. CANNOT ACQUIRE MEDIA DEVICES BECAUSE CONNECTION IS UNSECURE");
      return;
    }

    const userMediaDevices: MediaDevices = window.navigator.mediaDevices;

    const userDevices: any = await userMediaDevices.enumerateDevices();
    console.log(userDevices);

    const videoUserDevicesInfo: MediaDeviceInfo[] = userDevices.filter((deviceInfo) => {
      if (deviceInfo.kind == "videoinput") { return true; }
      else { return false; }
    });

    console.log(videoUserDevicesInfo);

    const videoUserDeviceIds: string[] = [];
    videoUserDevicesInfo.forEach((deviceInfo: MediaDeviceInfo) => {
      videoUserDeviceIds.push(deviceInfo.deviceId)
    });

    console.log(videoUserDeviceIds);

    const mediaTrackConstraint: MediaTrackConstraints = {
      deviceId: videoUserDeviceIds,
      facingMode: this.FACEMODE,
    }

    const mediaStreamConstraint: MediaStreamConstraints = {
      video: mediaTrackConstraint
    }
    // 18 1/2 by 9 Flagship phones
    // 4:3
    let stream: MediaStream;
    try {
      stream = await userMediaDevices.getUserMedia(mediaStreamConstraint);
      console.log(stream);
      this.videoFeedSource = stream;
      this.setVideoStreamHeight();
    } catch (err) {
      console.error(`ERROR (NOT ALLOWED || NOTFOUND) "${err}"`);
    }
  }

  setCanvas() {
    let bodyDimensions = document.getElementById("root").getBoundingClientRect();
    let navBarDimensions = document.getElementById("nav").getBoundingClientRect();

    console.log(`Body Dimensions: ${bodyDimensions.height}`);
    let qrZoneParentContainerHeight: number = (
      (bodyDimensions.height) -
      (navBarDimensions.height)
    );
    this.canvasHeight = qrZoneParentContainerHeight/2;
    this.canvasWidth = bodyDimensions.width/2;
    this.canvasStyle = "2px dashed red";
  }

  resizeElementsOriental(event) {
    let newWidth = this.aspectRatioHeight;
    let newHeight = this.aspectRatioWidth;
    
    let switchStorage;
    switchStorage = this.aspectRatioHeight;
    this.aspectRatioHeight = this.aspectRatioWidth;
    this.aspectRatioWidth = switchStorage;
    /**
    // Navbar height does not change on resizes
    // Assuming that navbar does not change height on orientation change...
    let navBarDimensions = event.currentTarget.document.getElementById("nav").getBoundingClientRect();

    let qrZoneParentContainerHeight: number = (
      (newHeight) -
      (navBarDimensions.height)
    );
    //console.log(bodyDimensions.height);
    this.canvasHeight = qrZoneParentContainerHeight/2;
    this.canvasWidth = newWidth;
    this.videoHeight = newHeight - document.getElementById("nav").getBoundingClientRect().height;
      **/
     this.videoHeight = newHeight - document.getElementById("nav").getBoundingClientRect().height;
  }

  resizeElementsDesktop(event) {
     // These Dimensions are calculated. Remember that event.target.innerheight is just the viewport
     let bodyDimensions = event.currentTarget.document.getElementById("root").getBoundingClientRect();
     // Navbar height does not change on resizes
     let navBarDimensions = event.currentTarget.document.getElementById("nav").getBoundingClientRect();
 
     let qrZoneParentContainerHeight: number = (
       (bodyDimensions.height) -
       (navBarDimensions.height)
     );
     //console.log(bodyDimensions.height);
     this.canvasHeight = qrZoneParentContainerHeight/2;
     this.canvasWidth = event.target.innerWidth/2;
     this.videoHeight = event.target.innerHeight - document.getElementById("nav").getBoundingClientRect().height;
  }

  resizeCanvasDesktop(event) {
    // These Dimensions are calculated. Remember that event.target.innerheight is just the viewport
    let bodyDimensions = event.currentTarget.document.getElementById("root").getBoundingClientRect();
    // Navbar height does not change on resizes
    let navBarDimensions = document.getElementById("nav").getBoundingClientRect();

    let qrZoneParentContainerHeight: number = (
      (bodyDimensions.height) -
      (navBarDimensions.height)
    );
    console.log(bodyDimensions.height);
    this.canvasHeight = qrZoneParentContainerHeight;
    this.canvasWidth = event.target.innerWidth;
  }

  resizeVideoStreamHeightDesktop(event) {
    console.log(`ResizeVideo:${event.target.innerHeight}`);
    this.videoHeight = event.target.innerHeight - document.getElementById("nav").getBoundingClientRect().height;
  }
  resizeVideoStreamHeight2(event) {
    this.videoWidth = this.aspectRatioHeight;
    this.videoHeight = this.aspectRatioWidth;
    this.aspectRatioHeight = this.videoWidth;
    this.aspectRatioWidth = this.videoHeight;
    //this.videoHeight = event.target.innerHeight - document.getElementById("nav").getBoundingClientRect().height;
  }

  setVideoStreamHeight() {
    // THESE HAVE TO BE SET HERE
    this.aspectRatioHeight = document.getElementById("root").getBoundingClientRect().height;
    this.aspectRatioWidth = document.getElementById("root").getBoundingClientRect().width;
    this.videoWidth = this.aspectRatioWidth;
    this.videoHeight = this.aspectRatioHeight - document.getElementById("nav").getBoundingClientRect().height;
  }

  async activate() {
    console.log("Activating qrscanner...");
    //this.setAspectRatio();
    this.enableStream();
    this.setCanvas();
    //this.drawQRZone();
  }

}
