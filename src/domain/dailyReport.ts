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

  public workend(
    end: string,
    action: string,
    workingAction: string,
    timestamp: any
  ) {
    this.end = end;
    this.status = Status.Close;
    this.action = action;
    this.workingAction = workingAction;
    this.updateDate = timestamp;
  }
}
