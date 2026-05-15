create database pxldb;
\c pxldb

CREATE EXTENSION IF NOT EXISTS pgcrypto;

create user secadv with password 'ilovesecurity';
grant all privileges on database pxldb to secadv;
BEGIN;

create table users (id serial primary key, user_name text not null unique, password text not null);
grant all privileges on table users to secadv;



INSERT INTO users (user_name, password) VALUES
    ('pxl-admin', crypt('secureandlovinit', gen_salt('bf'))),
    ('george',    crypt('iwishihadbetteradmins', gen_salt('bf')));

COMMIT;