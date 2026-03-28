import SignInForm from '@/components/modules/Auth/signinForm';

interface LoginParams {
    searchParams: Promise<{ redirect?: string; verified?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
    const params = await searchParams;
    const redirectPath = params.redirect;
    const verified = params.verified === 'true';

    return <SignInForm redirectPath={redirectPath} verified={verified} />;
};

export default LoginPage;
