/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "eventbus";

export interface Void {}

export interface User {
  id?: string | undefined;
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  salt?: string | undefined;
}

export interface SearchUsersParams {
  email?: string | undefined;
  username?: string | undefined;
  usersIds: string[];
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface SearchUsersEvent {
  searchParams: SearchUsersParams | undefined;
  users: User[];
}

export const EVENTBUS_PACKAGE_NAME = "eventbus";

export interface UsersEventsServiceClient {
  getUserByIdEvent(request: User): Observable<Void>;

  searchUsersEvent(request: SearchUsersEvent): Observable<Void>;

  createUserEvent(request: User): Observable<Void>;

  updateUserEvent(request: User): Observable<Void>;

  deleteUserEvent(request: User): Observable<Void>;
}

export interface UsersEventsServiceController {
  getUserByIdEvent(request: User): Promise<Void> | Observable<Void> | Void;

  searchUsersEvent(
    request: SearchUsersEvent
  ): Promise<Void> | Observable<Void> | Void;

  createUserEvent(request: User): Promise<Void> | Observable<Void> | Void;

  updateUserEvent(request: User): Promise<Void> | Observable<Void> | Void;

  deleteUserEvent(request: User): Promise<Void> | Observable<Void> | Void;
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
