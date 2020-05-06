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
