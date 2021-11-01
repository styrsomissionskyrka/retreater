/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../api/context/index"
import type { StripePaymentIntent, StripeLineItem, StripeCheckoutSession, StripeCoupon, StripePrice, StripeProduct, StripeRefund, Role, User } from "./../api/source-types"
import type { LogItem, Order, Retreat } from "@prisma/client"
import type { core, connectionPluginCore } from "nexus"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CreateOrderInput: { // input type
    discount?: number | null; // Int
    email: string; // String!
    name: string; // String!
    price: string; // ID!
    retreatId: string; // ID!
  }
  CreatePriceInput: { // input type
    active?: boolean | null; // Boolean
    amount: number; // Int!
    currency: string; // String!
    nickname?: string | null; // String
  }
  CreateProductInput: { // input type
    active?: boolean | null; // Boolean
    description?: string | null; // String
    images?: string[] | null; // [String!]
    name: string; // String!
  }
  UpdateOrderPriceInput: { // input type
    discount?: number | null; // Int
    price?: string | null; // ID
  }
  UpdatePriceInput: { // input type
    active?: boolean | null; // Boolean
    nickname?: string | null; // String
  }
  UpdateProductInput: { // input type
    active?: boolean | null; // Boolean
    description?: string | null; // String
    images?: string[] | null; // [String!]
    name?: string | null; // String
  }
  UpdateRetreatInput: { // input type
    content?: string | null; // String
    endDate?: NexusGenScalars['Date'] | null; // Date
    maxParticipants?: number | null; // Int
    startDate?: NexusGenScalars['Date'] | null; // Date
    title?: string | null; // String
  }
  UpdateUserInput: { // input type
    email?: string | null; // String
    name?: string | null; // String
    nickname?: string | null; // String
  }
}

export interface NexusGenEnums {
  CheckoutSessionStatusEnum: "no_payment_required" | "paid" | "unpaid"
  LogEventEnum: "order.checkout_completed" | "order.checkout_initiated" | "order.created" | "order.metadata_updated" | "order.status_updated" | "retreat.archived" | "retreat.created" | "retreat.price_created" | "retreat.price_updated" | "retreat.published" | "retreat.unpublished" | "retreat.updated"
  OrderEnum: "asc" | "desc"
  OrderOrderByEnum: "createdAt" | "status"
  OrderStatusEnum: "CANCELLED" | "CONFIRMED" | "CREATED" | "DECLINED" | "ERRORED" | "PARTIALLY_CONFIRMED" | "PENDING"
  RefundReasonEnum: "duplicate" | "fraudulent" | "requested_by_customer"
  RefundStatusEnum: "canceled" | "failed" | "pending" | "succeeded"
  RetreatOrderByEnum: "createdAt" | "startDate" | "status"
  RetreatStatusEnum: "ARCHIVED" | "DRAFT" | "PUBLISHED"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: Date
}

