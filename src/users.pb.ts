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

export interface UserByIdRequest {
  userId: string;
}

export interface UserByEmailRequest {
  email: string;
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
  getUsers(request: Void): Observable<User>;

  getUserById(request: UserByIdRequest): Observable<User>;

  getUserByEmail(request: UserByEmailRequest): Observable<User>;

  createUser(request: CreateUserRequest): Observable<User>;

  updateUser(request: UpdateUserRequest): Observable<User>;

  deleteUser(request: DeleteUserRequest): Observable<User>;
}

export interface UsersServiceController {
  getUsers(request: Void): Observable<User>;

  getUserById(
    request: UserByIdRequest
  ): Promise<User> | Observable<User> | User;

  getUserByEmail(
    request: UserByEmailRequest
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
      "getUsers",
      "getUserById",
      "getUserByEmail",
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
