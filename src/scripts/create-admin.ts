import * as bcrypt from 'bcryptjs';
import { AppDataSource } from '@/database';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';

function getArgValue(name: string): string | undefined {
  const arg = process.argv.find((item) => item.startsWith(`${name}=`));
  if (arg) {
    return arg.slice(name.length + 1);
  }

  const index = process.argv.indexOf(name);
  if (index >= 0) {
    return process.argv[index + 1];
  }

  return undefined;
}

function requireArg(name: string): string {
  const value = getArgValue(name)?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name} argument. Example: npx ts-node -r tsconfig-paths/register src/scripts/create-admin.ts ${name}=value`,
    );
  }

  return value;
}

async function main() {
  const firstName = requireArg('--firstName');
  const lastName = requireArg('--lastName');
  const email = requireArg('--email').toLowerCase();
  const username = requireArg('--username');
  const phone = requireArg('--phone');
  const password = requireArg('--password');

  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);

  try {
    const existingByEmail = await userRepository.findOne({ where: { email } });
    if (existingByEmail) {
      throw new Error(`A user with email "${email}" already exists.`);
    }

    const existingByUsername = await userRepository.findOne({
      where: { username },
    });
    if (existingByUsername) {
      throw new Error(`A user with username "${username}" already exists.`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      firstName,
      lastName,
      email,
      username,
      phone,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    const savedUser = await userRepository.save(user);

    console.log('Super admin created successfully.');
    console.log(
      JSON.stringify(
        {
          id: savedUser.id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          username: savedUser.username,
          role: savedUser.role,
        },
        null,
        2,
      ),
    );
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