export interface NexusGenObjects {
  CheckoutSession: StripeCheckoutSession;
  Coupon: StripeCoupon;
  InviteUser: { // root type
    ticket: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  LineItem: StripeLineItem;
  LogItem: LogItem;
  Mutation: {};
  Order: Order;
  OrderCheckoutSession: { // root type
    checkoutSession: NexusGenRootTypes['CheckoutSession']; // CheckoutSession!
    order: NexusGenRootTypes['Order']; // Order!
  }
  PaginatedOrder: { // root type
    items: NexusGenRootTypes['Order'][]; // [Order!]!
    paginationMeta: NexusGenRootTypes['PaginationMeta']; // PaginationMeta!
  }
  PaginatedRetreat: { // root type
    items: NexusGenRootTypes['Retreat'][]; // [Retreat!]!
    paginationMeta: NexusGenRootTypes['PaginationMeta']; // PaginationMeta!
  }
  PaginatedUser: { // root type
    items: NexusGenRootTypes['User'][]; // [User!]!
    paginationMeta: NexusGenRootTypes['PaginationMeta']; // PaginationMeta!
  }
  PaginationMeta: { // root type
    currentPage: number; // Int!
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    perPage: number; // Int!
    totalItems: number; // Int!
    totalPages: number; // Int!
  }
  PaymentIntent: StripePaymentIntent;
  Price: StripePrice;
  Product: StripeProduct;
  Query: {};
  Refund: StripeRefund;
  Retreat: Retreat;
  Role: Role;
  User: User;
}

export interface NexusGenInterfaces {
  PaginatedQuery: NexusGenRootTypes['PaginatedOrder'] | NexusGenRootTypes['PaginatedRetreat'] | NexusGenRootTypes['PaginatedUser'];
}

export interface NexusGenUnions {
  LogItemType: NexusGenRootTypes['Order'] | NexusGenRootTypes['Retreat'];
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects & NexusGenUnions

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  CheckoutSession: { // field return type
    amount: number | null; // Int
    currency: string | null; // String
    customerEmail: string | null; // String
    id: string; // ID!
    lineItems: NexusGenRootTypes['LineItem'][]; // [LineItem!]!
    paymentIntent: NexusGenRootTypes['PaymentIntent'] | null; // PaymentIntent
    status: NexusGenEnums['CheckoutSessionStatusEnum']; // CheckoutSessionStatusEnum!
  }
  Coupon: { // field return type
    amountOff: number | null; // Int
    created: NexusGenScalars['Date']; // Date!
    currency: string | null; // String
    id: string; // ID!
    percentOff: number | null; // Float
  }
  InviteUser: { // field return type
    ticket: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  LineItem: { // field return type
    amountSubtotal: number; // Int!
    amountTotal: number; // Int!
    currency: string; // String!
    description: string | null; // String
    id: string; // ID!
    price: NexusGenRootTypes['Price'] | null; // Price
    quantity: number | null; // Int
  }
  LogItem: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    event: NexusGenEnums['LogEventEnum']; // LogEventEnum!
    id: string; // ID!
    item: NexusGenRootTypes['LogItemType'] | null; // LogItemType
  }
  Mutation: { // field return type
    cancelOrder: NexusGenRootTypes['Order'] | null; // Order
    checkoutOrder: NexusGenRootTypes['OrderCheckoutSession']; // OrderCheckoutSession!
    createOrder: NexusGenRootTypes['Order']; // Order!
    createPrice: NexusGenRootTypes['Price'] | null; // Price
    createProduct: NexusGenRootTypes['Product'] | null; // Product
    createRefund: NexusGenRootTypes['Refund']; // Refund!
    createRetreatDraft: NexusGenRootTypes['Retreat'] | null; // Retreat
    inviteUser: NexusGenRootTypes['InviteUser'] | null; // InviteUser
    removeUser: NexusGenRootTypes['User'] | null; // User
    setRetreatStatus: NexusGenRootTypes['Retreat'] | null; // Retreat
    updateOrderPrice: NexusGenRootTypes['Order'] | null; // Order
    updatePrice: NexusGenRootTypes['Price'] | null; // Price
    updateProduct: NexusGenRootTypes['Product'] | null; // Product
    updateProductPrice: NexusGenRootTypes['Price'] | null; // Price
    updateRetreat: NexusGenRootTypes['Retreat'] | null; // Retreat
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  Order: { // field return type
    cancelledAt: NexusGenScalars['Date'] | null; // Date
    checkoutSessions: NexusGenRootTypes['CheckoutSession'][]; // [CheckoutSession!]!
    confirmedAt: NexusGenScalars['Date'] | null; // Date
    coupon: NexusGenRootTypes['Coupon'] | null; // Coupon
    createdAt: NexusGenScalars['Date']; // Date!
    email: string; // String!
    id: string; // ID!
    name: string; // String!
    price: NexusGenRootTypes['Price']; // Price!
    refunds: NexusGenRootTypes['Refund'][]; // [Refund!]!
    retreat: NexusGenRootTypes['Retreat']; // Retreat!
    status: NexusGenEnums['OrderStatusEnum']; // OrderStatusEnum!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  OrderCheckoutSession: { // field return type
    checkoutSession: NexusGenRootTypes['CheckoutSession']; // CheckoutSession!
    order: NexusGenRootTypes['Order']; // Order!
  }
  PaginatedOrder: { // field return type
    items: NexusGenRootTypes['Order'][]; // [Order!]!
    paginationMeta: NexusGenRootTypes['PaginationMeta']; // PaginationMeta!
  }
  PaginatedRetreat: { // field return type
    items: NexusGenRootTypes['Retreat'][]; // [Retreat!]!
    paginationMeta: NexusGenRootTypes['PaginationMeta']; // PaginationMeta!
  }
  PaginatedUser: { // field return type
    items: NexusGenRootTypes['User'][]; // [User!]!
    paginationMeta: NexusGenRootTypes['PaginationMeta']; // PaginationMeta!
  }
  PaginationMeta: { // field return type
    currentPage: number; // Int!
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    perPage: number; // Int!
    totalItems: number; // Int!
    totalPages: number; // Int!
  }
  PaymentIntent: { // field return type
    amount: number; // Int!
    created: NexusGenScalars['Date']; // Date!
    currency: string; // String!
    id: string; // ID!
    refundable: number; // Int!
    refunded: number; // Int!
  }
  Price: { // field return type
    active: boolean; // Boolean!
    amount: number; // Int!
    created: NexusGenScalars['Date']; // Date!
    currency: string; // String!
    id: string; // ID!
    nickname: string | null; // String
    product: NexusGenRootTypes['Product']; // Product!
  }
  Product: { // field return type
    active: boolean; // Boolean!
    created: NexusGenScalars['Date']; // Date!
    description: string | null; // String
    id: string; // ID!
    images: string[]; // [String!]!
    name: string | null; // String
    prices: NexusGenRootTypes['Price'][]; // [Price!]!
    updated: NexusGenScalars['Date']; // Date!
    url: string | null; // String
  }
  Query: { // field return type
    logs: NexusGenRootTypes['LogItem'][]; // [LogItem!]!
    me: NexusGenRootTypes['User'] | null; // User
    order: NexusGenRootTypes['Order'] | null; // Order
    orders: NexusGenRootTypes['PaginatedOrder']; // PaginatedOrder!
    paymentIntent: NexusGenRootTypes['PaymentIntent']; // PaymentIntent!
    retreat: NexusGenRootTypes['Retreat'] | null; // Retreat
    retreats: NexusGenRootTypes['PaginatedRetreat']; // PaginatedRetreat!
    user: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['PaginatedUser']; // PaginatedUser!
  }
  Refund: { // field return type
    amount: number; // Int!
    created: NexusGenScalars['Date']; // Date!
    currency: string; // String!
    id: string; // ID!
    reason: string | null; // String
    status: NexusGenEnums['RefundStatusEnum']; // RefundStatusEnum!
  }
  Retreat: { // field return type
    bookedParticipants: number; // Int!
    canDeactivate: boolean; // Boolean!
    canPlaceOrder: boolean; // Boolean!
    content: string | null; // String
    createdAt: NexusGenScalars['Date']; // Date!
    endDate: NexusGenScalars['Date'] | null; // Date
    id: string; // ID!
    maxParticipants: number; // Int!
    orders: NexusGenRootTypes['Order'][] | null; // [Order!]
    products: NexusGenRootTypes['Product'][]; // [Product!]!
    slug: string; // String!
    startDate: NexusGenScalars['Date'] | null; // Date
    status: NexusGenEnums['RetreatStatusEnum']; // RetreatStatusEnum!
    title: string; // String!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  Role: { // field return type
    description: string | null; // String
    id: string; // ID!
    name: string; // String!
  }
  User: { // field return type
    createdAt: NexusGenScalars['Date'] | null; // Date
    email: string | null; // String
    emailVerified: boolean | null; // Boolean
    id: string; // ID!
    lastIp: string | null; // String
    lastLogin: string | null; // String
    loginsCount: number | null; // Int
    name: string | null; // String
    nickname: string | null; // String
    picture: string | null; // String
    roles: NexusGenRootTypes['Role'][]; // [Role!]!
    updatedAt: NexusGenScalars['Date'] | null; // Date
  }
  PaginatedQuery: { // field return type
    paginationMeta: NexusGenRootTypes['PaginationMeta']; // PaginationMeta!
  }
}

export interface NexusGenFieldTypeNames {
  CheckoutSession: { // field return type name
    amount: 'Int'
    currency: 'String'
    customerEmail: 'String'
    id: 'ID'
    lineItems: 'LineItem'
    paymentIntent: 'PaymentIntent'
    status: 'CheckoutSessionStatusEnum'
  }
  Coupon: { // field return type name
    amountOff: 'Int'
    created: 'Date'
    currency: 'String'
    id: 'ID'
    percentOff: 'Float'
  }
  InviteUser: { // field return type name
    ticket: 'String'
    user: 'User'
  }
  LineItem: { // field return type name
    amountSubtotal: 'Int'
    amountTotal: 'Int'
    currency: 'String'
    description: 'String'
    id: 'ID'
    price: 'Price'
    quantity: 'Int'
  }
  LogItem: { // field return type name
    createdAt: 'Date'
    event: 'LogEventEnum'
    id: 'ID'
    item: 'LogItemType'
  }
  Mutation: { // field return type name
    cancelOrder: 'Order'
    checkoutOrder: 'OrderCheckoutSession'
    createOrder: 'Order'
    createPrice: 'Price'
    createProduct: 'Product'
    createRefund: 'Refund'
    createRetreatDraft: 'Retreat'
    inviteUser: 'InviteUser'
    removeUser: 'User'
    setRetreatStatus: 'Retreat'
    updateOrderPrice: 'Order'
    updatePrice: 'Price'
    updateProduct: 'Product'
    updateProductPrice: 'Price'
    updateRetreat: 'Retreat'
    updateUser: 'User'
  }
  Order: { // field return type name
    cancelledAt: 'Date'
    checkoutSessions: 'CheckoutSession'
    confirmedAt: 'Date'
    coupon: 'Coupon'
    createdAt: 'Date'
    email: 'String'
    id: 'ID'
    name: 'String'
    price: 'Price'
    refunds: 'Refund'
    retreat: 'Retreat'
    status: 'OrderStatusEnum'
    updatedAt: 'Date'
  }
  OrderCheckoutSession: { // field return type name
    checkoutSession: 'CheckoutSession'
    order: 'Order'
  }
  PaginatedOrder: { // field return type name
    items: 'Order'
    paginationMeta: 'PaginationMeta'
  }
  PaginatedRetreat: { // field return type name
    items: 'Retreat'
    paginationMeta: 'PaginationMeta'
  }
  PaginatedUser: { // field return type name
    items: 'User'
    paginationMeta: 'PaginationMeta'
  }
  PaginationMeta: { // field return type name
    currentPage: 'Int'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    perPage: 'Int'
    totalItems: 'Int'
    totalPages: 'Int'
  }
  PaymentIntent: { // field return type name
    amount: 'Int'
    created: 'Date'
    currency: 'String'
    id: 'ID'
    refundable: 'Int'
    refunded: 'Int'
  }
  Price: { // field return type name
    active: 'Boolean'
    amount: 'Int'
    created: 'Date'
    currency: 'String'
    id: 'ID'
    nickname: 'String'
    product: 'Product'
  }
  Product: { // field return type name
    active: 'Boolean'
    created: 'Date'
    description: 'String'
    id: 'ID'
    images: 'String'
    name: 'String'
    prices: 'Price'
    updated: 'Date'
    url: 'String'
  }
  Query: { // field return type name
    logs: 'LogItem'
    me: 'User'
    order: 'Order'
    orders: 'PaginatedOrder'
    paymentIntent: 'PaymentIntent'
    retreat: 'Retreat'
    retreats: 'PaginatedRetreat'
    user: 'User'
    users: 'PaginatedUser'
  }
  Refund: { // field return type name
    amount: 'Int'
    created: 'Date'
    currency: 'String'
    id: 'ID'
    reason: 'String'
    status: 'RefundStatusEnum'
  }
  Retreat: { // field return type name
    bookedParticipants: 'Int'
    canDeactivate: 'Boolean'
    canPlaceOrder: 'Boolean'
    content: 'String'
    createdAt: 'Date'
    endDate: 'Date'
    id: 'ID'
    maxParticipants: 'Int'
    orders: 'Order'
    products: 'Product'
    slug: 'String'
    startDate: 'Date'
    status: 'RetreatStatusEnum'
    title: 'String'
    updatedAt: 'Date'
  }
  Role: { // field return type name
    description: 'String'
    id: 'ID'
    name: 'String'
  }
  User: { // field return type name
    createdAt: 'Date'
    email: 'String'
    emailVerified: 'Boolean'
    id: 'ID'
    lastIp: 'String'
    lastLogin: 'String'
    loginsCount: 'Int'
    name: 'String'
    nickname: 'String'
    picture: 'String'
    roles: 'Role'
    updatedAt: 'Date'
  }
  PaginatedQuery: { // field return type name
    paginationMeta: 'PaginationMeta'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    cancelOrder: { // args
      id?: string | null; // ID
      sessionId?: string | null; // ID
    }
    checkoutOrder: { // args
      id: string; // ID!
    }
    createOrder: { // args
      force?: boolean | null; // Boolean
      input: NexusGenInputs['CreateOrderInput']; // CreateOrderInput!
    }
    createPrice: { // args
      input: NexusGenInputs['CreatePriceInput']; // CreatePriceInput!
      productId: string; // ID!
    }
    createProduct: { // args
      input: NexusGenInputs['CreateProductInput']; // CreateProductInput!
      retreatId: string; // ID!
    }
    createRefund: { // args
      amount?: number | null; // Int
      order: string; // ID!
      paymentIntent: string; // ID!
      reason?: NexusGenEnums['RefundReasonEnum'] | null; // RefundReasonEnum
    }
    createRetreatDraft: { // args
      title: string; // String!
    }
    inviteUser: { // args
      email: string; // String!
    }
    removeUser: { // args
      id: string; // ID!
    }
    setRetreatStatus: { // args
      id: string; // ID!
      status: NexusGenEnums['RetreatStatusEnum']; // RetreatStatusEnum!
    }
    updateOrderPrice: { // args
      id: string; // ID!
      input: NexusGenInputs['UpdateOrderPriceInput']; // UpdateOrderPriceInput!
    }
    updatePrice: { // args
      id: string; // ID!
      input: NexusGenInputs['UpdatePriceInput']; // UpdatePriceInput!
    }
    updateProduct: { // args
      id: string; // ID!
      input: NexusGenInputs['UpdateProductInput']; // UpdateProductInput!
    }
    updateProductPrice: { // args
      input: NexusGenInputs['CreatePriceInput']; // CreatePriceInput!
      productId: string; // ID!
    }
    updateRetreat: { // args
      id: string; // ID!
      input: NexusGenInputs['UpdateRetreatInput']; // UpdateRetreatInput!
    }
    updateUser: { // args
      id: string; // ID!
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
  }
  Product: {
    prices: { // args
      active?: boolean | null; // Boolean
    }
  }
  Query: {
    logs: { // args
      id: string; // ID!
    }
    order: { // args
      id: string; // ID!
    }
    orders: { // args
      order: NexusGenEnums['OrderEnum']; // OrderEnum!
      orderBy: NexusGenEnums['OrderOrderByEnum']; // OrderOrderByEnum!
      page: number; // Int!
      perPage: number; // Int!
      retreatId?: string | null; // ID
      search?: string | null; // String
      status: NexusGenEnums['OrderStatusEnum'] | null; // OrderStatusEnum
    }
    paymentIntent: { // args
      id: string; // ID!
    }
    retreat: { // args
      id?: string | null; // ID
      slug?: string | null; // String
    }
    retreats: { // args
      order: NexusGenEnums['OrderEnum']; // OrderEnum!
      orderBy: NexusGenEnums['RetreatOrderByEnum']; // RetreatOrderByEnum!
      page: number; // Int!
      perPage: number; // Int!
      search?: string | null; // String
      status?: NexusGenEnums['RetreatStatusEnum'] | null; // RetreatStatusEnum
    }
    user: { // args
      email?: string | null; // String
      id?: string | null; // ID
    }
    users: { // args
      page: number; // Int!
      perPage: number; // Int!
      search?: string | null; // String
    }
  }
  Retreat: {
    orders: { // args
      status?: NexusGenEnums['OrderStatusEnum'] | null; // OrderStatusEnum
    }
    products: { // args
      active?: boolean | null; // Boolean
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  LogItemType: "Order" | "Retreat"
  PaginatedQuery: "PaginatedOrder" | "PaginatedRetreat" | "PaginatedUser"
}

export interface NexusGenTypeInterfaces {
  PaginatedOrder: "PaginatedQuery"
  PaginatedRetreat: "PaginatedQuery"
  PaginatedUser: "PaginatedQuery"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = keyof NexusGenUnions;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "LogItemType" | "PaginatedQuery";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

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
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}