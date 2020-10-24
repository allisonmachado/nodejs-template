import { SharedFunctions } from "../lib/SharedFunctions";
import { UserRepository } from "../data/repositories/UserRepository";
import { BaseService } from "./BaseService";
import { UserEntity } from "../data/entities/user/UserEntity";
import { Logger } from "../lib/Logger";

export class UserService extends BaseService {
    private readonly logger = new Logger(UserService.name);

    constructor(private userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
        this.logger.debug(`initialized`);
    }

    public async create(name: string, surname: string, email: string, password: string): Promise<number> {
        const hashedPassword = await SharedFunctions.hashPassword(password);
        return this.userRepository.create(name, surname, email, hashedPassword);
    }

    public async list(): Promise<UserAccessibleProps[]> {
        const users = await this.userRepository.findTop10();
        return this.visiblePropsMapper(users);
    }

    public async findById(id: number): Promise<UserAccessibleProps> {
        const users = await this.userRepository.findById(id);
        return this.visiblePropsMapper(users)[0];
    }

    public async update(id: string, name: string, surname: string, password: string): Promise<number> {
        let hashedPassword = password ? await SharedFunctions.hashPassword(password) : "";
        return this.userRepository.update(id, name, surname, hashedPassword);
    }

    public async delete(id: number): Promise<number> {
        return this.userRepository.delete(id);
    }

    private visiblePropsMapper(users: UserEntity[]): UserAccessibleProps[] {
        return users.map(u => ({
            id: u.getId(),
            name: u.getName(),
            surname: u.getSurname(),
            email: u.getEmail(),
        }));
    }
}

interface UserAccessibleProps {
    id: number,
    name: string;
    surname: string;
    email: string;
}