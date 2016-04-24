'use strict';

exports.up = function(knex, Promise) {
  
  return Promise.all([

    // Users
    knex.schema.createTableIfNotExists('users', (table) => {
      table.increments('id').primary().unique().notNullable();
      table.uuid('uuid').unique().notNullable();
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.string('email', 254).notNullable().unique();
      table.string('password', 128);
      table.string('firstName', 100);
      table.string('lastName', 100);
      table.integer('role').notNullable().defaultTo(0);
      table.boolean('isActive').notNullable().defaultTo(true);
      table.boolean('confirmedTerms').notNullable();
      table.dateTime('lastLogin');
      table.string('lastLoginIp', 45);
    }),

    // Keys
    knex.schema.createTableIfNotExists('keys', (table) => {
      table.increments('id').primary().unique().notNullable();
      table.uuid('key').unique().notNullable();
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.boolean('isActive').notNullable().defaultTo(true);
      table.integer('userId').unsigned().references('users.id');
    }),

    // Requests
    knex.schema.createTableIfNotExists('requests', (table) => {
      table.increments('id').primary().unique().notNullable();
      table.dateTime('createdAt');
      table.integer('keyId').unsigned().references('keys.id');
      table.string('ipAddress', 45);
      table.string('hostname', 255);
      table.string('method', 10);
      table.string('url', 2000);
      table.string('path', 255);
      table.string('protocol', 10);
      table.string('query', 1000);
    }),

  ]);
  
};

exports.down = function(knex, Promise) {
  
};
