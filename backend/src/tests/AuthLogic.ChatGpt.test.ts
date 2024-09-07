import fs from 'fs';
import { AuthLogic } from './AuthLogic';
import { JwtToken } from 'common/src/logic/JwtToken';
import { PasswordEntity } from '../data/PasswordEntity';
import { PasswordLogic } from './PasswordLogic';
import { EntitiesDataSource } from '../data/EntitiesDataSource';
import { UserDto } from 'common/src/models/UserDto';
import { SecurableDto } from 'common/src/models/SecurableDto';

jest.mock('fs');
jest.mock('common/src/logic/JwtToken');
jest.mock('../data/EntitiesDataSource');
jest.mock('./PasswordLogic');

describe('AuthLogic', () => {
    const mockKey = 'mockPrivateKey';
    const mockUser: UserDto = { guid: '123', displayName: 'Test User', emailAddress: 'test@example.com', smsPhone: '123456789' };
    const mockSecurable: SecurableDto = { guid: '123', displayName: 'Test Securable' };

    beforeEach(() => {
        jest.clearAllMocks();
        (fs.readFileSync as jest.Mock).mockReturnValue(mockKey);
    });

    describe('tokenize', () => {
        it('should return a signed token', () => {
            const mockJwtTokenSign = jest.spyOn(JwtToken.prototype, 'sign').mockReturnValue('mockToken');
            const authLogic = new AuthLogic();
            const token = authLogic.tokenize();
            expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), { encoding: 'utf8' });
            expect(mockJwtTokenSign).toHaveBeenCalledWith(mockKey);
            expect(token).toEqual('mockToken');
        });
    });

    describe('passwordLogin', () => {
        const mockPasswordEntity = new PasswordEntity();
        const eds = new EntitiesDataSource();

        it('should throw error if user is not found', async () => {
            (eds.userRepository().findOneBy as jest.Mock).mockResolvedValue(null);

            await expect(AuthLogic.passwordLogin(eds, 'test@example.com', 'password'))
                .rejects
                .toThrow('Invalid login!');
        });

        it('should throw error if passwords are not found', async () => {
            (eds.userRepository().findOneBy as jest.Mock).mockResolvedValue(mockUser);
            (eds.passwordRepository().findBy as jest.Mock).mockResolvedValue([]);

            await expect(AuthLogic.passwordLogin(eds, 'test@example.com', 'password'))
                .rejects
                .toThrow('Invalid login!');
        });

        it('should throw error if password hash does not match', async () => {
            mockPasswordEntity.hash = 'wrongHash';
            (eds.userRepository().findOneBy as jest.Mock).mockResolvedValue(mockUser);
            (eds.passwordRepository().findBy as jest.Mock).mockResolvedValue([mockPasswordEntity]);

            const passwordLogicComputeHash = jest.spyOn(PasswordLogic.prototype, 'computeHash').mockReturnValue(mockPasswordEntity);
            await expect(AuthLogic.passwordLogin(eds, 'test@example.com', 'password'))
                .rejects
                .toThrow('Invalid login!');
            expect(passwordLogicComputeHash).toHaveBeenCalledWith('password');
        });

        it('should return AuthLogic instance on successful login', async () => {
            mockPasswordEntity.hash = 'correctHash';
            const mockRehashedPassword = new PasswordEntity();
            mockRehashedPassword.hash = 'correctHash';

            (eds.userRepository().findOneBy as jest.Mock).mockResolvedValue(mockUser);
            (eds.passwordRepository().findBy as jest.Mock).mockResolvedValue([mockPasswordEntity]);
            jest.spyOn(PasswordLogic.prototype, 'computeHash').mockReturnValue(mockRehashedPassword);
            jest.spyOn(AuthLogic, 'loadAllowedSecurablesForUser').mockResolvedValue([mockSecurable]);

            const result = await AuthLogic.passwordLogin(eds, 'test@example.com', 'password');
            expect(result.user).toEqual(mockUser);
            expect(result.securables).toEqual([mockSecurable]);
        });
    });

    describe('tokenLogin', () => {
        it('should throw error on invalid token', async () => {
            const invalidToken = 'invalidToken';
            (JwtToken.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token!'); });

            await expect(AuthLogic.tokenLogin(invalidToken)).rejects.toThrow('Invalid token!');
        });

        it('should return AuthLogic instance on valid token', async () => {
            const validToken = 'validToken';
            (JwtToken.verify as jest.Mock).mockReturnValue({
                data: {
                    user: mockUser,
                    securables: [mockSecurable]
                }
            });

            const result = await AuthLogic.tokenLogin(validToken);
            expect(result.user).toEqual(mockUser);
            expect(result.securables).toEqual([mockSecurable]);
        });
    });

    describe('loadAllowedSecurablesForUser', () => {
        const eds = new EntitiesDataSource();

        it('should load securables for a user', async () => {
            (eds.securableRepository().createQueryBuilder().getMany as jest.Mock).mockResolvedValue([mockSecurable]);

            const result = await AuthLogic.loadAllowedSecurablesForUser(eds, mockUser);
            expect(result).toEqual([mockSecurable]);
        });

        it('should return an empty array if no securables found', async () => {
            (eds.securableRepository().createQueryBuilder().getMany as jest.Mock).mockResolvedValue([]);

            const result = await AuthLogic.loadAllowedSecurablesForUser(eds, mockUser);
            expect(result).toEqual([]);
        });
    });
});