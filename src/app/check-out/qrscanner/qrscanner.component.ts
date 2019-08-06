import uuidv1 from 'uuid/v1';
import ratio from 'aspect-ratio';
import { RegisterRequest, PassRequest, TokenRegistry } from './../../../lib/TokenInterfaces';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, AfterViewChecked } from '@angular/core';
import { ScreenDimensionService } from '../../lib/screen-dimension.service';
import { PostGrestService } from './../../lib/post-grest.service';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.scss']
})
export class QRScannerComponent implements OnInit {

  @Output() registerAsTokenBearer = new EventEmitter<RegisterRequest>();
  @Output() passToken = new EventEmitter<PassRequest>();

  @Input() registryCopy: TokenRegistry;

  private readonly tokenBearerUUID: string = uuidv1();
  private readonly tokenBearerName: string = "qrscanner";
  public isActive: boolean = false;
  public videoFeedSource: MediaStream = undefined;
  public videoHeight: number = undefined;
  public videoWidth: number = undefined;
  public canvasWidth: number = 0;
  public canvasHeight: number = 0;
  public canvasStyle: string = undefined;
  private navbarHeight: number = undefined;
  private readonly NAVBAR_ID: string = "nav";
  private readonly CANVAS_ID: string = "qrCodeZone";
  private readonly VIDEO_ID: string = "liveFeed";
  private readonly TWO_D_CONTEXT: string = '2d';
  private readonly CANVAS_PARENT_ID: string = "liveFeedDiv";
  public readonly FACEMODE: string = "environment";
  private qrProtocolInitiated = false;
  private readonly COLOR_SNAP_SECONDS: number = 2.3;
  private readonly COLOR_SNAP_INTERVAL: number = this.COLOR_SNAP_SECONDS * 1000;
  private colorTimeOutActive: boolean = false;
  private readonly QR_PROTOCOL_TIME_PER_SECOND: number = .50;
  private readonly QR_PROTOCOL_SCAN_INTERVAL = this.QR_PROTOCOL_TIME_PER_SECOND * 1000;
  private timer_id: number;
  private isProcessing: boolean = false;
  public loading: boolean = false;
  public stopLoading: boolean = false;


// Inject the ScreenDimensionService

  constructor(private postgrestService: PostGrestService, private screenDimensionService: ScreenDimensionService) { }

  ngOnInit() {
    this.registerAsTokenBearer.emit({
      tokenBearerUUID: this.tokenBearerUUID,
      tokenBearerName: this.tokenBearerName
    });
  }
  ngOnChanges(changes: SimpleChanges) {;
    this.isActive = this.registryCopy[this.tokenBearerUUID];
    if (this.isActive) {this.activate();}
  }

  ngAfterViewChecked() {
    //let videoElement: HTMLVideoElement = <HTMLVideoElement>document.getElementById("liveFeed");
    if (!(this.qrProtocolInitiated)) {
      if(this._qrCodeScanProtocol()){
        console.log("hello");
        this.timer_id = setInterval(
         <TimerHandler><unknown>this._qrCodeScanProtocol.bind(this),
          this.QR_PROTOCOL_SCAN_INTERVAL
        );
        this.qrProtocolInitiated = true;
      }
    }
    else {}

    //context.drawImage(videoElement, 0,0, canvas.getBoundingClientRect().width - 10, canvas.getBoundingClientRect().height-10);
  }

