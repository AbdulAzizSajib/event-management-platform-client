import SignInForm from '@/components/modules/Auth/signinForm';

interface LoginParams {
    searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
    const params = await searchParams;
    const redirectPath = params.redirect;

    return <SignInForm redirectPath={redirectPath} />;
};

export default LoginPage;
