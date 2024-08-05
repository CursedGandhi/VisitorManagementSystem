export interface User{
    name: string;
    id: string;
    role: 'admin' | 'emp' | 'security';
    number: string;
    email: string;
    password: string;
}

export interface Visitor{
    name: string;
    id: string;
    date: string;
    checkIn: string;
    checkOut: string;
    company:string;
    number: string;
    email: string;
    doc:string;
    doc_no:string;
    user:string;
    is_remarks:string|null;
    sec_remarks:string|null;
    no_vis:number;
}

export interface visitorResponse{
    totalElements: number;
    totalPages: number;
    size: number;
    content: Array<Visitor>;
    number: number;
    sort: object;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    pageable: object;
    empty: boolean;
}

export interface userResponse{
    totalElements: number;
    totalPages: number;
    size: number;
    content: Array<User>;
    number: number;
    sort: object;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    pageable: object;
    empty: boolean;
}