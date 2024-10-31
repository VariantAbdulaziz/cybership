import * as React from "react";
import { RegistrationForm } from "@/components/auth/registration-form";

const RegisterationPage = () => {
  return (
    <main
      className={
        "flex min-h-screen items-center justify-center max-md:flex-col max-md:items-start"
      }
    >
      <RegistrationForm />
    </main>
  );
};

export default RegisterationPage;
