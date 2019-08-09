interface NgClasses {
  [className: string]: boolean
}

/**
 * ! To do:
 * 
 * I. Maybe add a [slot] system for classes. Like when a class populates that [slot], and if another class attempts to populated
 * [slot], the class that was previously populating said slot is automatically removed, and replaced by the proceeding class.
 * 
 */
export class NgClassBinding {
  public binding: NgClasses;
  constructor() {this.binding = {};}
  /**
   * @description Set a class to become active or inactive . If the class already exists, it overrides it's active setting
   * with the current parameter
   * @param className The class name to set
   * @param active Whether the preceding class name is to be active or not
   * @returns void
   */
  public setClass(className: string, active: boolean): void {
    this.binding[className] = active;
  }
  public resetClasses(): void {
    this.binding = {};
  }
  public removeClass(className: string): void {
    if (typeof this.binding[className] == "undefined") {
      console.warn(`Class "${className} does not exist on the current component.`);
      return;
    }
    else {delete this.binding[className];}
  }

  public classIsActive(className: string): boolean {
    if (typeof this.binding[className] == "undefined") {return false;}
    else if (!(this.binding[className])) {return false;}
    else {return true;}
  }

}