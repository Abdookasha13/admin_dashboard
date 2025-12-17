export interface Ievent {
  _id?: string;
  eventImage: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  date: string;
  startTime:string;
  endTime: string;
  location: {
    en: string;
    ar: string;
  };
}
