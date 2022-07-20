/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty.pb";

export const protobufPackage = "eventbus";

export interface Error {
  code: number;
  message: string;
}

export interface User {
  id?: string | undefined;
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  salt?: string | undefined;
}

export interface UserEvent {
  error?: Error | undefined;
  user: User | undefined;
}

export interface SearchUsersParams {
  email?: string | undefined;
  username?: string | undefined;
  usersIds: string[];
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface SearchUsersEvent {
  error?: Error | undefined;
  searchParams: SearchUsersParams | undefined;
  users: User[];
}

export const EVENTBUS_PACKAGE_NAME = "eventbus";

export interface UsersEventsServiceClient {
  getUserByIdEvent(request: UserEvent): Observable<Empty>;

  searchUsersEvent(request: SearchUsersEvent): Observable<Empty>;

  createUserEvent(request: UserEvent): Observable<Empty>;

  updateUserEvent(request: UserEvent): Observable<Empty>;

  deleteUserEvent(request: UserEvent): Observable<Empty>;
}

export interface UsersEventsServiceController {
  getUserByIdEvent(request: UserEvent): void;

  searchUsersEvent(request: SearchUsersEvent): void;

  createUserEvent(request: UserEvent): void;

  updateUserEvent(request: UserEvent): void;

  deleteUserEvent(request: UserEvent): void;
}

export function UsersEventsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUserByIdEvent",
      "searchUsersEvent",
      "createUserEvent",
      "updateUserEvent",
      "deleteUserEvent",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("UsersEventsService", method)(
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
      GrpcStreamMethod("UsersEventsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const USERS_EVENTS_SERVICE_NAME = "UsersEventsService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
