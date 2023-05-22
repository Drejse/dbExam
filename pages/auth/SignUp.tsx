// src/components/SignUp.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseConnector';

function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log(email, password)
  const handleSignUp = async (e:any) => {
    
    try {
      e.preventDefault()
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw error;
      }
      
      console.log('User signed up successfully');
      setEmail('');
      setPassword('');
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  }; 

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