  private _qrCodeScanProtocol(): boolean {
    if (this.isProcessing) {return false;}
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(this.CANVAS_ID);
    // If the canvas context isn't ready yet...
    if ( canvas === null ) {
      // then just return and exit on this instance of ngAfterViewChecked()
      console.warn("Canvas context is not ready yet. Returning...");
      return false;
    } 
    else {
      // If the canvas context is ready to be worked with...
      // @ts-ignore
      let canvasContext: CanvasRenderingContext2D = canvas.getContext(this.TWO_D_CONTEXT);
      /**
       * First draw the current video frame, that falls within the canvas boundaries, onto the canvas (Sub-Routine)
       * The first step however is to clear the canvas. If the canvas is cleared at the beginning and end of the
       * routine, then the frame only appears on the canvas as long as the routine takes.
       */
      canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight);
      // Now let's get an instance of the video element
      //canvas.width = this.screenDimensionService.getInnerWindowWidth();
      //canvas.height = this.screenDimensionService.getInnerWindowHeight() - this.navbarHeight;
      let videoElementInstance: HTMLVideoElement = <HTMLVideoElement>document.getElementById(this.VIDEO_ID);
      /**
       * Now let's get our dimensions for the Sub-Rectangle of our source image calculated. We need our source Sub-Rectangle
       * dimensions related to our canvas dimensions and positioning (specified in qrscanner.component.scss). The canvas
       * is positioned 50% of it's container element's width in position, 100% of it's container element's height downward in
       * position, the moved 50% of it's own width left, and 50% of it's own height upward.
       */
      let canvasDimensions: ClientRect = canvas.getBoundingClientRect();
      let containingElementInstance: HTMLDivElement = <HTMLDivElement>document.getElementById(this.CANVAS_PARENT_ID);
      //console.log(containingElementInstance);
      let containingElementDimensions: ClientRect = containingElementInstance.getBoundingClientRect();
      //console.log(containingElementDimensions);
      //console.log((containingElementDimensions.width/2) - (this.canvasWidth/2));
      let sx: number = canvasDimensions.left;// - (this.canvasWidth/2); //((containingElementDimensions.width/2) - (this.canvasWidth/2));
      let sy: number = canvasDimensions.top;// - (this.canvasHeight/2);//((containingElementDimensions.height) - (this.canvasHeight/2));
      let sw: number = canvasDimensions.width;//this.canvasWidth;
      let dw: number = canvasDimensions.width//this.canvasWidth;
      let sh: number = canvasDimensions.height;//this.canvasHeight;
      let dh: number = canvasDimensions.height;//this.canvasHeight;
      let fullscreenInnerHeight = this.screenDimensionService.getScreenHeight()-(window.outerHeight-this.screenDimensionService.getInnerWindowHeight());
      //this.screenDimensionService.getInnerWindowHeight();
      let fullscreenWidth = this.screenDimensionService.getScreenWidth();
      //console.log(this.canvasHeight);
      // Now let's draw the image on the canvas
      //console.log(`Source width ${sw}`);
      
      if(!(this.screenDimensionService.isOriental())) {
        // Don't ask me why these values are the way they are XD Because I have no idea I know they just
        // work on desktop
        canvasContext.drawImage(
          videoElementInstance,
          (sx - ((sw/2)*(this.screenDimensionService.getInnerWindowWidth()/this.screenDimensionService.getScreenWidth()))),
          sy - ((sh/1.5)*((this.screenDimensionService.getInnerWindowHeight())/(this.screenDimensionService.getScreenHeight()-(window.outerHeight-this.screenDimensionService.getInnerWindowHeight())))),

          fullscreenWidth- (fullscreenWidth/2),
  
          //((Math.pow((sy/2),2))/(this.screenDimensionService.getScreenHeight()-(window.outerHeight-this.screenDimensionService.getInnerWindowHeight()))),
          //(sw)*(this.screenDimensionService.getInnerWindowWidth()/this.screenDimensionService.getScreenWidth()),
          //((Math.pow(this.screenDimensionService.getInnerWindowWidth(),2))/(this.screenDimensionService.getScreenWidth())),
          //this.screenDimensionService.getScreenHeight()*2.5,
  
          fullscreenInnerHeight,
  
          //((Math.pow(this.screenDimensionService.getInnerWindowHeight(),2))/(this.screenDimensionService.getScreenHeight()-(window.outerHeight-this.screenDimensionService.getInnerWindowHeight()))),
          0,0,
          dw+40,
          (dh*1.5)
        );
      }
      else{
        canvasContext.drawImage(
        videoElementInstance,sx,sy,
        //sx,//(sx - ((sw/2)*(this.screenDimensionService.getInnerWindowWidth()/this.screenDimensionService.getScreenWidth()))),
        //sy - ((sh/2.55)*((this.screenDimensionService.getInnerWindowHeight())/(this.screenDimensionService.getScreenHeight()-(window.outerHeight-this.screenDimensionService.getInnerWindowHeight())))),

        sw, sh,
        //fullWidth- (fullWidth/2),

        //((Math.pow((sy/2),2))/(this.screenDimensionService.getScreenHeight()-(window.outerHeight-this.screenDimensionService.getInnerWindowHeight()))),
        //(sw)*(this.screenDimensionService.getInnerWindowWidth()/this.screenDimensionService.getScreenWidth()),
        //((Math.pow(this.screenDimensionService.getInnerWindowWidth(),2))/(this.screenDimensionService.getScreenWidth())),
        //this.screenDimensionService.getScreenHeight()*2.5,

        // fullHeight,

        //((Math.pow(this.screenDimensionService.getInnerWindowHeight(),2))/(this.screenDimensionService.getScreenHeight()-(window.outerHeight-this.screenDimensionService.getInnerWindowHeight()))),
        0,0, dw, dh
        //dw+40,
        //(dh*1.5)
      );
      }

      
      //console.log(sx,sy);
      //console.log("Image drawn");
      // Now that we have our canvas populated, let's extract the data in an ImageData form.
      let imageData: ImageData = canvasContext.getImageData(0,0,sw,sh);
      //console.log(`imaegData ${imageData.width}`);
      //console.log(sw);
      // Now that we have our image data, let's pass it to jsQR
      // @ts-ignore
      let code = jsQR(imageData.data, sw,sh);

      // Now let's check if we found a code
      if(code){
        this.isProcessing = true;
        console.log("We found a code!!!!!");
        console.log("Executing...");
        setTimeout(
          function() {
            this.startLoading();
          }.bind(this),
          300
        );
        setTimeout(
          function() {
            //window.navigator.vibrate(1000);

          }.bind(this),
          200
        );
        // This is in place to prevent a scenario where the processing for the QR code is done
        // BEFORE the color timeout is complete.
        //! This property is Angular bound to the video element
        this.canvasStyle = "5px solid lightgreen";
        if(!(this.colorTimeOutActive)) {
          console.log("Color TimeOut Inactive");
          this.colorTimeOutActive = true;
          setTimeout(
            function() {
              console.log("Came to set color back");
              //! This property is Angular bound to the video element
              this.canvasStyle = "2px dashed red";
              this.colorTimeOutActive = false;
            }.bind(this),
            this.COLOR_SNAP_INTERVAL
          );
        }
        // qrcode.data by default is of string type
        console.log(code.data);

        // If processQRCode returns truthy, initiate the next screen and somehow pass the infoObject returned
        // If processQRCode does not return truthy, perform the error alert screen effect for a couple of seconds
        // so that the user can see what went wrong.
        // Either way, destroy the loading component when processQRCode returns
        this.processQRCode(code);
      }

      // Now Let's clear the canvas again so the user doesn't have to sense a visual representation of this process
      // Comment the line below out to see the actual qr scanning zone
      canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight);

