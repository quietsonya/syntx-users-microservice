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

export interface UserIdRequest {
  userId: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  salt: string;
}

export const USERS_PACKAGE_NAME = "users";

export interface UsersServiceClient {
  getUsers(request: Void): Observable<User>;

  getUserById(request: UserIdRequest): Observable<User>;

  createUser(request: CreateUserRequest): Observable<User>;
}

export interface UsersServiceController {
  getUsers(request: Void): Observable<User>;

  getUserById(request: UserIdRequest): Promise<User> | Observable<User> | User;

  createUser(
    request: CreateUserRequest
  ): Promise<User> | Observable<User> | User;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUsers", "getUserById", "createUser"];
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
