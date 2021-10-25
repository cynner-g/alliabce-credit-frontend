import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
export default function Login() {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <div>
        <input type="text" id="username" placeholder="User Name" value={userName} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="username" />
      </div>
      <div>
        <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="password" />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
      <Link href="/signup"><a>Signup</a></Link>
      <Link href="/forgot-password"><a>Forgot Password</a></Link>
    </div>
  )
}
