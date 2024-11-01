import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { publicProcedure } from "../procedures/public-procedure";
import bcrypt from "bcrypt";
import { JWTPayload, SignJWT } from "jose";
import { RegisterSchema } from "@/lib/validations/register-schema";
import { LoginSchema } from "@/lib/validations/login-schema";

const secretKey = process.env.SECRET_KEY;

async function generateToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(secretKey));
}

export const authRouter = router({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, firstName, lastName } = input;
      const { db } = ctx;

      const existingUser = await db.appUser.findUnique({ where: { email } });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const passwordHashBuffer = Buffer.from(hashedPassword);

      const user = await db.appUser.create({
        data: {
          email,
          passwordHash: passwordHashBuffer,
          firstName,
          lastName,
        },
      });

      const token = await generateToken({
        id: user.id,
        email: user.email,
        firstName,
        lastName,
      });

      return { id: user.id.toString(), email, firstName, lastName, token };
    }),

  login: publicProcedure.input(LoginSchema).mutation(async ({ input, ctx }) => {
    const { email, password } = input;
    const { db } = ctx;

    const user = await db.appUser.findUnique({ where: { email } });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash.toString()
    );
    if (!isPasswordValid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      id: user.id.toString(),
      email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    };
  }),
});
