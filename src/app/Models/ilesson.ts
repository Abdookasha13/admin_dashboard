export interface Ilesson {
  _id: string;
  course: {
    _id: string;
    title: string;
  };
  instructor: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  title: string;
  type: string;
  content?: string;
  videoUrl: string;
  duration?: number;
  order?: number;
  isPreview?: boolean;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}
