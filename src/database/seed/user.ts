import { createServerAuth } from '@/libs/auth';
import db from '@/libs/db/client';
import { faker } from '@/libs/db/utils';
const auth = createServerAuth();
export const createUserData = async () => {
    // 使用better-auth的内部API创建用户
    const result = await auth.api.signUpEmail({
        body: {
            name: 'pincman',
            email: 'pincman@example.com',
            password: '12345678aA$',
            username: 'pincman',
            displayUsername: 'pincman',
        },
    });

    // 获取创建的用户并设置为已激活状态
    if (result?.user?.email) {
        await db.user.update({
            where: { email: result.user.email },
            data: { emailVerified: true },
        });
    }
    for (let index = 0; index < 12; index++) {
        const username = faker.internet.username();
        const result = await auth.api.signUpEmail({
            body: {
                name: username,
                email: faker.internet.email(),
                password: faker.internet.password(),
                username,
                displayUsername: faker.internet.displayName(),
            },
        });
        if (result?.user?.email && faker.number.int({ min: 0, max: 1 }) === 1) {
            await db.user.update({
                where: { email: result.user.email },
                data: { emailVerified: true },
            });
        }
    }
};
