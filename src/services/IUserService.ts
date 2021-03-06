export interface IUserService {
    create(name: string, surname: string, email: string, password: string): Promise<number>;
    list(): Promise<IUserAccessibleProps[]>;
    findById(id: number): Promise<IUserAccessibleProps>;
    update(id: number, name: string, surname: string, password: string): Promise<number>;
    delete(id: number, requesterId: number): Promise<number>;
}

export interface IUserAccessibleProps {
    id: number;
    name: string;
    surname: string;
    email: string;
}
