import { IUserRepository, Pagination } from "../../../domain/repositories/IUserRepository";
import { UserResponse } from "../../dtos/user/UserResponse";
import { GetUsersRequest } from "../../dtos/user/GetUsersRequest";
import { Roles } from "../../../shared/constants/Roles";

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: GetUsersRequest): Promise<{
    users: UserResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const pagination: Pagination = { page: request.page, limit: request.limit };
    const [users, total] = await Promise.all([
      this.userRepository.findAll(pagination, Roles.User),
      this.userRepository.count(Roles.User),
    ]);

    const totalPages = Math.ceil(total / request.limit);
    const userResponses = users.map((user) => UserResponse.fromEntity(user));

    return {
      users: userResponses,
      total,
      page: request.page,
      totalPages,
    };
  }
}