      // Now repeat...
      return true;
    }
  }

  async processQRCode(qrCode: QRCode): Promise<Object> {
    
    const resultingDocument: Object = await this.postgrestService.retrieveDocumentByUUID(qrCode.data);
    if (typeof resultingDocument == "undefined") {
      console.warn("Document not found under user query");
      console.log("Finished");
      this.isProcessing = false;
      this.destroyLoader();
      return undefined;
    }
    else if (resultingDocument) {
      console.log("Results:");
      console.log(resultingDocument);
      console.log("Finished");
      this.isProcessing = false;
      this.destroyLoader();
      return resultingDocument;
    }
    else {
      console.error("A request error has occured");
      console.log("Finished");
      this.isProcessing = false;
      this.destroyLoader();
      return null;
    }
    // The logic below is probably going to have to be in a callback most likely
    console.log("Finished");
    this.isProcessing = false;
  }


  async activate() {
    console.log("Activating qrscanner...");
    //! Global variable
    this.navbarHeight = document.getElementById(this.NAVBAR_ID).getBoundingClientRect().height;
    this.enableStream();
    this.setCanvasDimensionsAndStyle();
    if (this.screenDimensionService.isOriental) {
      this.screenDimensionService.subscribeToOrientationChange(()=>{this.resizeLayout();});
    }
    else {this.screenDimensionService.subscribeToResize(()=>{this.resizeLayout();});}
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
      //! This particular property is bound to the QRScanner HTML5.
      this.videoFeedSource = stream;
      this.setVideoDimensions();
    } catch (err) {
      console.error(`ERROR (NOT ALLOWED || NOTFOUND) "${err}"`);
    }
  }

  setCanvasDimensionsAndStyle() {
    //! This property is Angular bound to the video element
    this.canvasHeight = ((this.screenDimensionService.getInnerWindowHeight() - this.navbarHeight)/2);
    //! This property is Angular bound to the video element
    this.canvasWidth = this.screenDimensionService.getInnerWindowWidth()/2;
    //! This property is Angular bound to the video element
    this.canvasStyle = "2px dashed red";
  }
  setVideoDimensions() {
    //! This property is Angular bound to the video element
    this.videoHeight = this.screenDimensionService.getInnerWindowHeight() - this.navbarHeight;
  }
  
  resizeLayout() {
    //! Global variable
    this.navbarHeight = document.getElementById(this.NAVBAR_ID).getBoundingClientRect().height;
    this.setVideoDimensions();
    this.setCanvasDimensionsAndStyle();
  }

  public destroyLoader() {
    console.log("Destroy loader called...");
    if (this.loading) {
      this.loading = false;
      this.stopLoading = true;
    }
    else {
      setTimeout(
        function(){
          this.loading = false;
          this.stopLoading = true;
        }.bind(this),
        400
      );
    }
  }

  public startLoading() {
    console.log("Start loading called...");
    this.loading = true;
    this.stopLoading = false;
  }

}