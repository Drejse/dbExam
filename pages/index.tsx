import Link from 'next/link';

function Home() {
  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <Link href="/auth/SignUp">Sign Up</Link>
      <Link href="/auth/Login">Login</Link>
    </div>
  );
}

export default Home;
