export interface Iuser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: 'instructor' | 'student'| 'admin';
    profileImage: string;
    expertise?: string;
    experience?: number;
}
