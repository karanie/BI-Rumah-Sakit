// auth.d.ts
declare module '#auth-utils' {
  interface User {
    user_id: number,
    username: string,
    nama_lengkap: string,
    jabatan: string,
    role: string
  }
}

export {}
