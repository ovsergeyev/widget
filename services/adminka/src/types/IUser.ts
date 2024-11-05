export interface IUser {
  id: number
  username: string
  role: string
  is_active: boolean
  is_deleted: boolean
  created_at: string;
  updated_at: string;
}
export interface IUserLogin {
  username: string
  password: string
}

export interface IUserCreate extends IUserLogin {
  role: string
}

export interface IUserEdit {
  id: number
  username: string
  password: string
  role: string
  is_active: boolean
  is_deleted: boolean
}