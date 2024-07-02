import pgclient from "@/utils/db.server"
import bcrypt from "bcrypt";

const config = useRuntimeConfig();

export default defineEventHandler({
  onRequest: [auth("admin")],
  handler: async (event) => {
    const body = await readBody(event);
    const password = bcrypt.hashSync(body.password, config.saltRounds);
    const res = await pgclient.query(
      `
      INSERT INTO "user"(
        username, nama_lengkap, jabatan, "role", "password", no_hp
      ) VALUES(
        $1, $2, $3, $4, $5, $6
      )
      `,
      [
        body.username,
        body.nama_lengkap,
        body.jabatan,
        body.role,
        password,
        body.no_hp,
      ]
    );

    return {
      message: "Success",
    };
  }
});
