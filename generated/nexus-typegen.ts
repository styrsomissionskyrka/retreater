/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import { Context } from './../lib/api/context/index';
import { Retreat } from '@prisma/client';
import { FieldAuthorizeResolver } from 'nexus/dist/plugins/fieldAuthorizePlugin';
import { core, connectionPluginCore } from 'nexus';
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * Date custom scalar type
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void; // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * Date custom scalar type
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void; // "Date";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>,
    ): void;
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  UpdateRetreatInput: {
    // input type
    content?: string | null; // String
    endDate?: NexusGenScalars['Date'] | null; // Date
    maxParticipants?: number | null; // Int
    startDate?: NexusGenScalars['Date'] | null; // Date
    title?: string | null; // String
  };
}

export interface NexusGenEnums {
  OrderEnum: 'asc' | 'desc';
  RetreatOrderByEnum: 'createdAt' | 'startDate' | 'status';
  RetreatStatusEnum: 'ARCHIVED' | 'DRAFT' | 'PUBLISHED';
  UserRoleEnum: 'admin' | 'editor' | 'superadmin';
  UserSortByEnum: 'created_at' | 'email' | 'name';
}

export interface NexusGenScalars {
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  Date: any;
}

export interface NexusGenObjects {
  Mutation: {};
  PageInfo: {
    // root type
    endCursor?: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor?: string | null; // String
  };
  Query: {};
  Retreat: Retreat;
  RetreatConnection: {
    // root type
    edges?: Array<NexusGenRootTypes['RetreatEdge'] | null> | null; // [RetreatEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  };
  RetreatEdge: {
    // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['Retreat'] | null; // Retreat
  };
  User: {
    // root type
    createdAt: NexusGenScalars['Date']; // Date!
    email: string; // String!
    emailVerified: boolean; // Boolean!
    id: string; // ID!
    lastIp?: string | null; // String
    lastLogin?: NexusGenScalars['Date'] | null; // Date
    loginsCount: number; // Int!
    name?: string | null; // String
    picture?: string | null; // String
    updateAt: NexusGenScalars['Date']; // Date!
  };
  UserConnection: {
    // root type
    edges?: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  };
  UserEdge: {
    // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['User'] | null; // User
  };
}

export interface NexusGenInterfaces {}

export interface NexusGenUnions {}

export type NexusGenRootTypes = NexusGenObjects;

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums;

export interface NexusGenFieldTypes {
  Mutation: {
    // field return type
    createRetreatDraft: NexusGenRootTypes['Retreat'] | null; // Retreat
    setRetreatStatus: NexusGenRootTypes['Retreat'] | null; // Retreat
    updateRetreat: NexusGenRootTypes['Retreat'] | null; // Retreat
  };
  PageInfo: {
    // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  };
  Query: {
    // field return type
    me: NexusGenRootTypes['User'] | null; // User
    retreat: NexusGenRootTypes['Retreat'] | null; // Retreat
    retreats: NexusGenRootTypes['RetreatConnection'] | null; // RetreatConnection
    user: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['UserConnection'] | null; // UserConnection
  };
  Retreat: {
    // field return type
    content: string | null; // String
    createdAt: NexusGenScalars['Date']; // Date!
    createdBy: NexusGenRootTypes['User'] | null; // User
    endDate: NexusGenScalars['Date'] | null; // Date
    id: string; // ID!
    maxParticipants: number | null; // Int
    slug: string; // String!
    startDate: NexusGenScalars['Date'] | null; // Date
    status: NexusGenEnums['RetreatStatusEnum']; // RetreatStatusEnum!
    title: string; // String!
    updatedAt: NexusGenScalars['Date']; // Date!
  };
  RetreatConnection: {
    // field return type
    edges: Array<NexusGenRootTypes['RetreatEdge'] | null> | null; // [RetreatEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  };
  RetreatEdge: {
    // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Retreat'] | null; // Retreat
  };
  User: {
    // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    email: string; // String!
    emailVerified: boolean; // Boolean!
    id: string; // ID!
    lastIp: string | null; // String
    lastLogin: NexusGenScalars['Date'] | null; // Date
    loginsCount: number; // Int!
    name: string | null; // String
    picture: string | null; // String
    roles: NexusGenEnums['UserRoleEnum'][]; // [UserRoleEnum!]!
    updateAt: NexusGenScalars['Date']; // Date!
  };
  UserConnection: {
    // field return type
    edges: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  };
  UserEdge: {
    // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['User'] | null; // User
  };
}

export interface NexusGenFieldTypeNames {
  Mutation: {
    // field return type name
    createRetreatDraft: 'Retreat';
    setRetreatStatus: 'Retreat';
    updateRetreat: 'Retreat';
  };
  PageInfo: {
    // field return type name
    endCursor: 'String';
    hasNextPage: 'Boolean';
    hasPreviousPage: 'Boolean';
    startCursor: 'String';
  };
  Query: {
    // field return type name
    me: 'User';
    retreat: 'Retreat';
    retreats: 'RetreatConnection';
    user: 'User';
    users: 'UserConnection';
  };
  Retreat: {
    // field return type name
    content: 'String';
    createdAt: 'Date';
    createdBy: 'User';
    endDate: 'Date';
    id: 'ID';
    maxParticipants: 'Int';
    slug: 'String';
    startDate: 'Date';
    status: 'RetreatStatusEnum';
    title: 'String';
    updatedAt: 'Date';
  };
  RetreatConnection: {
    // field return type name
    edges: 'RetreatEdge';
    pageInfo: 'PageInfo';
  };
  RetreatEdge: {
    // field return type name
    cursor: 'String';
    node: 'Retreat';
  };
  User: {
    // field return type name
    createdAt: 'Date';
    email: 'String';
    emailVerified: 'Boolean';
    id: 'ID';
    lastIp: 'String';
    lastLogin: 'Date';
    loginsCount: 'Int';
    name: 'String';
    picture: 'String';
    roles: 'UserRoleEnum';
    updateAt: 'Date';
  };
  UserConnection: {
    // field return type name
    edges: 'UserEdge';
    pageInfo: 'PageInfo';
  };
  UserEdge: {
    // field return type name
    cursor: 'String';
    node: 'User';
  };
}

export interface NexusGenArgTypes {
  Mutation: {
    createRetreatDraft: {
      // args
      title: string; // String!
    };
    setRetreatStatus: {
      // args
      id: string; // ID!
      status: NexusGenEnums['RetreatStatusEnum']; // RetreatStatusEnum!
    };
    updateRetreat: {
      // args
      id: string; // ID!
      input: NexusGenInputs['UpdateRetreatInput']; // UpdateRetreatInput!
    };
  };
  Query: {
    retreat: {
      // args
      id?: string | null; // ID
      slug?: string | null; // String
    };
    retreats: {
      // args
      after?: string | null; // String
      first: number; // Int!
      order: NexusGenEnums['OrderEnum'] | null; // OrderEnum
      orderBy: NexusGenEnums['RetreatOrderByEnum'] | null; // RetreatOrderByEnum
      status?: NexusGenEnums['RetreatStatusEnum'] | null; // RetreatStatusEnum
    };
    user: {
      // args
      id: string; // ID!
    };
    users: {
      // args
      after?: string | null; // String
      first: number; // Int!
      order: NexusGenEnums['OrderEnum']; // OrderEnum!
      orderBy: NexusGenEnums['UserSortByEnum']; // UserSortByEnum!
      search?: string | null; // String
    };
  };
}

export interface NexusGenAbstractTypeMembers {}

export interface NexusGenTypeInterfaces {}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false;
    resolveType: true;
    __typename: false;
  };
};

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes:
    | NexusGenTypes['objectNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['unionNames']
    | NexusGenTypes['interfaceNames']
    | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes'];
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>;
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {}
  interface NexusGenPluginSchemaConfig {}
  interface NexusGenPluginArgConfig {}
}
