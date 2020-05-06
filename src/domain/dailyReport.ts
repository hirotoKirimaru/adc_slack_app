export const Status = {
  Open: "open",
  Close: "close",
} as const;
type Status = typeof Status[keyof typeof Status];

export interface DailyReport {
  user: string;
  start: string;
  end: string;
  status: Status;
  workDate: string;
  action: string;
  workingAction?: string;
  registerDate: any;
  updateDate: any;
}

export class DailyReportImpl implements DailyReport {
  user: string;
  start: string;
  end: string;
  status: Status;
  workDate: string;
  action: string;
  workingAction?: string;
  registerDate: any;
  updateDate: any;

  public static workStart(
    user: string,
    workDate: string,
    start: string,
    end: string,
    action: string,
    timestamp: any
  ) {
    return {
      user: user,
      workDate: workDate,
      start: start,
      end: end,
      status: Status.Open,
      action: action,
      registerDate: timestamp,
      updateDate: timestamp,
    };
  }

  public static workEnd(
    end: string,
    action: string,
    workingAction: string,
    timestamp: any
  ) {
    return {
      end: end,
      status: Status.Close,
      action: action,
      workingAction: workingAction,
      updateDate: timestamp,
    };
  }
}
