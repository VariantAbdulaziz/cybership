import * as React from "react";
import { LoginForm } from "@/components/auth/login-form";

const Login = () => {
  return (
    <main
      className={
        "flex min-h-screen items-center justify-center max-md:flex-col max-md:items-start"
      }
    >
      <LoginForm />
    </main>
  );
};

export default Login;
