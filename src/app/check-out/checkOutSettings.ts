export class CheckOutSettings {
  /**
    * 8.64e+7 is the amount of milliseconds within a day
   */
  private static readonly _MAX_DAYS_RESERVED: number = 14;
  private static readonly _MAX_MILLISECONDS_RESERVED: number = (86400000 * CheckOutSettings._MAX_DAYS_RESERVED);

  private static readonly _MAX_DAYS_IN_ADVANCE_ITEM_CAN_BE_CHECKED_OUT: number = 7;
  private static readonly _MAX_MILLISECONDS_IN_ADVANCE_ITEM_CAN_BE_CHECKED_OUT: number = (86400000 * CheckOutSettings._MAX_DAYS_IN_ADVANCE_ITEM_CAN_BE_CHECKED_OUT);

  private static readonly _MAX_DAYS_ITEM_CAN_BE_CHECKED_OUT: number = 7;
  private static readonly _MAX_MILLISECONDS_ITEM_CAN_BE_CHECKED_OUT: number = (86400000 * CheckOutSettings._MAX_DAYS_ITEM_CAN_BE_CHECKED_OUT);

  public static getMaxTimeInAdvanceForReservation(currentDate: Date): Date {
    console.log("​CheckOutSettings -> CheckOutSettings._MAX_MILLISECONDS_RESERVED", CheckOutSettings._MAX_MILLISECONDS_RESERVED);
    return (new Date(currentDate.getTime() + CheckOutSettings._MAX_MILLISECONDS_RESERVED));
  }

  public static getMaxTimeInAdvanceForCheckOut(currentDate: Date): Date {
    return (new Date(currentDate.getTime() + CheckOutSettings._MAX_MILLISECONDS_IN_ADVANCE_ITEM_CAN_BE_CHECKED_OUT));
  }

  public static getMaxTimeItemCanBeCheckedOut(startDate: Date): Date {
    console.log("​CheckOutSettings -> CheckOutSettings._MAX_MILLISECONDS_ITEM_CAN_BE_CHECKED_OUT", CheckOutSettings._MAX_MILLISECONDS_ITEM_CAN_BE_CHECKED_OUT);
    return (new Date(startDate.getTime() + CheckOutSettings._MAX_MILLISECONDS_ITEM_CAN_BE_CHECKED_OUT))
  }

  public static getMaxDaysReserved(): number {return CheckOutSettings._MAX_DAYS_RESERVED;}
  public static getMaxDaysItemCanBeCheckedOut(): number {return CheckOutSettings._MAX_DAYS_ITEM_CAN_BE_CHECKED_OUT;}
  public static getMaxDaysInAdvanceItemCanBeCheckedOut(): number {return CheckOutSettings._MAX_DAYS_IN_ADVANCE_ITEM_CAN_BE_CHECKED_OUT;}
}