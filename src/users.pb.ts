/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "users";

export interface Void {}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  salt: string;
}

export interface UserId {
  userId: string;
}

export interface SearchUsersParams {
  email?: string | undefined;
  username?: string | undefined;
  usersIds: string[];
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  salt: string;
}

export interface UpdateUserRequest {
  userId: string;
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  salt?: string | undefined;
}

export interface DeleteUserRequest {
  userId: string;
}

export const USERS_PACKAGE_NAME = "users";

export interface UsersServiceClient {
  getUserById(request: UserId): Observable<User>;

  searchUsers(request: SearchUsersParams): Observable<User>;

  createUser(request: CreateUserRequest): Observable<User>;

  updateUser(request: UpdateUserRequest): Observable<User>;

  deleteUser(request: DeleteUserRequest): Observable<User>;
}

export interface UsersServiceController {
  getUserById(request: UserId): Promise<User> | Observable<User> | User;

  searchUsers(
    request: SearchUsersParams
  ): Promise<User> | Observable<User> | User;

  createUser(
    request: CreateUserRequest
  ): Promise<User> | Observable<User> | User;

  updateUser(
    request: UpdateUserRequest
  ): Promise<User> | Observable<User> | User;

  deleteUser(
    request: DeleteUserRequest
  ): Promise<User> | Observable<User> | User;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUserById",
      "searchUsers",
      "createUser",
      "updateUser",
      "deleteUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("UsersService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("UsersService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
