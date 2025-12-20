export interface Ilesson {
  _id: string;
  course: {
    _id: string;
    title: {
      en: string;
      ar: string;
    };
  };
  instructor: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  title: {
    en: string;
    ar: string;
  };
  type: string;
  content?: {
    en: string;
    ar: string;
  };
  videoUrl: string;
  duration?: number;
  order?: number;
  isPreview?: boolean;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}
