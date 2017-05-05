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
      table.dateTime('lastSeen');
      table.string('lastLoginIp', 45);
    }),

  ]);
  
};

exports.down = function(knex, Promise) {
  
};
