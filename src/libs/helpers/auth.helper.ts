import { GenerateToken, CheckPassword, EncryptPassword } from '../utils/app.utility'
import Auth from '../../models/users.model'

export async function Login (body: any, UserTable: any): Promise<any> {
  try {
    let token
    const { email, password } = body

    if ((email === '') || (password === '')) {
      return { code: 400, message: 'Email and password is required' }
    }

    const account: any = await Auth.findOne({ where: { email } })
    if (account === null) {
      const result: any = {
        message: 'Email Address Not Found!',
        code: 400
      }
      return result
    }

    if (account.status !== 'active') {
      const result: any = {
        message: 'Your account has not been Verified!',
        code: 403
      }
      return result
    }

    const validPass = await CheckPassword(password, account.passwordhash)
    if (!validPass) {
      const result: any = {
        message: 'Incorret Password!',
        code: 400
      }
      return result
    }

    const user = await UserTable.findOne({ where: { email } })
    if (user === null) {
      const result: any = {
        message: 'An error is found in onboarding this email address',
        code: 400
      }
      return result
    }

    if (user !== null) {
      token = GenerateToken(user)
    }

    return { success: true, code: 200, data: user, token }
  } catch (error: any) {
    const result: any = {
      message: 'Error login in: ' + error.message,
      code: 400
    }
    return result
  }
}

export async function Register (body: any): Promise<any> {
  const Checkaccount: any = await Auth.findOne({ where: { Email: body.Email } })
  if (Checkaccount !== null) {
    throw Error('Email Address Already Exist')
  }
  const account: any = {}
  account.UserID = body.UserID
  account.FirstName = body.FirstName
  account.LastName = body.LastName
  account.Email = body.Email
  account.Role = body.Role
  account.TargetRole = body.TargetRole
  account.UserType = body.UserType
  account.PasswordHash = await EncryptPassword(body.Password)
  account.RefreshToken = account.PasswordHash
  account.Token = Math.floor(Math.random() * 10000)
  account.Verified = '0'
  const daccount = await Auth.create({ ...account })
  return daccount
}
