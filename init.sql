create type user_role as enum('admin', 'non_admin');
create table "user"(
  user_id serial primary key,
  username varchar(36) unique,
  nama_lengkap varchar(256),
  jabatan varchar(256),
  "role" user_role,
	"password" char(60), -- stored in bcrypt hash
  no_hp char(15),
  ctime timestamp default current_timestamp
);

create type user_activity as enum(
  'login',
  'logout',
  'visit'
 );
create table "user_log"(
  user_log_id serial primary key,
  user_id int references "user"(user_id),
  activity user_activity,
  activity_data jsonb,
	time timestamp default current_timestamp
);

-- default password: `password`
INSERT INTO "user" (
      username, nama_lengkap, jabatan, "role", "password", no_hp
    ) VALUES (
      'admin', 'admin', 'admin', 'admin', '$2b$11$GMjIcNsWkODEZ5x32ldwxuTDfh7pUzJRY0ELEjqc0fQWwHw7hJ6am', 123
    );
